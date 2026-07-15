import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const body = await request.json()
    const { invoiceNumber, amount, email, customerName, redirectUrl } = body

    const monerooUrl = process.env.MONEROO_API_URL
    const monerooApiKey = process.env.MONEROO_API_KEY
    const monerooSecretKey = process.env.MONEROO_SECRET_KEY

    if (!monerooUrl || !monerooApiKey || !monerooSecretKey) {
      return NextResponse.json(
        {
          error: 'Configurez MONEROO_API_URL, MONEROO_API_KEY et MONEROO_SECRET_KEY dans votre .env.local.',
        },
        { status: 500 }
      )
    }

    // Exemple de payload. À adapter selon la vraie documentation Moneroo.
    const payload = {
      amount: Math.round(Number(amount) || 0),
      currency: 'XOF',
      reference: invoiceNumber,
      customer_email: email || '',
      customer_name: customerName || 'Client',
      redirect_url: redirectUrl || '',
      metadata: {
        source: 'factura-app',
      },
    }

    const response = await fetch(`${monerooUrl.replace(/\/$/, '')}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${monerooApiKey}`,
        'X-Secret-Key': monerooSecretKey,
      },
      body: JSON.stringify(payload),
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      return NextResponse.json(
        {
          error: data?.message || 'Échec de la création du paiement Moneroo.',
        },
        { status: response.status }
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
  } catch (error) {
    return NextResponse.json(
      {
        error: error?.message || 'Erreur inconnue lors du démarrage du paiement.',
      },
      { status: 500 }
    )
  }
}
