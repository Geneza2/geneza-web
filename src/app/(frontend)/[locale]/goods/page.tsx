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

    // Build productCutSizes from goods data instead of fetching all products
    // This avoids memory issues during build by only using data already loaded
    const productCutSizes: Record<string, CutSize[]> = {}

    try {
      // Extract cut sizes from products already loaded in goods
      goods.docs.forEach((good: any) => {
        if (good?.products && Array.isArray(good.products)) {
          good.products.forEach((product: any) => {
            if (
              product?.title &&
              product?.cutSizes &&
              Array.isArray(product.cutSizes) &&
              product.cutSizes.length > 0
            ) {
              productCutSizes[product.title] = product.cutSizes.map((cs: any) => ({
                id: cs?.id || null,
                name: typeof cs === 'string' ? cs : cs?.name || '',
              }))
            }
          })
        }
      })
    } catch (error) {
      console.error('Error building product cut sizes:', error)
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

    const bannerTitle = selectedCategory?.title || t.title
    const bannerDescription =
      safeLocale === 'rs'
        ? 'Otkrijte našu široku paletu kvalitetnih proizvoda direktno od proizvođača'
        : 'Discover our wide range of quality products directly from the source'

    return (
      <div className="min-h-screen">
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
              <div className="relative overflow-hidden">
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
              availableCategories={goods?.docs || []}
              productCutSizes={productCutSizes}
              searchParams={searchParams}
            />
          )}
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50/30">
        <div className="relative  overflow-hidden h-64 sm:h-80 lg:h-96">
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
                  {t.title}
                </h1>

                <p className="text-xl sm:text-2xl text-white/90 mb-8 font-light leading-relaxed max-w-2xl mx-auto">
                  {locale === 'rs'
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
