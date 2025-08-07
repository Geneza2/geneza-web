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

export const dynamic = 'force-static'
export const revalidate = 600

type Args = {
  params: Promise<{
    locale: TypedLocale
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { locale } = await paramsPromise
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
      } catch (error) {}
    }

    const hasProducts = goods.docs.some((doc) => doc.products && doc.products.length > 0)

    return (
      <div className="py-12 sm:py-16">
        {!hasProducts ? (
          <div className="container">
            <Card className="max-w-md mx-auto text-center">
              <CardContent className="pt-6">
                <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-2xl flex items-center justify-center">
                  <Package className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {locale === 'rs' ? 'Nema proizvoda' : 'No products available'}
                </h3>
              </CardContent>
            </Card>
          </div>
        ) : (
          <GoodsArchive
            goods={goods.docs}
            locale={locale}
            availableCategories={categories.docs}
            productCutSizes={productCutSizes}
          />
        )}
      </div>
    )
  } catch (error) {
    console.error('Error loading goods:', error)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="pt-20 pb-12 bg-white border-b border-gray-100">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
                {t.title}
              </h1>
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
