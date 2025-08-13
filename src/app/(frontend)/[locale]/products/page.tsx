import type { Metadata } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { cache } from 'react'
import Link from 'next/link'
import { Media } from '@/components/Media'
import { generateMeta } from '@/utilities/generateMeta'
import { TypedLocale } from 'payload'

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { locale } = await params
  return {
    title: locale === 'rs' ? 'Proizvodi' : 'Products',
    description: locale === 'rs' ? 'Pregled svih naših proizvoda' : 'Overview of all our products',
  }
}

type Args = {
  params: Promise<{ locale: TypedLocale }>
}

const queryProducts = cache(async ({ locale }: { locale: TypedLocale }) => {
  const payload = await getPayload({ config: configPromise })
  const { docs = [] } = await payload.find({
    collection: 'products',
    draft: false,
    overrideAccess: false,
    pagination: false,
    limit: 1000,
    locale,
    depth: 1,
  })
  return docs
})

export default async function ProductsPage({ params: p }: Args) {
  const { locale } = await p
  try {
    const products = await queryProducts({ locale })

    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {locale === 'rs' ? 'Naši Proizvodi' : 'Our Products'}
            </h1>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              {locale === 'rs'
                ? 'Istražite našu kolekciju kvalitetnih proizvoda'
                : 'Explore our collection of quality products'}
            </p>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/${locale}/products/${product.slug}`}
                  className="group block rounded-lg transition-all duration-500 overflow-hidden transform hover:scale-105 hover:-translate-y-2"
                >
                  {product.image && (
                    <div className="relative aspect-square overflow-hidden">
                      <Media
                        resource={product.image}
                        className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105 group-hover:rotate-1"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 group-hover:text-[#9BC273] transition-all duration-300 transform group-hover:scale-105">
                      {product.title}
                    </h3>
                    {product.scientificName && (
                      <p className="text-sm text-gray-600 italic mt-1 group-hover:text-gray-700 transition-colors duration-300">
                        {product.scientificName}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                {locale === 'rs'
                  ? 'Trenutno nema dostupnih proizvoda'
                  : 'No products available at the moment'}
              </p>
            </div>
          )}
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error loading products:', error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {locale === 'rs' ? 'Greška' : 'Error'}
          </h1>
          <p className="text-gray-600">
            {locale === 'rs'
              ? 'Došlo je do greške pri učitavanju proizvoda'
              : 'An error occurred while loading products'}
          </p>
        </div>
      </div>
    )
  }
}
