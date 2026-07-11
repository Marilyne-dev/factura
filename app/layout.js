import './globals.css'

export const metadata = {
  title: "Factura — Vos factures, payées à l'heure",
  description: "Factura relance vos clients impayés via WhatsApp et encaisse en Mobile Money — automatiquement. Fait pour l'Afrique de l'Ouest et l'Europe.",
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}