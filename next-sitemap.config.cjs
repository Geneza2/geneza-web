const SITE_URL =
  process.env.NEXT_PUBLIC_SERVER_URL ||
  process.env.VERCEL_PROJECT_PRODUCTION_URL ||
  'https://example.com'

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: SITE_URL,
  generateRobotsTxt: true,
  exclude: [
    '/posts-sitemap.xml',
    '/pages-sitemap.xml',
    '/goods-sitemap.xml',
    '/products-sitemap.xml',
    '/open-positions-sitemap.xml',
    '/*',
    '/posts/*',
    '/goods/*',
    '/products/*',
    '/open-positions/*',
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        disallow: '/admin/*',
      },
    ],
    additionalSitemaps: [
      `${SITE_URL}/sitemap.xml`,
      `${SITE_URL}/pages-sitemap.xml`,
      `${SITE_URL}/posts-sitemap.xml`,
      `${SITE_URL}/goods-sitemap.xml`,
      `${SITE_URL}/products-sitemap.xml`,
      `${SITE_URL}/open-positions-sitemap.xml`,
    ],
  },
}
