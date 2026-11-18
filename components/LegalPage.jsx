export function legalPublisher() {
  return {
    name: process.env.FACTURA_LEGAL_NAME || '',
    status: process.env.FACTURA_LEGAL_STATUS || '',
    address: process.env.FACTURA_LEGAL_ADDRESS || '',
    registration: process.env.FACTURA_LEGAL_REGISTRATION || '',
    email: process.env.FACTURA_CONTACT_EMAIL || '',
    phone: process.env.FACTURA_CONTACT_PHONE || '',
    host: process.env.FACTURA_HOST_NAME || '',
    hostAddress: process.env.FACTURA_HOST_ADDRESS || '',
  }
}

export default function LegalPage({ title, children }) {
  const publisher = legalPublisher()
  const required = [publisher.name, publisher.status, publisher.address, publisher.email, publisher.host, publisher.hostAddress]
  const incomplete = required.some((value) => !value)
  return (
    <main className="legal-page">
      <style>{LEGAL_CSS}</style>
      <nav><a href="/">Factura</a><a href="/contact">Contact</a></nav>
      <article>
        <p className="legal-eyebrow">Factura · Bêta</p>
        <h1>{title}</h1>
        {incomplete && <div className="legal-alert" role="note"><strong>Page à compléter avant lancement public.</strong> Les informations juridiques ou de contact de l’éditeur/hébergeur ne sont pas toutes configurées.</div>}
        {children({ publisher })}
        <footer>Dernière mise à jour : 18 novembre 2026</footer>
      </article>
    </main>
  )
}

const LEGAL_CSS = `
.legal-page { min-height:100vh; padding:28px 20px 64px; background:var(--brume); color:var(--nuit); font-family:var(--fb); }.legal-page nav { max-width:860px; margin:0 auto 30px; display:flex; justify-content:space-between; }.legal-page nav a { color:var(--forest); font-weight:700; text-decoration:none; }.legal-page article { max-width:860px; margin:0 auto; padding:36px; border:1px solid var(--border); border-radius:16px; background:white; }.legal-eyebrow { color:var(--pierre); font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:.08em; }.legal-page h1 { margin:8px 0 26px; font-size:32px; }.legal-page h2 { margin:28px 0 10px; font-size:19px; }.legal-page p,.legal-page li { color:#30384b; font-size:15px; line-height:1.75; }.legal-page a { color:var(--forest); }.legal-alert { margin:18px 0; padding:14px 16px; border:1px solid #e6b850; border-radius:9px; background:#fff7d6; color:#604900; line-height:1.6; }.legal-page footer { margin-top:40px; border-top:1px solid var(--border); padding-top:18px; color:var(--pierre); font-size:12px; }
@media(max-width:600px) { .legal-page { padding:18px 12px 40px; }.legal-page article { padding:22px 18px; }.legal-page h1 { font-size:26px; } }
`
