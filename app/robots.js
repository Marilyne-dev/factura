const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://factura-gules.vercel.app'

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard', '/clients', '/invoices', '/settings', '/api', '/pay', '/login', '/register', '/forgot-password', '/reset-password'],
    },
    sitemap: `${siteUrl.replace(/\/$/, '')}/sitemap.xml`,
  }
}
