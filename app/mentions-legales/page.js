import LegalPage from '@/components/LegalPage'

export const metadata = { title: 'Mentions légales', description: 'Informations sur l’éditeur et l’hébergement de Factura.' }

export default function LegalNoticesPage() {
  return <LegalPage title="Mentions légales">{({ publisher }) => <>
    <p>Éditeur du service : <strong>{publisher.name || 'Information à renseigner'}</strong>{publisher.status ? ` (${publisher.status})` : ''}.</p>
    <p>Adresse professionnelle : {publisher.address || 'Information à renseigner'}.</p>
    <p>Numéro d’immatriculation : {publisher.registration || 'Non communiqué'}.</p>
    <p>Contact : {publisher.email ? <a href={`mailto:${publisher.email}`}>{publisher.email}</a> : 'Information à renseigner'}{publisher.phone ? ` · ${publisher.phone}` : ''}.</p>
    <h2>Hébergement</h2>
    <p>Hébergeur : {publisher.host || 'Information à renseigner'}.</p>
    <p>Adresse de l’hébergeur : {publisher.hostAddress || 'Information à renseigner'}.</p>
  </>}</LegalPage>
}
