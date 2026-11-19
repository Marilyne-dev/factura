import { createCipheriv, randomBytes } from 'node:crypto'
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { consumeRateLimit } from '@/lib/rate-limit'

const SECRET_FIELDS = [
  'fedapay_secret_key_encrypted',
  'cinetpay_api_key_encrypted',
  'twilio_auth_token_encrypted',
  'termii_api_key_encrypted',
]
const PUBLIC_FIELDS = [
  'payment_provider',
  'fedapay_public_key',
  'cinetpay_site_id',
  'messaging_provider',
  'twilio_account_sid',
  'twilio_whatsapp_number',
]

function getEncryptionKey() {
  const encodedKey = process.env.INTEGRATION_ENCRYPTION_KEY
  if (!encodedKey) return null
  const key = Buffer.from(encodedKey, 'base64')
  return key.length === 32 ? key : null
}

function encryptSecret(value, key) {
  const iv = randomBytes(12)
  const cipher = createCipheriv('aes-256-gcm', key, iv)
  const encrypted = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()])
  return `enc:v1:${iv.toString('base64')}:${cipher.getAuthTag().toString('base64')}:${encrypted.toString('base64')}`
}

async function getUser(request) {
  if (!supabaseAdmin) return { error: 'Service indisponible.', status: 503 }
  const authorization = request.headers.get('authorization') || ''
  const accessToken = authorization.startsWith('Bearer ') ? authorization.slice(7) : ''
  if (!accessToken) return { error: 'Connexion requise.', status: 401 }
  const { data, error } = await supabaseAdmin.auth.getUser(accessToken)
  if (error || !data.user) return { error: 'Session invalide.', status: 401 }
  return { user: data.user }
}

export async function GET(request) {
  const auth = await getUser(request)
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status })

  const { data, error } = await supabaseAdmin
    .from('integration_settings')
    .select('*')
    .eq('user_id', auth.user.id)
    .maybeSingle()
  if (error) return NextResponse.json({ error: 'Impossible de charger les intégrations.' }, { status: 500 })

  const settings = Object.fromEntries(PUBLIC_FIELDS.map((field) => [field, data?.[field] || '']))
  const secrets = Object.fromEntries(SECRET_FIELDS.map((field) => [
    field,
    { saved: Boolean(data?.[field]?.startsWith('enc:v1:')), legacy: Boolean(data?.[field] && !data[field].startsWith('enc:v1:')) },
  ]))
  return NextResponse.json({ settings, secrets })
}

export async function PUT(request) {
  const auth = await getUser(request)
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status })
  try {
    if (!await consumeRateLimit('integration-update', auth.user.id, 20, 600)) {
      return NextResponse.json({ error: 'Trop de modifications. Réessayez dans quelques minutes.' }, { status: 429 })
    }
  } catch {
    return NextResponse.json({ error: 'Service de sécurité indisponible. Réessayez plus tard.' }, { status: 503 })
  }
  const key = getEncryptionKey()
  if (!key) {
    return NextResponse.json({ error: 'Le chiffrement des intégrations doit être configuré sur le serveur.' }, { status: 503 })
  }

  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 })
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 })
  }

  const { data: current, error: currentError } = await supabaseAdmin
    .from('integration_settings')
    .select('*')
    .eq('user_id', auth.user.id)
    .maybeSingle()
  if (currentError) return NextResponse.json({ error: 'Impossible de charger les intégrations.' }, { status: 500 })

  const payload = { user_id: auth.user.id }
  for (const field of PUBLIC_FIELDS) {
    if (body[field] !== undefined) payload[field] = String(body[field]).slice(0, 500)
  }
  for (const field of SECRET_FIELDS) {
    const secret = body[field]
    const oldSecret = current?.[field]
    payload[field] = typeof secret === 'string' && secret.length
      ? encryptSecret(secret, key)
      : oldSecret?.startsWith('enc:v1:') ? oldSecret : null
  }

  const { error } = await supabaseAdmin
    .from('integration_settings')
    .upsert(payload, { onConflict: 'user_id' })
  if (error) return NextResponse.json({ error: 'Impossible d’enregistrer les intégrations.' }, { status: 500 })
  return NextResponse.json({ success: true })
}
