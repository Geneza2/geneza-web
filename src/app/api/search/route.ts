import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { TypedLocale } from 'payload'

type SearchResult = {
  id: string
  title: string
  type: 'page' | 'post' | 'product' | 'good' | 'position' | 'category'
  slug: string
  description?: string
  url: string
}

// Simple in-memory cache with TTL
type CacheData = {
  results: SearchResult[]
  query: string
  total: number
  message: string
  cached?: boolean
}

const searchCache = new Map<string, { data: CacheData; timestamp: number }>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes
const CACHE_MAX_SIZE = 100 // Maximum cache entries

function getCacheKey(query: string, locale: TypedLocale): string {
  return `${query.toLowerCase().trim()}_${locale}`
}

function getFromCache(key: string) {
  const cached = searchCache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data
  }
  if (cached) {
    searchCache.delete(key) // Remove expired entry
  }
  return null
}

function setCache(key: string, data: CacheData) {
  // Clean old entries if cache is getting too large
  if (searchCache.size >= CACHE_MAX_SIZE) {
    const oldestKey = searchCache.keys().next().value
    if (oldestKey) {
      searchCache.delete(oldestKey)
    }
  }
  searchCache.set(key, { data, timestamp: Date.now() })
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q')
  const locale = (searchParams.get('locale') || 'en') as TypedLocale

  // quiet logs in production

  if (!query || query.length < 3) {
    return NextResponse.json({ results: [], message: 'Query too short' })
  }

  // Check cache first
  const cacheKey = getCacheKey(query, locale)
  const cachedResult = getFromCache(cacheKey)
  if (cachedResult) {
    // cache hit
    return NextResponse.json(cachedResult)
  }

  // cache miss

  try {
    const payload = await getPayload({ config: configPromise })
    const results: SearchResult[] = []

    // payload ready

    // Optimized search function - search most relevant collections first
    const performSearch = async (searchLocale: TypedLocale) => {
      // searching locale

      // Batch search promises for better performance
      const searchPromises = []

      // Search most relevant collections first (products and goods are likely most searched)
      searchPromises.push(
        payload
          .find({
            collection: 'products',
            where: {
              or: [{ title: { contains: query } }, { slug: { contains: query } }],
            },
            limit: 4,
            locale: searchLocale,
          })
          .catch(() => {
            return { docs: [] }
          }),
      )

      searchPromises.push(
        payload
          .find({
            collection: 'goods',
            where: {
              or: [{ title: { contains: query } }, { slug: { contains: query } }],
            },
            limit: 4,
            locale: searchLocale,
          })
          .catch(() => {
            return { docs: [] }
          }),
      )

      searchPromises.push(
        payload
          .find({
            collection: 'pages',
            where: {
              or: [{ title: { contains: query } }, { slug: { contains: query } }],
            },
            limit: 3,
            locale: searchLocale,
          })
          .catch(() => {
            return { docs: [] }
          }),
      )

      // Only search posts and categories if we have fewer than 10 results
      if (results.length < 10) {
        searchPromises.push(
          payload
            .find({
              collection: 'posts',
              where: {
                or: [{ title: { contains: query } }, { slug: { contains: query } }],
              },
              limit: 2,
              locale: searchLocale,
            })
            .catch(() => {
              return { docs: [] }
            }),
        )

        searchPromises.push(
          payload
            .find({
              collection: 'categories',
              where: {
                or: [{ title: { contains: query } }, { slug: { contains: query } }],
              },
              limit: 2,
              locale: searchLocale,
            })
            .catch(() => {
              return { docs: [] }
            }),
        )
      }

      // Execute all searches in parallel
      const [productsResult, goodsResult, pagesResult, postsResult, categoriesResult] =
        await Promise.all(searchPromises)

      // Process products
      if (productsResult?.docs) {
        productsResult.docs.forEach((product) => {
          if (!results.some((r) => r.id === `product-${product.id}`)) {
            results.push({
              id: `product-${product.id}`,
              title: product.title || 'Untitled Product',
              type: 'product',
              slug: product.slug || '',
              description: (product as any).meta?.description || undefined,
              url: `/${locale}/products/${product.slug}`,
            })
          }
        })
        // counts suppressed
      }

      // Process goods
      if (goodsResult?.docs) {
        goodsResult.docs.forEach((good) => {
          if (!results.some((r) => r.id === `good-${good.id}`)) {
            results.push({
              id: `good-${good.id}`,
              title: good.title || 'Untitled Good',
              type: 'good',
              slug: good.slug || '',
              description: (good as any).products?.[0]?.description || undefined,
              url: `/${locale}/goods?search=${encodeURIComponent(good.title || '')}`,
            })
          }
        })
      }

      // Process pages
      if (pagesResult?.docs) {
        pagesResult.docs.forEach((page) => {
          if (!results.some((r) => r.id === `page-${page.id}`)) {
            results.push({
              id: `page-${page.id}`,
              title: page.title || 'Untitled Page',
              type: 'page',
              slug: page.slug || '',
              description: (page as any).meta?.description || undefined,
              url: `/${locale}/${page.slug}`,
            })
          }
        })
      }

      // Process posts (if searched)
      if (postsResult?.docs) {
        postsResult.docs.forEach((post) => {
          if (!results.some((r) => r.id === `post-${post.id}`)) {
            results.push({
              id: `post-${post.id}`,
              title: post.title || 'Untitled Post',
              type: 'post',
              slug: post.slug || '',
              description: (post as any).meta?.description || undefined,
              url: `/${locale}/posts/${post.slug}`,
            })
          }
        })
      }

      // Process categories (if searched)
      if (categoriesResult?.docs) {
        categoriesResult.docs.forEach((category) => {
          if (!results.some((r) => r.id === `category-${category.id}`)) {
            results.push({
              id: `category-${category.id}`,
              title: category.title || 'Untitled Category',
              type: 'category',
              slug: category.slug || '',
              description: (category as any).description || undefined,
              url: `/${locale}/goods?category=${category.slug}`,
            })
          }
        })
      }
    }

    // Search in current locale
    await performSearch(locale)

    // Also search in the other locale for more results
    const otherLocale = locale === 'en' ? 'rs' : 'en'
    if (results.length < 10) {
      await performSearch(otherLocale)
    }

    // Sort results by relevance (title matches first)
    results.sort((a, b) => {
      const aTitle = a.title.toLowerCase().includes(query.toLowerCase())
      const bTitle = b.title.toLowerCase().includes(query.toLowerCase())

      if (aTitle && !bTitle) return -1
      if (!aTitle && bTitle) return 1

      return a.title.localeCompare(b.title)
    })

    const finalResults = results.slice(0, 15)

    const response = {
      results: finalResults,
      query,
      total: results.length,
      message: `Found ${results.length} results`,
      cached: false,
    }

    // Cache the response
    setCache(cacheKey, response)

    return NextResponse.json(response)
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Search failed',
        message: error instanceof Error ? error.message : 'Unknown error',
        results: [],
        total: 0,
      },
      { status: 500 },
    )
  }
}
