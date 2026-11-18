import Link from 'next/link'

export default function NotFound() {
  return (
    <main style={{ minHeight: '70vh', display: 'grid', placeItems: 'center', padding: 32, textAlign: 'center' }}>
      <div>
        <p style={{ fontSize: 14, fontWeight: 700, letterSpacing: '.12em' }}>FACTURA</p>
        <h1>Page introuvable</h1>
        <p>Cette adresse n’existe pas ou la page a été déplacée.</p>
        <Link href="/">Retour à l’accueil</Link>
      </div>
    </main>
  )
}
