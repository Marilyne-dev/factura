import './globals.css'

export const metadata = {
  title: { default: 'Factura — Facturation en XOF', template: '%s | Factura' },
  description: 'Créez, envoyez et suivez vos factures en XOF. Rappels manuels et paiements en ligne selon la configuration du compte.',
}
export default function RootLayout({ children }) {
  return (
    <html lang="fr" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Inter:wght@300;400;500;600;700&family=Outfit:wght@600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
