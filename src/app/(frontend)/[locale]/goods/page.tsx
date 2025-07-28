import type { Metadata } from 'next/types'
import { TypedLocale } from 'payload'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import { GoodsArchive } from '@/components/GoodsArchive'
import { goodsTranslations } from '@/i18n/translations/goods'

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
      <div className="pt-24 pb-24">
        <div className="container mb-16">
          <div className="prose dark:prose-invert max-w-none">
            <h1>{t.title}</h1>
          </div>
        </div>

        <div className="container mb-8">
          <div className="text-sm font-semibold">
            {allProducts.length === 0 &&
              (locale === 'rs' ? 'Nema rezultata pretrage.' : 'Search produced no results.')}
            {allProducts.length > 0 &&
              (locale === 'rs'
                ? `Prikazano ${allProducts.length} ${allProducts.length > 1 ? 'proizvoda' : 'proizvod'}`
                : `Showing ${allProducts.length} ${allProducts.length > 1 ? 'Products' : 'Product'}`)}
          </div>
          {allProducts.length === 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-yellow-800 text-sm">
                {locale === 'rs'
                  ? 'Nema proizvoda za prikaz. Molimo dodajte proizvode u admin panelu.'
                  : 'No products to display. Please add products in the admin panel.'}
              </p>
            </div>
          )}
        </div>

        {allProducts.length === 0 ? (
          <div className="container">
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                {locale === 'rs'
                  ? 'Nema proizvoda za prikaz. Molimo dodajte proizvode u admin panelu.'
                  : 'No products to display. Please add products in the admin panel.'}
              </p>
            </div>
          </div>
        ) : (
          <GoodsArchive goods={goods.docs} locale={locale} availableCategories={categories.docs} />
        )}
      </div>
    )
  } catch (error) {
    console.error('Error loading goods:', error)
    return (
      <div className="pt-24 pb-24">
        <div className="container mb-16">
          <div className="prose dark:prose-invert max-w-none">
            <h1>{t.title}</h1>
          </div>
        </div>
        <div className="container">
          <p className="text-center text-gray-600">
            {locale === 'rs'
              ? 'Greška pri učitavanju proizvoda. Molimo pokušajte ponovo.'
              : 'Error loading products. Please try again.'}
          </p>
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
