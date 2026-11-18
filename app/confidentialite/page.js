import LegalPage from '@/components/LegalPage'

export const metadata = { title: 'Politique de confidentialité', description: 'Données traitées par le service Factura et droits des utilisateurs.' }

export default function PrivacyPage() {
  return <LegalPage title="Politique de confidentialité">{({ publisher }) => <>
    <p>Cette page décrit, en termes généraux, les données traitées par la bêta de Factura. Responsable du traitement : {publisher.name || 'l’éditeur du service, à renseigner'}; contact : {publisher.email || 'à renseigner'}.</p>
    <h2>Données utilisées</h2>
    <p>Le service traite les données du compte (dont l’adresse e-mail), les informations d’entreprise et les coordonnées de clients saisies par l’utilisateur, les factures et les événements nécessaires au suivi des paiements et des e-mails.</p>
    <h2>Utilisation et prestataires</h2>
    <p>Ces données servent à fournir l’authentification, la création et l’envoi de factures, le stockage, le traitement des paiements configurés et la sécurité du service. Selon les fonctions utilisées, les prestataires techniques comprennent Supabase, Vercel, Resend et Moneroo.</p>
    <h2>Durée de conservation</h2>
    <p>Les règles de conservation et de suppression doivent être définies par l’éditeur en fonction des obligations applicables avant l’ouverture commerciale. Les données ne doivent pas être conservées au-delà de la durée nécessaire aux finalités et obligations retenues.</p>
    <h2>Vos droits</h2>
    <p>Pour demander l’accès, la rectification ou la suppression de vos données, contactez l’éditeur à {publisher.email || 'l’adresse de contact à renseigner'}. Les demandes sont traitées selon le droit applicable.</p>
    <h2>Sécurité et transferts</h2>
    <p>Les données sont hébergées par les prestataires configurés pour le service. Les lieux d’hébergement, transferts internationaux, contrats de sous-traitance et délais de réponse doivent être confirmés par l’éditeur avant publication définitive.</p>
  </>}</LegalPage>
}
