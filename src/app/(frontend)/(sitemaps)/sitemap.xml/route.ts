import { getServerSideSitemapIndex } from 'next-sitemap'
import { unstable_cache } from 'next/cache'

const getSitemapIndex = unstable_cache(
  async () => {
    const SITE_URL =
      process.env.NEXT_PUBLIC_SERVER_URL ||
      process.env.VERCEL_PROJECT_PRODUCTION_URL ||
      'https://example.com'

    const sitemaps = [
      `${SITE_URL}/pages-sitemap.xml`,
      `${SITE_URL}/posts-sitemap.xml`,
      `${SITE_URL}/goods-sitemap.xml`,
      `${SITE_URL}/products-sitemap.xml`,
      `${SITE_URL}/open-positions-sitemap.xml`,
    ]

    return sitemaps
  },
  ['sitemap-index'],
  {
    tags: ['sitemap-index'],
  },
)

export async function GET() {
  const sitemaps = await getSitemapIndex()

  return getServerSideSitemapIndex(sitemaps)
}

