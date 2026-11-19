import LegalPage from '@/components/LegalPage'

export const metadata = { title: 'Conditions d’utilisation', description: 'Conditions d’accès à la bêta de Factura.' }

export default function TermsPage() {
  return <LegalPage title="Conditions d’utilisation">{({ publisher }) => <>
    <p>Ces conditions décrivent l’accès à la version bêta de Factura, éditée par {publisher.name || 'l’éditeur à renseigner'}.</p>
    <h2>Service bêta</h2>
    <p>Factura permet de gérer des clients et factures en XOF, de produire des documents PDF, de suivre des statuts et, si le compte marchand est configuré, d’initier un paiement en ligne. Des interruptions et changements peuvent survenir pendant la bêta.</p>
    <h2>Compte et données</h2>
    <p>L’utilisateur est responsable de l’exactitude des informations qu’il saisit, de la protection de ses accès et de la licéité du traitement des données de ses clients.</p>
    <h2>Offres et paiement</h2>
    <p>Aucune offre d’abonnement payante ni aucun paiement d’offre n’est actuellement proposé. Les tarifs et conditions d’une éventuelle offre future seront publiés avant son ouverture.</p>
    <h2>Limites</h2>
    <p>Factura est un outil de gestion. L’utilisateur reste responsable de la conformité de ses factures, de ses obligations fiscales et de la validation des paiements reçus.</p>
    <h2>Contact</h2>
    <p>{publisher.email ? <a href={`mailto:${publisher.email}`}>{publisher.email}</a> : 'Coordonnées à compléter avant lancement.'}</p>
  </>}</LegalPage>
}
