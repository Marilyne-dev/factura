import { Resend } from 'resend'
import { NextResponse } from 'next/server'
import { formatInvoiceDate } from '@/lib/invoice-utils.mjs'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { consumeRateLimit } from '@/lib/rate-limit'

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character])
}

export async function POST(request) {
  try {
    const authorization = request.headers.get('authorization') || ''
    const accessToken = authorization.startsWith('Bearer ') ? authorization.slice(7) : ''
    if (!accessToken || !supabaseAdmin) {
      return NextResponse.json({ error: 'Connexion requise.' }, { status: 401 })
    }
    const { data: authData, error: authError } = await supabaseAdmin.auth.getUser(accessToken)
    if (authError || !authData.user) {
      return NextResponse.json({ error: 'Session invalide. Reconnectez-vous.' }, { status: 401 })
    }
    try {
      if (!await consumeRateLimit('send-invoice', authData.user.id, 10, 3600)) {
        return NextResponse.json({ error: 'Limite d’envoi atteinte. Réessayez plus tard.' }, { status: 429 })
      }
    } catch {
      return NextResponse.json({ error: 'Service de sécurité indisponible. Réessayez plus tard.' }, { status: 503 })
    }

    const body = await request.json()
    const invoiceId = typeof body?.invoiceId === 'string' ? body.invoiceId : ''
    if (!invoiceId) return NextResponse.json({ error: 'Facture invalide.' }, { status: 400 })

    const { data: invoice, error: invoiceError } = await supabaseAdmin
      .from('invoices')
      .select('id, user_id, invoice_number, status, total_amount, due_date, payment_token, clients(full_name, email)')
      .eq('id', invoiceId)
      .eq('user_id', authData.user.id)
      .maybeSingle()
    if (invoiceError) return NextResponse.json({ error: 'Impossible de charger la facture.' }, { status: 500 })
    if (!invoice) return NextResponse.json({ error: 'Facture introuvable.' }, { status: 404 })
    if (['paid', 'cancelled'].includes(invoice.status)) {
      return NextResponse.json({ error: 'Cette facture ne peut pas être envoyée.' }, { status: 409 })
    }
    if (!invoice.clients?.email || !invoice.payment_token) {
      return NextResponse.json({ error: 'Ajoutez un e-mail au client et vérifiez le lien de paiement.' }, { status: 422 })
    }

    const apiKey = process.env.RESEND_API_KEY
    const from = process.env.RESEND_FROM_EMAIL
    if (!apiKey || !from) {
      return NextResponse.json({ error: 'L’envoi d’e-mail n’est pas configuré.' }, { status: 503 })
    }
    const { data: company } = await supabaseAdmin
      .from('companies')
      .select('name')
      .eq('user_id', authData.user.id)
      .maybeSingle()

    const siteUrl = process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : new URL(request.url).origin)
    const payUrl = `${siteUrl.replace(/\/$/, '')}/pay/${encodeURIComponent(invoice.payment_token)}`
    const clientName = escapeHtml(invoice.clients.full_name || '')
    const invoiceNumber = escapeHtml(invoice.invoice_number)
    const companyName = escapeHtml(company?.name || '')
    const formattedAmount = new Intl.NumberFormat('fr-FR').format(Math.round(Number(invoice.total_amount) || 0)) + ' XOF'
    const formattedDate = formatInvoiceDate(invoice.due_date, { day: 'numeric', month: 'long', year: 'numeric' })

    const resend = new Resend(apiKey)
    const { data, error } = await resend.emails.send({
      from,
      to: [invoice.clients.email],
      subject: `Facture ${invoiceNumber}${companyName ? ` — ${companyName}` : ''}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;color:#1a1a1a">
          <h2>Nouvelle facture${companyName ? ` de ${companyName}` : ''}</h2>
          <p style="color:#555">Bonjour ${clientName},</p>
          <p style="color:#555">Vous avez reçu une facture d’un montant de <strong>${formattedAmount}</strong>${formattedDate ? `, à régler avant le <strong>${escapeHtml(formattedDate)}</strong>` : ''}.</p>
          <p style="text-align:center;margin:28px 0"><a href="${escapeHtml(payUrl)}" style="background:#1a3d2f;color:#fff;padding:14px 28px;border-radius:10px;text-decoration:none;font-weight:bold">Voir la facture</a></p>
          <p style="color:#999;font-size:12px">N° de facture : ${invoiceNumber}</p>
        </div>
      `,
    })
    if (error || !data?.id) {
      return NextResponse.json({ error: 'L’e-mail n’a pas pu être envoyé. Vérifiez la configuration du domaine d’envoi.' }, { status: 502 })
    }
    return NextResponse.json({ success: true, id: data.id })
  } catch {
    return NextResponse.json({ error: 'Erreur lors de l’envoi de l’e-mail.' }, { status: 500 })
  }
}
