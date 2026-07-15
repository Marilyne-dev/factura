import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(request) {
  try {
    const rawBody = await request.text()
    const signature = request.headers.get('x-moneroo-signature') || request.headers.get('x-webhook-signature') || ''
    const expectedSecret = process.env.MONEROO_WEBHOOK_SECRET || ''

    if (expectedSecret && signature !== expectedSecret) {
      return NextResponse.json({ ok: false, error: 'Signature webhook invalide.' }, { status: 401 })
    }

    let body = {}
    try {
      body = rawBody ? JSON.parse(rawBody) : {}
    } catch {
      body = {}
    }

    const event = body?.event || body?.type || body?.status || ''
    const reference = body?.reference || body?.invoice_number || body?.metadata?.reference || body?.data?.reference || body?.data?.invoice_number || ''
    const amount = body?.amount || body?.total_amount || body?.data?.amount || body?.data?.total_amount || null
    const status = body?.status || body?.state || body?.data?.status || body?.data?.state || ''

    if (!supabaseAdmin) {
      return NextResponse.json({ ok: false, error: 'Supabase admin non configuré.' }, { status: 500 })
    }

    const normalizedStatus = String(status).toLowerCase()
    let invoiceStatus = null
    if (['paid', 'success', 'succeeded', 'completed', 'confirmed'].includes(normalizedStatus)) {
      invoiceStatus = 'paid'
    } else if (['failed', 'error', 'cancelled', 'canceled'].includes(normalizedStatus)) {
      invoiceStatus = 'cancelled'
    }

    if (!reference || !invoiceStatus) {
      return NextResponse.json({ ok: true, received: true, ignored: true })
    }

    const { data: invoice } = await supabaseAdmin
      .from('invoices')
      .select('id, user_id')
      .eq('invoice_number', reference)
      .maybeSingle()

    if (!invoice) {
      return NextResponse.json({ ok: true, received: true, ignored: true })
    }

    const payload = {
      status: invoiceStatus,
      paid_at: invoiceStatus === 'paid' ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    }

    const { error } = await supabaseAdmin.from('invoices').update(payload).eq('id', invoice.id)

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
    }

    await supabaseAdmin.from('reminders_log').insert({
      user_id: invoice.user_id,
      invoice_id: invoice.id,
      type: 'payment_received',
      status: invoiceStatus,
      amount: amount || null,
      invoice_number: reference,
    })

    return NextResponse.json({ ok: true, updated: true, event, reference, status: invoiceStatus })
  } catch (error) {
    return NextResponse.json({ ok: false, error: error?.message || 'Erreur webhook Moneroo.' }, { status: 500 })
  }
}
