import { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const payload = await getPayload({ config: configPromise })

    const baseUrl =
      process.env.NEXT_PUBLIC_SERVER_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
      (process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : null) ||
      'https://example.com'

    const sitemap: MetadataRoute.Sitemap = [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
      {
        url: `${baseUrl}/en`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/rs`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/en/goods`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      },
      {
        url: `${baseUrl}/rs/goods`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      },
      {
        url: `${baseUrl}/en/products`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      },
      {
        url: `${baseUrl}/rs/products`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      },
      {
        url: `${baseUrl}/en/posts`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      },
      {
        url: `${baseUrl}/rs/posts`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      },
      {
        url: `${baseUrl}/en/open-positions`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.6,
      },
      {
        url: `${baseUrl}/rs/open-positions`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.6,
      },
    ]

    // Get all pages
    const pages = await payload.find({
      collection: 'pages',
      limit: 1000,
      where: {
        _status: {
          equals: 'published',
        },
      },
    })

    // Get all posts
    const posts = await payload.find({
      collection: 'posts',
      limit: 1000,
      where: {
        _status: {
          equals: 'published',
        },
      },
    })

    // Get all products
    const products = await payload.find({
      collection: 'products',
      limit: 1000,
      where: {
        _status: {
          equals: 'published',
        },
      },
    })

    // Get all goods
    const _goods = await payload.find({
      collection: 'goods',
      limit: 1000,
      where: {
        _status: {
          equals: 'published',
        },
      },
    })

    // Get all open positions
    const openPositions = await payload.find({
      collection: 'openPositions',
      limit: 1000,
      where: {
        _status: {
          equals: 'published',
        },
      },
    })

    // Add pages
    pages.docs.forEach((page) => {
      if (page.slug) {
        sitemap.push({
          url: `${baseUrl}/en/${page.slug}`,
          lastModified: new Date(page.updatedAt),
          changeFrequency: 'monthly',
          priority: 0.6,
        })
        sitemap.push({
          url: `${baseUrl}/rs/${page.slug}`,
          lastModified: new Date(page.updatedAt),
          changeFrequency: 'monthly',
          priority: 0.6,
        })
      }
    })

    // Add posts
    posts.docs.forEach((post) => {
      if (post.slug) {
        sitemap.push({
          url: `${baseUrl}/en/posts/${post.slug}`,
          lastModified: new Date(post.updatedAt),
          changeFrequency: 'weekly',
          priority: 0.7,
        })
        sitemap.push({
          url: `${baseUrl}/rs/posts/${post.slug}`,
          lastModified: new Date(post.updatedAt),
          changeFrequency: 'weekly',
          priority: 0.7,
        })
      }
    })

    // Add products
    products.docs.forEach((product) => {
      if (product.slug) {
        sitemap.push({
          url: `${baseUrl}/en/products/${product.slug}`,
          lastModified: new Date(product.updatedAt),
          changeFrequency: 'monthly',
          priority: 0.8,
        })
        sitemap.push({
          url: `${baseUrl}/rs/products/${product.slug}`,
          lastModified: new Date(product.updatedAt),
          changeFrequency: 'monthly',
          priority: 0.8,
        })
      }
    })

    // Add open positions
    openPositions.docs.forEach((position) => {
      if ('slug' in position && position.slug) {
        sitemap.push({
          url: `${baseUrl}/en/open-positions/${position.slug}`,
          lastModified: new Date(position.updatedAt),
          changeFrequency: 'weekly',
          priority: 0.6,
        })
        sitemap.push({
          url: `${baseUrl}/rs/open-positions/${position.slug}`,
          lastModified: new Date(position.updatedAt),
          changeFrequency: 'weekly',
          priority: 0.6,
        })
      }
    })

    return sitemap
  } catch (error) {
    console.error('Error generating sitemap:', error)

    // Return a basic sitemap if there's an error
    const baseUrl =
      process.env.NEXT_PUBLIC_SERVER_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
      (process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : null) ||
      'https://example.com'

    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
      {
        url: `${baseUrl}/en`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/rs`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
    ]
  }
}
