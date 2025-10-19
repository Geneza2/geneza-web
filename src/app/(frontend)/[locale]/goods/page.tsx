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
import type { Product } from '@/payload-types'

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

    const goods = await payload.find({
      collection: 'goods',
      depth: 2, // Reduced depth to improve performance
      limit: 100,
      overrideAccess: draft,
      draft: draft,
      locale: safeLocale,
      sort: 'order', // Sort goods by order
    })

    // Get the selected category to determine banner image
    const selectedCategorySlug = Array.isArray(searchParams.category)
      ? searchParams.category[0]
      : searchParams.category

    const selectedCategory = selectedCategorySlug
      ? goods.docs.find((good: any) => good.slug === selectedCategorySlug)
      : null

    // Get all products at once instead of individual queries
    const productCutSizes: Record<string, CutSize[]> = {}

    try {
      const productsResponse = await payload.find({
        collection: 'products',
        limit: 1000, // Get all products
        depth: 1,
        overrideAccess: draft,
        draft: draft,
        locale: safeLocale,
      })

      // Build the cut sizes mapping
      if (productsResponse?.docs) {
        productsResponse.docs.forEach((product: any) => {
          if (product?.title && product?.cutSizes && product.cutSizes.length > 0) {
            productCutSizes[product.title] = product.cutSizes
          }
        })
      }
    } catch (error) {
      console.error('Error loading products for cut sizes:', error)
      // Continue without cut sizes if there's an error
    }

    const hasProducts =
      goods?.docs?.some((doc: any) => doc?.products && doc.products.length > 0) || false

    // Determine banner image and content
    // Prefer category.bannerImage from Categories collection; else fall back to Goods-level bannerImage
    let bannerImage: string | null = null
    if (selectedCategory?.bannerImage && typeof selectedCategory.bannerImage === 'object') {
      bannerImage = selectedCategory.bannerImage.url || null
    }

    if (!bannerImage) {
      const matchedGood = goods?.docs?.find((g: any) => g?.slug === selectedCategorySlug)
      const goodBanner = matchedGood?.bannerImage
      if (goodBanner && typeof goodBanner === 'object' && 'url' in goodBanner) {
        bannerImage = goodBanner.url as string
      }
    }

    // If still no banner, try to get first available banner from any good
    if (!bannerImage) {
      for (const good of goods?.docs || []) {
        if (
          good?.bannerImage &&
          typeof good.bannerImage === 'object' &&
          'url' in good.bannerImage
        ) {
          bannerImage = good.bannerImage.url as string
          break
        }
      }
    }

    // Ensure the URL is absolute if it exists
    if (bannerImage && !bannerImage.startsWith('http')) {
      const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3002'
      bannerImage = `${baseUrl}${bannerImage}`
    }

    console.log('Banner Image URL:', bannerImage)

    const bannerTitle = selectedCategory?.title || t.title
    const bannerDescription =
      safeLocale === 'rs'
        ? 'Otkrijte našu široku paletu kvalitetnih proizvoda direktno od proizvođača'
        : 'Discover our wide range of quality products directly from the source'

    return (
      <div className="relative min-h-screen">
        {draft && <LivePreviewListener />}

        {/* Fixed background - image only, stays locked in place and extends full height */}
        {bannerImage && (
          <div
            className="fixed top-0 left-0 w-full h-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('${bannerImage}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              zIndex: 0,
            }}
          />
        )}

        {/* Scrollable content - everything scrolls over the fixed background */}
        <div className="relative" style={{ zIndex: 1 }}>
          {/* Hero section - visible over background */}
          <div className="pt-[72px] md:pt-[80px]">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
              <div className="text-center max-w-4xl mx-auto mb-16">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-white/80 backdrop-blur-sm rounded-3xl mb-8 border border-white/30 shadow-xl">
                  <Package className="w-10 h-10 text-gray-600" />
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight drop-shadow-2xl">
                  {bannerImage ? bannerTitle : locale === 'rs' ? 'Proizvodi' : 'Products'}
                </h1>

                <p className="text-xl sm:text-2xl text-white/90 mb-8 font-light leading-relaxed max-w-2xl mx-auto drop-shadow-xl">
                  {bannerImage
                    ? bannerDescription
                    : locale === 'rs'
                      ? 'Otkrijte našu široku paletu kvalitetnih proizvoda direktno od proizvođača'
                      : 'Discover our wide range of quality products directly from the source'}
                </p>
              </div>
            </div>
          </div>

          {/* Content area - cards/sidebar scrolling over fixed image */}
          <div className="pb-16">
            {!hasProducts ? (
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <Card className="max-w-md mx-auto text-center bg-white/95 backdrop-blur-md border-0 shadow-2xl">
                  <CardContent className="pt-8 pb-6 px-6">
                    <div className="w-24 h-24 mx-auto mb-6 bg-white rounded-3xl flex items-center justify-center border border-gray-200">
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
                availableCategories={goods?.docs || []}
                productCutSizes={productCutSizes}
                searchParams={searchParams}
              />
            )}
          </div>
        </div>
      </div>
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
      <div className="relative min-h-screen">
        {/* Fixed 100vh background - stays locked in place */}
        <div className="fixed top-0 left-0 w-full h-[100vh] bg-gray-50" style={{ zIndex: 0 }} />

        {/* Scrollable content - everything scrolls over the fixed background */}
        <div className="relative" style={{ zIndex: 1 }}>
          {/* Hero section - visible over background */}
          <div className="pt-[72px] md:pt-[80px]">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
              <div className="text-center max-w-4xl mx-auto mb-16">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-3xl mb-8 backdrop-blur-sm border border-white/30">
                  <Package className="w-10 h-10 text-gray-600" />
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
                  {t.title}
                </h1>

                <p className="text-xl sm:text-2xl text-gray-700 mb-8 font-light leading-relaxed max-w-2xl mx-auto">
                  {locale === 'rs'
                    ? 'Otkrijte našu široku paletu kvalitetnih proizvoda direktno od proizvođača'
                    : 'Discover our wide range of quality products directly from the source'}
                </p>
              </div>
            </div>
          </div>

          {/* Content area - cards scrolling over fixed image */}
          <div className="pb-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <Card className="max-w-md mx-auto text-center bg-white border-0 shadow-2xl">
                <CardContent className="pt-8 pb-6 px-6">
                  <div className="w-24 h-24 mx-auto mb-6 bg-white rounded-3xl flex items-center justify-center border border-gray-200">
                    <Package className="w-12 h-12 text-red-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {locale === 'rs' ? 'Greška pri učitavanju' : 'Error loading goods'}
                  </h3>
                  <p className="text-gray-600">
                    {locale === 'rs' ? 'Pokušajte ponovo kasnije' : 'Please try again later'}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
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
