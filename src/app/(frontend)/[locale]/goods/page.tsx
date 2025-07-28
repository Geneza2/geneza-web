import type { Metadata } from 'next/types'
import { TypedLocale } from 'payload'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import { GoodsArchive } from '@/components/GoodsArchive'
import { goodsTranslations } from '@/i18n/translations/goods'
import { Package, AlertTriangle } from 'lucide-react'

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
      }),
      payload.find({
        collection: 'categories',
        depth: 1,
        limit: 100,
        overrideAccess: true,
      }),
    ])

    console.log('Categories fetched:', categories.docs.length)
    console.log(
      'Categories data:',
      categories.docs.map((c) => ({ id: c.id, title: c.title })),
    )

    const allProducts = goods.docs.flatMap((doc) => {
      if (!doc.products || doc.products.length === 0) {
        return []
      }

      return doc.products
        .filter((product) => product && product.title)
        .map((product) => ({
          title: doc.title,
          slug: doc.slug || '',
          products: [product],
          categories: doc.categories || [],
          meta: doc.meta || {},
        }))
    })

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
          {allProducts.length === 0 ? (
            <div className="container">
              <div className="max-w-md mx-auto text-center">
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
              </div>
            </div>
          ) : (
            <GoodsArchive
              goods={goods.docs}
              locale={locale}
              availableCategories={categories.docs}
            />
          )}
        </div>
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
            <div className="max-w-md mx-auto text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-red-50 rounded-2xl flex items-center justify-center">
                <AlertTriangle className="w-10 h-10 text-red-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {locale === 'rs' ? 'Greška pri učitavanju' : 'Error loading products'}
              </h3>
              <p className="text-gray-600">
                {locale === 'rs' ? 'Molimo pokušajte ponovo.' : 'Please try again.'}
              </p>
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
