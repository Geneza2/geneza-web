import type { Metadata } from 'next/types'
import { TypedLocale } from 'payload'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import { GoodsArchive } from '@/components/GoodsArchive'
import { goodsTranslations } from '@/i18n/translations/goods'
import { Package, AlertTriangle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

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

    goods.docs.forEach((good, index) => {
      console.log(`Good ${index + 1}:`, {
        title: good.title,
        slug: good.slug,
        categories: good.categories,
        productsCount: good.products?.length || 0,
      })
    })

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
                <p className="text-gray-600">
                  {locale === 'rs'
                    ? 'Molimo dodajte proizvode u admin panelu.'
                    : 'Please add products in the admin panel.'}
                </p>
              </CardContent>
            </Card>
          </div>
        ) : (
          <GoodsArchive goods={goods.docs} locale={locale} availableCategories={categories.docs} />
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
        <div className="py-12 sm:py-16">
          <div className="container">
            <Card className="max-w-md mx-auto text-center">
              <CardContent className="pt-6">
                <div className="w-20 h-20 mx-auto mb-6 bg-red-50 rounded-2xl flex items-center justify-center">
                  <AlertTriangle className="w-10 h-10 text-red-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {locale === 'rs' ? 'Greška pri učitavanju' : 'Error loading products'}
                </h3>
                <p className="text-gray-600">
                  {locale === 'rs' ? 'Molimo pokušajte ponovo.' : 'Please try again.'}
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
