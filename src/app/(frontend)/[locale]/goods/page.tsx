import type { Metadata } from 'next/types'
import { TypedLocale } from 'payload'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React from 'react'
import { GoodsArchive } from '@/components/GoodsArchive'
import { goodsTranslations } from '@/i18n/translations/goods'
import { Package } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { GoodsErrorBoundary } from '@/components/ErrorBoundary/GoodsErrorBoundary'

type CutSize = {
  id?: string | null
  name: string
}

export const dynamic = 'force-dynamic'

type Args = {
  params: Promise<{
    locale: TypedLocale
  }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Page({
  params: paramsPromise,
  searchParams: searchParamsPromise,
}: Args) {
  const { locale } = await paramsPromise
  const searchParams = await searchParamsPromise
  const safeLocale = locale || 'en'
  const t = goodsTranslations[safeLocale] || goodsTranslations.en

  try {
    const payload = await getPayload({ config: configPromise })
    const { isEnabled: draft } = await draftMode()

    // Early return if payload is not available
    if (!payload) {
      console.error('Payload not available')
      // In production, return a fallback instead of throwing
      if (process.env.NODE_ENV === 'production') {
        return (
          <GoodsErrorBoundary locale={safeLocale}>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50/30">
              <div className="relative bg-gradient-to-br from-[#9BC273] via-[#8AB162] to-[#7BA050] overflow-hidden h-64 sm:h-80 lg:h-96">
                <div className="absolute inset-0 bg-black/5"></div>
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>

                <div className="absolute inset-0 z-20 flex items-center justify-center">
                  <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
                    <div className="text-center max-w-4xl mx-auto">
                      <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-3xl mb-8 backdrop-blur-sm border border-white/30">
                        <Package className="w-10 h-10 text-white" />
                      </div>

                      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
                        {safeLocale === 'rs' ? 'Proizvodi' : 'Goods'}
                      </h1>

                      <p className="text-xl sm:text-2xl text-white/90 mb-8 font-light leading-relaxed max-w-2xl mx-auto">
                        {safeLocale === 'rs'
                          ? 'Otkrijte našu široku paletu kvalitetnih proizvoda direktno od proizvođača'
                          : 'Discover our wide range of quality products directly from the source'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative -mt-16 pb-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                  <Card className="max-w-md mx-auto text-center bg-white/80 backdrop-blur-sm border-0 shadow-2xl">
                    <CardContent className="pt-8 pb-6 px-6">
                      <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-yellow-100 to-yellow-50 rounded-3xl flex items-center justify-center">
                        <Package className="w-12 h-12 text-yellow-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        {safeLocale === 'rs' ? 'Učitavanje...' : 'Loading...'}
                      </h3>
                      <p className="text-gray-600">
                        {safeLocale === 'rs' ? 'Molimo sačekajte' : 'Please wait'}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </GoodsErrorBoundary>
        )
      }
      throw new Error('Database connection failed')
    }

    // Add timeout and better error handling for production
    const queryOptions = {
      depth: 1, // Further reduced depth for production stability
      limit: 50, // Reduced limit for production
      overrideAccess: draft,
      draft: draft,
      locale: safeLocale,
    }

    const [goods, categories] = await Promise.all([
      payload
        .find({
          collection: 'goods',
          ...queryOptions,
        })
        .catch((error) => {
          console.error('Error fetching goods:', error)
          return { docs: [] }
        }),
      payload
        .find({
          collection: 'categories',
          ...queryOptions,
          sort: 'order',
        })
        .catch((error) => {
          console.error('Error fetching categories:', error)
          return { docs: [] }
        }),
    ])

    // Get the selected category to determine banner image
    const selectedCategorySlug = Array.isArray(searchParams.category)
      ? searchParams.category[0]
      : searchParams.category

    const selectedCategory = selectedCategorySlug
      ? categories.docs.find((cat: { slug?: string | null }) => cat.slug === selectedCategorySlug)
      : null

    // Get all products at once instead of individual queries
    const productCutSizes: Record<string, CutSize[]> = {}

    try {
      const productsResponse = await payload
        .find({
          collection: 'products',
          limit: 100, // Reduced limit for production
          depth: 1,
          overrideAccess: draft,
          draft: draft,
          locale: safeLocale,
        })
        .catch((error) => {
          console.error('Error loading products for cut sizes:', error)
          return { docs: [] }
        })

      // Build the cut sizes mapping
      if (productsResponse?.docs) {
        productsResponse.docs.forEach(
          (product: { title?: string; cutSizes?: CutSize[] | null }) => {
            if (product?.title && product?.cutSizes && product.cutSizes.length > 0) {
              productCutSizes[product.title] = product.cutSizes
            }
          },
        )
      }
    } catch (error) {
      console.error('Error loading products for cut sizes:', error)
      // Continue without cut sizes if there's an error
    }

    const hasProducts =
      goods?.docs?.some(
        (doc: { products?: unknown[] }) => doc?.products && doc.products.length > 0,
      ) || false

    // Determine banner image and content
    // Prefer category.bannerImage from Categories collection; else fall back to Goods-level bannerImage
    let bannerImage: string | null = null
    if (selectedCategory?.bannerImage && typeof selectedCategory.bannerImage === 'object') {
      bannerImage = selectedCategory.bannerImage.url || null
    }

    if (!bannerImage) {
      const matchedGood = goods?.docs?.find(
        (g: { slug?: string | null }) => g?.slug === selectedCategorySlug,
      )
      const goodBanner = matchedGood?.bannerImage
      if (goodBanner && typeof goodBanner === 'object' && 'url' in goodBanner) {
        bannerImage = goodBanner.url as string
      }
    }

    const bannerTitle = selectedCategory?.title || t.title
    const bannerDescription =
      selectedCategory?.description ||
      (safeLocale === 'rs'
        ? 'Otkrijte našu široku paletu kvalitetnih proizvoda direktno od proizvođača'
        : 'Discover our wide range of quality products directly from the source')

    return (
      <GoodsErrorBoundary locale={safeLocale}>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50/30">
          {draft && <LivePreviewListener />}
          <div className="relative overflow-hidden">
            {bannerImage ? (
              // Custom image banner
              <>
                <div
                  className="relative h-[60vh] min-h-[400px] bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: `url(${bannerImage})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30"></div>

                  <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 h-full flex items-center">
                    <div className="text-center max-w-4xl mx-auto">
                      <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-3xl mb-8 backdrop-blur-sm border border-white/30">
                        <Package className="w-10 h-10 text-white" />
                      </div>

                      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight drop-shadow-lg">
                        {bannerTitle}
                      </h1>

                      <p className="text-xl sm:text-2xl text-white/90 mb-8 font-light leading-relaxed max-w-2xl mx-auto drop-shadow-md">
                        {bannerDescription}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              // Default gradient banner
              <>
                <div className="relative bg-gradient-to-br from-[#9BC273] via-[#8AB162] to-[#7BA050] overflow-hidden">
                  <div className="absolute inset-0 bg-black/5"></div>
                  <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
                  <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>

                  <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
                    <div className="text-center max-w-4xl mx-auto">
                      <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-3xl mb-8 backdrop-blur-sm border border-white/30">
                        <Package className="w-10 h-10 text-white" />
                      </div>

                      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
                        {bannerTitle}
                      </h1>

                      <p className="text-xl sm:text-2xl text-white/90 mb-8 font-light leading-relaxed max-w-2xl mx-auto">
                        {bannerDescription}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="relative -mt-16 pb-16">
            {!hasProducts ? (
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <Card className="max-w-md mx-auto text-center bg-white/80 backdrop-blur-sm border-0 shadow-2xl">
                  <CardContent className="pt-8 pb-6 px-6">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-50 rounded-3xl flex items-center justify-center">
                      <Package className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {locale === 'rs' ? 'Nema proizvoda' : 'No products available'}
                    </h3>
                    <p className="text-gray-600">
                      {locale === 'rs'
                        ? 'Proverite kasnije za nove proizvode'
                        : 'Check back later for new products'}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <GoodsArchive
                goods={goods?.docs || []}
                locale={safeLocale}
                availableCategories={categories?.docs || []}
                productCutSizes={productCutSizes}
                searchParams={searchParams}
              />
            )}
          </div>
        </div>
      </GoodsErrorBoundary>
    )
  } catch (error) {
    console.error('Error loading goods:', error)

    // Log additional error details for debugging
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }

    // Return a fallback page with empty data
    return (
      <GoodsErrorBoundary locale={safeLocale}>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50/30">
          <div className="relative bg-gradient-to-br from-[#9BC273] via-[#8AB162] to-[#7BA050] overflow-hidden h-64 sm:h-80 lg:h-96">
            <div className="absolute inset-0 bg-black/5"></div>
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>

            <div className="absolute inset-0 z-20 flex items-center justify-center">
              <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
                <div className="text-center max-w-4xl mx-auto">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-3xl mb-8 backdrop-blur-sm border border-white/30">
                    <Package className="w-10 h-10 text-white" />
                  </div>

                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
                    {safeLocale === 'rs' ? 'Proizvodi' : 'Goods'}
                  </h1>

                  <p className="text-xl sm:text-2xl text-white/90 mb-8 font-light leading-relaxed max-w-2xl mx-auto">
                    {safeLocale === 'rs'
                      ? 'Otkrijte našu široku paletu kvalitetnih proizvoda direktno od proizvođača'
                      : 'Discover our wide range of quality products directly from the source'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative -mt-16 pb-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <Card className="max-w-md mx-auto text-center bg-white/80 backdrop-blur-sm border-0 shadow-2xl">
                <CardContent className="pt-8 pb-6 px-6">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-red-100 to-red-50 rounded-3xl flex items-center justify-center">
                    <Package className="w-12 h-12 text-red-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {safeLocale === 'rs' ? 'Greška pri učitavanju' : 'Error loading goods'}
                  </h3>
                  <p className="text-gray-600">
                    {safeLocale === 'rs' ? 'Pokušajte ponovo kasnije' : 'Please try again later'}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </GoodsErrorBoundary>
    )
  }
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { locale } = await paramsPromise
  const t = goodsTranslations[locale] || goodsTranslations.en

  return {
    title: t.title,
  }
}

export async function generateStaticParams() {
  return [
    {
      locale: 'en',
    },
    {
      locale: 'rs',
    },
  ]
}

// Add revalidation to handle dynamic content
export const revalidate = 30 // Revalidate every 30 seconds for faster updates
