const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://factura-gules.vercel.app'

export default function sitemap() {
  return [{
    url: siteUrl.replace(/\/$/, ''),
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 1,
  }]
}
