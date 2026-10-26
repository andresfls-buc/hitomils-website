const configuredUrl = new URL(
  process.env.NEXT_PUBLIC_SITE_URL || 'https://www.makeupbyhitomi.com',
)

// Production redirects the bare domain to www; all SEO URLs must agree.
if (['makeupbyhitomi.com', 'www.makeupbyhitomi.com'].includes(configuredUrl.hostname)) {
  configuredUrl.protocol = 'https:'
  configuredUrl.hostname = 'www.makeupbyhitomi.com'
  configuredUrl.port = ''
}

export const siteUrl = configuredUrl.origin
