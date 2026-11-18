import LegalPage from '@/components/LegalPage'

export const metadata = { title: 'Contact', description: 'Contacter l’équipe Factura.' }

export default function ContactPage() {
  return <LegalPage title="Contact">{({ publisher }) => <>
    <p>Pour toute question sur Factura, son compte bêta ou vos données personnelles :</p>
    {publisher.email ? <p><a href={`mailto:${publisher.email}`}>{publisher.email}</a></p> : <div className="legal-alert">L’adresse de contact n’est pas encore configurée. La page ne peut pas être publiée comme contact réel avant sa configuration.</div>}
    {publisher.phone && <p>Téléphone : <a href={`tel:${publisher.phone}`}>{publisher.phone}</a></p>}
  </>}</LegalPage>
}
