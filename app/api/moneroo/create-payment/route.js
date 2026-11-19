import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { consumeRateLimit } from '@/lib/rate-limit'

export async function POST(request) {
  try {
    const body = await request.json()
    const { paymentToken } = body

    const monerooUrl = process.env.MONEROO_API_URL
    const monerooApiKey = process.env.MONEROO_SECRET_KEY || process.env.MONEROO_API_KEY
    if (!monerooUrl || !monerooApiKey || !supabaseAdmin) {
      return NextResponse.json(
        {
          error: 'Le paiement en ligne n’est pas configuré.',
        },
        { status: 503 }
      )
    }

    if (typeof paymentToken !== 'string' || paymentToken.length < 20 || paymentToken.length > 200) {
      return NextResponse.json({ error: 'Lien de paiement invalide.' }, { status: 400 })
    }
    try {
      const allowed = await consumeRateLimit('payment-init', paymentToken, 10, 600)
      if (!allowed) return NextResponse.json({ error: 'Trop de tentatives. Réessayez dans quelques minutes.' }, { status: 429 })
    } catch {
      return NextResponse.json({ error: 'Service de sécurité indisponible. Réessayez plus tard.' }, { status: 503 })
    }

    const { data: invoice, error: invoiceError } = await supabaseAdmin
      .from('invoices')
      .select('id, invoice_number, total_amount, status, payment_token, clients(full_name, email)')
      .eq('payment_token', paymentToken)
      .maybeSingle()

    if (invoiceError) {
      return NextResponse.json({ error: 'Impossible de vérifier cette facture.' }, { status: 500 })
    }
    if (!invoice) {
      return NextResponse.json({ error: 'Facture introuvable.' }, { status: 404 })
    }
    if (!['sent', 'overdue'].includes(invoice.status)) {
      return NextResponse.json({ error: 'Cette facture ne peut pas être payée.' }, { status: 409 })
    }
    const amount = Number(invoice.total_amount)
    if (!Number.isSafeInteger(amount) || amount <= 0) {
      return NextResponse.json({ error: 'Montant de facture invalide.' }, { status: 400 })
    }
    if (!invoice.clients?.email) {
      return NextResponse.json({ error: 'Ajoutez une adresse e-mail au client pour créer le paiement.' }, { status: 422 })
    }

    const baseUrl = monerooUrl.replace(/\/$/, '')
    const apiUrl = baseUrl.endsWith('/payments/initialize')
      ? baseUrl
      : `${baseUrl}${baseUrl.endsWith('/v1') ? '' : '/v1'}/payments/initialize`

    // Exemple de payload. À adapter selon la vraie documentation Moneroo.
    const payload = {
      amount: Math.round(Number(amount) || 0),
      currency: 'XOF',
      description: `Paiement de la facture ${invoice.invoice_number}`,
      return_url: `${new URL(request.url).origin}/pay/${encodeURIComponent(paymentToken)}`,
      customer: {
        email: invoice.clients.email,
        first_name: invoice.clients.full_name?.trim().split(/\s+/)[0] || 'Client',
        last_name: invoice.clients.full_name?.trim().split(/\s+/).slice(1).join(' ') || 'Client',
      },
      metadata: {
        order_id: invoice.id,
        invoice_number: invoice.invoice_number,
      },
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${monerooApiKey}`,
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      return NextResponse.json(
        {
          error: 'Moneroo n’a pas pu créer le lien de paiement.',
        },
        { status: 502 }
      )
    }

    const checkoutUrl =
      data?.checkout_url ||
      data?.payment_url ||
      data?.url ||
      data?.data?.checkout_url ||
      data?.data?.payment_url

    if (!checkoutUrl) {
      return NextResponse.json(
        {
          error: 'Le réponse Moneroo ne contient pas d’URL de paiement. Vérifiez l’API et le format de réponse.',
        },
        { status: 500 }
      )
    }

    return NextResponse.json({ checkoutUrl })
  } catch {
    return NextResponse.json(
      {
        error: 'Erreur lors du démarrage du paiement.',
      },
      { status: 500 }
    )
  }
}
