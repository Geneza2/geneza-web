import type { Metadata } from 'next/types'
import { TypedLocale } from 'payload'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import { GoodsArchive } from '@/components/GoodsArchive'
import { goodsTranslations } from '@/i18n/translations/goods'
import { Package } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
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
  const t = goodsTranslations[locale] || goodsTranslations.en

  try {
    const payload = await getPayload({ config: configPromise })

    const [goods, categories] = await Promise.all([
      payload.find({
        collection: 'goods',
        depth: 3,
        limit: 100,
        overrideAccess: true,
        locale: locale,
      }),
      payload.find({
        collection: 'categories',
        depth: 1,
        limit: 100,
        overrideAccess: true,
        locale: locale,
      }),
    ])

    const productTitles = new Set<string>()
    goods.docs.forEach((good) => {
      good.products?.forEach((product) => {
        if (product.title) {
          productTitles.add(product.title)
        }
      })
    })

    const productCutSizes: Record<string, CutSize[]> = {}

    for (const title of productTitles) {
      try {
        const productsResponse = await payload.find({
          collection: 'products',
          where: {
            title: {
              equals: title,
            },
          },
          limit: 1,
          depth: 1,
          locale: locale,
        })

        if (productsResponse.docs.length > 0) {
          const product = productsResponse.docs[0] as Product
          if (product.cutSizes && product.cutSizes.length > 0) {
            productCutSizes[title] = product.cutSizes
          }
        }
      } catch (_error) {}
    }

    const hasProducts = goods.docs.some((doc) => doc.products && doc.products.length > 0)

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50/30">
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
              goods={goods.docs}
              locale={locale}
              availableCategories={categories.docs}
              productCutSizes={productCutSizes}
              searchParams={searchParams}
            />
          )}
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error loading goods:', error)
    return (
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
