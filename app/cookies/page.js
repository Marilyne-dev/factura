import LegalPage from '@/components/LegalPage'

export const metadata = { title: 'Cookies et stockage local', description: 'Informations sur les cookies et le stockage utilisés par Factura.' }

export default function CookiesPage() {
  return <LegalPage title="Cookies et stockage local">{() => <>
    <p>La bêta utilise le stockage technique nécessaire à la connexion et au maintien de la session Supabase. Aucun outil publicitaire ou de mesure d’audience n’est actuellement déclaré dans le code de l’application.</p>
    <p>Les intégrations et fournisseurs peuvent appliquer leurs propres cookies lors de l’ouverture de leurs services, notamment pendant un paiement hébergé. Leurs politiques s’appliquent alors.</p>
    <p>Si des outils non essentiels sont ajoutés, leur finalité et le mécanisme de consentement devront être mis à jour avant leur activation.</p>
  </>}</LegalPage>
}
