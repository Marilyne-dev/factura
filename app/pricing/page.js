import Link from 'next/link'

export const metadata = {
  title: 'Offres et tarifs',
  description: 'Comparez les offres Factura pour la facturation en XOF.',
}

export default function PricingPage() {
  return (
    <main className="pricing-page">
      <style>{PRICING_CSS}</style>
      <Link href="/" className="pricing-brand">← Factura</Link>
      <header><p>Offres Factura</p><h1>Choisissez votre formule</h1><span>Les paiements sont effectués manuellement à chaque période de 30 jours. Aucun prélèvement automatique.</span></header>
      <div className="pricing-cards">
        <section><p className="pricing-label">Pour démarrer</p><h2>Gratuit</h2><p className="pricing-price">0 <small>XOF / mois</small></p><ul><li>5 nouvelles factures par mois</li><li>Gestion des clients</li><li>Export PDF</li><li>Suivi des échéances et paiements</li></ul><Link href="/register">Créer un compte gratuit</Link></section>
        <section className="pricing-pro"><p className="pricing-label">Sans limite mensuelle</p><h2>Pro</h2><p className="pricing-price">9 900 <small>XOF / 30 jours</small></p><ul><li>Factures illimitées</li><li>Gestion des clients</li><li>Export PDF</li><li>Suivi des échéances et paiements</li></ul><Link href="/register">Créer un compte</Link></section>
      </div>
      <p className="pricing-note">Les rappels WhatsApp automatiques ne sont pas disponibles à ce jour; les rappels envoyés depuis une facture restent manuels. L’offre Pro n’inclut pas cette fonction.</p>
      <Link href="/contact">Questions sur les offres ? Contact</Link>
    </main>
  )
}

const PRICING_CSS = `
.pricing-page { min-height:100vh; padding:28px 20px 64px; background:var(--brume); color:var(--nuit); font-family:var(--fb); }.pricing-brand { display:block; max-width:920px; margin:0 auto 36px; color:var(--forest); font-weight:700; }.pricing-page header { max-width:760px; margin:0 auto 28px; text-align:center; }.pricing-page header p { color:var(--forest); font-size:12px; font-weight:800; text-transform:uppercase; letter-spacing:.1em; }.pricing-page header h1 { font-size:36px; margin:8px 0; }.pricing-page header span { color:var(--pierre); line-height:1.6; }.pricing-cards { max-width:760px; margin:auto; display:grid; grid-template-columns:1fr 1fr; gap:16px; }.pricing-cards section { display:flex; flex-direction:column; padding:24px; border:1px solid var(--border); border-radius:14px; background:white; }.pricing-cards .pricing-pro { border:2px solid var(--forest); }.pricing-label { color:var(--pierre); font-size:12px; text-transform:uppercase; font-weight:700; }.pricing-cards h2 { margin:5px 0; font-size:23px; }.pricing-price { font-size:26px; font-weight:800; margin:8px 0 18px; }.pricing-price small { font-size:13px; color:var(--pierre); font-weight:500; }.pricing-cards ul { flex:1; padding-left:20px; line-height:1.9; color:#30384b; }.pricing-cards a { display:block; padding:12px; border-radius:8px; text-align:center; background:var(--forest); color:white; font-weight:700; text-decoration:none; }.pricing-cards .pricing-pro a { background:var(--gold); color:var(--nuit); }.pricing-note { max-width:760px; margin:20px auto; color:var(--pierre); font-size:13px; line-height:1.6; }.pricing-page > a:last-child { display:block; max-width:760px; margin:20px auto; color:var(--forest); font-weight:700; }
@media(max-width:650px) { .pricing-cards { grid-template-columns:1fr; }.pricing-page header h1 { font-size:29px; } }
`
