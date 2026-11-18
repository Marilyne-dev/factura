import { createHmac, timingSafeEqual } from 'node:crypto'
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(request) {
  try {
    const rawBody = await request.text()
    const signature = request.headers.get('x-moneroo-signature') || ''
    const expectedSecret = process.env.MONEROO_WEBHOOK_SECRET
    if (!expectedSecret || !signature) {
      return NextResponse.json({ ok: false, error: 'Webhook non configuré.' }, { status: 503 })
    }

    const expectedSignature = createHmac('sha256', expectedSecret).update(rawBody).digest()
    let receivedSignature
    try {
      receivedSignature = Buffer.from(signature, 'hex')
    } catch {
      receivedSignature = Buffer.alloc(0)
    }
    if (
      receivedSignature.length !== expectedSignature.length ||
      !timingSafeEqual(receivedSignature, expectedSignature)
    ) {
      return NextResponse.json({ ok: false, error: 'Signature webhook invalide.' }, { status: 403 })
    }

    let body = {}
    try {
      body = rawBody ? JSON.parse(rawBody) : {}
    } catch {
      body = {}
    }

    const event = body?.event || ''
    const payment = body?.data || {}
    const reference = payment?.metadata?.order_id || body?.metadata?.order_id || payment?.metadata?.invoice_number || payment?.invoice_number || ''
    const paymentId = payment?.id || ''

    if (!supabaseAdmin) {
      return NextResponse.json({ ok: false, error: 'Supabase admin non configuré.' }, { status: 500 })
    }

    if (event !== 'payment.success' || !reference || !paymentId) {
      return NextResponse.json({ ok: true, received: true, ignored: true })
    }

    const isInvoiceId = /^[0-9a-f-]{36}$/i.test(reference)
    const invoiceQuery = supabaseAdmin
      .from('invoices')
      .select('id, user_id, invoice_number, total_amount, status')
      .eq(isInvoiceId ? 'id' : 'invoice_number', reference)
    const { data: invoice, error: lookupError } = await invoiceQuery.maybeSingle()

    if (lookupError) {
      return NextResponse.json({ ok: false, error: 'Impossible de vérifier la facture.' }, { status: 500 })
    }
    if (!invoice || !['sent', 'overdue'].includes(invoice.status)) {
      return NextResponse.json({ ok: true, received: true, ignored: true })
    }

    const monerooUrl = process.env.MONEROO_API_URL
    const monerooApiKey = process.env.MONEROO_SECRET_KEY || process.env.MONEROO_API_KEY
    if (!monerooUrl || !monerooApiKey) {
      return NextResponse.json({ ok: false, error: 'Vérification du paiement non configurée.' }, { status: 503 })
    }
    const baseUrl = monerooUrl.replace(/\/$/, '').replace(/\/v1\/payments\/initialize$/, '').replace(/\/v1$/, '')
    const verificationResponse = await fetch(`${baseUrl}/v1/payments/${encodeURIComponent(paymentId)}`, {
      headers: { Authorization: `Bearer ${monerooApiKey}`, Accept: 'application/json' },
      signal: AbortSignal.timeout(2500),
    })
    if (!verificationResponse.ok) {
      return NextResponse.json({ ok: false, error: 'Le paiement ne peut pas être vérifié.' }, { status: 503 })
    }
    const verification = await verificationResponse.json().catch(() => ({}))
    const verifiedPayment = verification?.data
    if (
      !verifiedPayment ||
      verifiedPayment.status !== 'success' ||
      Number(verifiedPayment.amount) !== Number(invoice.total_amount) ||
      verifiedPayment.currency !== 'XOF' ||
      String(verifiedPayment.metadata?.order_id || '') !== invoice.id
    ) {
      return NextResponse.json({ ok: true, received: true, ignored: true })
    }

    const payload = {
      status: 'paid',
      paid_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const { data: updatedInvoice, error } = await supabaseAdmin
      .from('invoices')
      .update(payload)
      .eq('id', invoice.id)
      .in('status', ['sent', 'overdue'])
      .select('id')
      .maybeSingle()

    if (error) {
      return NextResponse.json({ ok: false, error: 'Impossible de mettre à jour la facture.' }, { status: 500 })
    }

    if (!updatedInvoice) return NextResponse.json({ ok: true, received: true, ignored: true })

    await supabaseAdmin.from('reminders_log').insert({
      user_id: invoice.user_id,
      invoice_id: invoice.id,
      type: 'payment_received',
      status: 'paid',
      amount: verifiedPayment.amount,
      invoice_number: invoice.invoice_number,
    })

    return NextResponse.json({ ok: true, updated: true, event, reference, status: 'paid' })
  } catch {
    return NextResponse.json({ ok: false, error: 'Erreur lors du traitement du webhook.' }, { status: 500 })
  }
}
