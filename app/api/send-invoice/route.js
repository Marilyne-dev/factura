import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request) {
  try {
    const body = await request.json()
    const { to, clientName, invoiceNumber, totalAmount, dueDate, payUrl, companyName } = body

    if (!to || !invoiceNumber || !payUrl) {
      return Response.json({ error: 'Champs requis manquants.' }, { status: 400 })
    }

    const formattedAmount = new Intl.NumberFormat('fr-FR').format(Math.round(totalAmount || 0)) + ' XOF'
    const formattedDate = dueDate
      ? new Date(dueDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
      : ''

    const { data, error } = await resend.emails.send({
      from: 'Factura <onboarding@resend.dev>', // à remplacer par votre domaine vérifié ensuite
      to: [to],
      subject: `Facture ${invoiceNumber}${companyName ? ' — ' + companyName : ''}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; color: #1a1a1a;">
          <h2 style="margin-bottom: 4px;">Nouvelle facture${companyName ? ' de ' + companyName : ''}</h2>
          <p style="color: #555; font-size: 14px;">Bonjour ${clientName || ''},</p>
          <p style="color: #555; font-size: 14px;">
            Vous avez reçu une nouvelle facture d'un montant de
            <strong>${formattedAmount}</strong>${formattedDate ? `, à régler avant le <strong>${formattedDate}</strong>` : ''}.
          </p>
          <p style="text-align: center; margin: 28px 0;">
            <a href="${payUrl}" style="background:#1a3d2f;color:#fff;padding:14px 28px;border-radius:10px;text-decoration:none;font-weight:bold;display:inline-block;">
              Voir et payer la facture
            </a>
          </p>
          <p style="color: #999; font-size: 12px;">
            N° de facture : ${invoiceNumber}
          </p>
        </div>
      `,
    })

    if (error) {
      return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json({ success: true, id: data.id })
  } catch (e) {
    return Response.json({ error: e.message || 'Erreur inconnue.' }, { status: 500 })
  }
}