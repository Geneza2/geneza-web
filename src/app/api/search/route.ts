import { NextRequest, NextResponse } from 'next/server'

// Ensure this API runs in a Node.js runtime (Payload SDK is not Edge-compatible)
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const revalidate = 0
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { TypedLocale } from 'payload'
import { createFuzzySearchCondition, normalizeSearchQuery } from '@/utilities/normalizeSearchQuery'

type SearchResult = {
  id: string
  title: string
  type: 'page' | 'post' | 'product' | 'good' | 'position' | 'category' | 'media'
  slug: string
  description?: string
  url: string
  image?: string
  publishedAt?: string
}

type CacheData = {
  results: SearchResult[]
  query: string
  total: number
  message: string
  cached?: boolean
}

const searchCache = new Map<string, { data: CacheData; timestamp: number }>()
const CACHE_TTL = 0
const CACHE_MAX_SIZE = 100

function getCacheKey(query: string, locale: TypedLocale): string {
  return `${normalizeSearchQuery(query)}_${locale}`
}

function getFromCache(key: string) {
  const cached = searchCache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data
  }
  if (cached) {
    searchCache.delete(key)
  }
  return null
}

function setCache(key: string, data: CacheData) {
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

  if (!query || query.length < 3) {
    return NextResponse.json({ results: [], message: 'Query too short' })
  }

  const cacheKey = getCacheKey(query, locale)
  const cachedResult = getFromCache(cacheKey)
  if (cachedResult) {
    return NextResponse.json(cachedResult, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    })
  }

  try {
    const payload = await getPayload({ config: configPromise })
    const results: SearchResult[] = []

    const performSearch = async (searchLocale: TypedLocale) => {
      const searchPromises = []

      searchPromises.push(
        payload
          .find({
            collection: 'products',
            where: {
              or: [
                createFuzzySearchCondition('title', query),
                createFuzzySearchCondition('slug', query),
                createFuzzySearchCondition('scientificName', query),
              ],
            },
            limit: 6,
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
              or: [
                createFuzzySearchCondition('title', query),
                createFuzzySearchCondition('slug', query),
                {
                  'products.title': {
                    contains: query,
                  },
                },
                {
                  'products.description': {
                    contains: query,
                  },
                },
                {
                  'products.country': {
                    contains: query,
                  },
                },
              ],
            },
            limit: 6,
            locale: searchLocale,
            depth: 2,
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
              or: [
                createFuzzySearchCondition('title', query),
                createFuzzySearchCondition('slug', query),
              ],
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
            collection: 'posts',
            where: {
              or: [
                createFuzzySearchCondition('title', query),
                createFuzzySearchCondition('slug', query),
              ],
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
            collection: 'categories',
            where: {
              or: [
                createFuzzySearchCondition('title', query),
                createFuzzySearchCondition('slug', query),
                createFuzzySearchCondition('description', query),
              ],
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
            collection: 'openPositions',
            where: {
              or: [
                createFuzzySearchCondition('title', query),
                createFuzzySearchCondition('slug', query),
              ],
            },
            limit: 3,
            locale: searchLocale,
          })
          .catch(() => {
            return { docs: [] }
          }),
      )

      const [
        productsResult,
        goodsResult,
        pagesResult,
        postsResult,
        categoriesResult,
        positionsResult,
      ] = await Promise.all(searchPromises)

      if (productsResult?.docs) {
        productsResult.docs.forEach((product) => {
          if (!results.some((r) => r.id === `product-${product.id}`)) {
            const title = product.title || 'Untitled Product'
            const description = (product as any).meta?.description || ''
            const slug = product.slug || ''

            results.push({
              id: `product-${product.id}`,
              title,
              type: 'product',
              slug,
              description: description || undefined,
              url: `/${locale}/products/${slug}`,
              image: (product as any).image?.url || undefined,
              publishedAt: (product as any).publishedAt || product.createdAt,
            })
          }
        })
      }

      if (goodsResult?.docs) {
        goodsResult.docs.forEach((good) => {
          if (!results.some((r) => r.id === `good-${good.id}`)) {
            const title = good.title || 'Untitled Good'
            const description = (good as any).description || ''
            const slug = good.slug || ''

            const firstCategory = (good as any).categories?.[0]
            const categorySlug =
              typeof firstCategory === 'object' && firstCategory?.slug ? firstCategory.slug : null

            const goodsUrl = categorySlug
              ? `/${locale}/goods?category=${categorySlug}`
              : `/${locale}/goods?category=${slug}`

            results.push({
              id: `good-${good.id}`,
              title,
              type: 'good',
              slug,
              description: description || undefined,
              url: goodsUrl,
              publishedAt: (good as any).publishedAt || good.createdAt,
            })
          }
        })
      }

      if (pagesResult?.docs) {
        pagesResult.docs.forEach((page) => {
          if (!results.some((r) => r.id === `page-${page.id}`)) {
            const title = page.title || 'Untitled Page'
            const description = (page as any).meta?.description || ''
            const slug = page.slug || ''

            results.push({
              id: `page-${page.id}`,
              title,
              type: 'page',
              slug,
              description: description || undefined,
              url: `/${locale}/${slug}`,
              publishedAt: (page as any).publishedAt || page.createdAt,
            })
          }
        })
      }

      if (postsResult?.docs) {
        postsResult.docs.forEach((post) => {
          if (!results.some((r) => r.id === `post-${post.id}`)) {
            const title = post.title || 'Untitled Post'
            const description = (post as any).meta?.description || ''
            const slug = post.slug || ''

            results.push({
              id: `post-${post.id}`,
              title,
              type: 'post',
              slug,
              description: description || undefined,
              url: `/${locale}/posts/${slug}`,
              image: (post as any).image?.url || undefined,
              publishedAt: (post as any).publishedAt || post.createdAt,
            })
          }
        })
      }

      if (categoriesResult?.docs) {
        categoriesResult.docs.forEach((category) => {
          if (!results.some((r) => r.id === `category-${category.id}`)) {
            const title = category.title || 'Untitled Category'
            const description = (category as any).description || ''
            const slug = category.slug || ''

            results.push({
              id: `category-${category.id}`,
              title,
              type: 'category',
              slug,
              description: description || undefined,
              url: `/${locale}/goods?category=${slug}`,
              image: (category as any).bannerImage?.url || undefined,
              publishedAt:
                (category as any).publishedAt || category.updatedAt || category.createdAt,
            })
          }
        })
      }

      if (positionsResult?.docs) {
        positionsResult.docs.forEach((position) => {
          if (!results.some((r) => r.id === `position-${position.id}`)) {
            const title = position.title || 'Untitled Position'
            const description = (position as any).meta?.description || ''
            const slug = position.slug || ''

            results.push({
              id: `position-${position.id}`,
              title,
              type: 'position',
              slug,
              description: description || undefined,
              url: `/${locale}/careers/${slug}`,
              publishedAt: (position as any).publishedAt || position.createdAt,
            })
          }
        })
      }
    }

    await performSearch(locale)

    const otherLocale = locale === 'en' ? 'rs' : 'en'
    if (results.length < 10) {
      await performSearch(otherLocale)
    }

    results.sort((a, b) => {
      const typePriority: Record<string, number> = {
        product: 1,
        good: 2,
        page: 3,
        post: 4,
        category: 5,
        position: 6,
        media: 7,
      }
      const aPriority = typePriority[a.type] || 8
      const bPriority = typePriority[b.type] || 8

      if (aPriority !== bPriority) {
        return aPriority - bPriority
      }

      return a.title.localeCompare(b.title)
    })

    const finalResults = results.slice(0, 20)

    const response = {
      results: finalResults,
      query,
      total: results.length,
      message: `Found ${results.length} results`,
      cached: false,
      analytics: {
        searchId: Date.now().toString(),
        timestamp: new Date().toISOString(),
      },
    }

    setCache(cacheKey, response)

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Search failed',
        message: error instanceof Error ? error.message : 'Unknown error',
        results: [],
        total: 0,
      },
      {
        status: 500,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },
      },
    )
  }
}
