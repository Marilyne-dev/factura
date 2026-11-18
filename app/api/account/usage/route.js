import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export const dynamic = 'force-dynamic'

export async function GET(request) {
  const authorization = request.headers.get('authorization') || ''
  const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : ''
  if (!token || !supabaseAdmin) return NextResponse.json({ error: 'Connexion requise.' }, { status: 401 })

  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
  if (authError || !user) return NextResponse.json({ error: 'Session invalide.' }, { status: 401 })

  const now = new Date()
  const month = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}-01`
  const { data, error } = await supabaseAdmin
    .from('invoice_usage')
    .select('invoice_count')
    .eq('user_id', user.id)
    .eq('usage_month', month)
    .maybeSingle()

  if (error) return NextResponse.json({ error: 'Le compteur de factures est indisponible.' }, { status: 503 })
  return NextResponse.json({ used: data?.invoice_count || 0, limit: 5, plan: 'free' })
}
