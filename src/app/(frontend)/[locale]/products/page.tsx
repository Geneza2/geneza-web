import type { Metadata } from 'next'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { TypedLocale } from 'payload'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { Card, CardContent, CardTitle } from '@/components/ui/card'

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'rs' }]
}

type Args = {
  params: Promise<{
    locale: TypedLocale
  }>
}

export default async function ProductsPage({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { locale } = await paramsPromise
  const url = `/${locale}/products`

  const products = await queryProducts({ locale, draft })

  return (
    <div className="min-h-screen">
      <PayloadRedirects disableNotFound url={url} />
      {draft && <LivePreviewListener />}

      <div className="container mx-auto px-4 py-12">
        {products && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/${locale}/products/${product.slug}`}
                className="group block"
              >
                <Card className="rounded-xl overflow-hidden transition-all duration-300 border-none bg-transparent shadow-none hover:scale-105">
                  <div className="relative aspect-square overflow-hidden">
                    {typeof product.image === 'object' && product.image?.url ? (
                      <Image
                        src={product.image.url}
                        alt={product.title}
                        fill
                        className="object-cover transition-transform duration-300"
                      />
                    ) : null}
                  </div>
                  <CardContent className="p-2">
                    <CardTitle className="text-base text-center transition-colors group-hover:text-primary">
                      {product.title}
                    </CardTitle>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card className="text-center py-12 bg-transparent rounded-xl shadow-none">
            <CardContent className="pt-6">
              <CardTitle className="text-2xl mb-4">
                {locale === 'rs' ? 'Nema proizvoda' : 'No Products Available'}
              </CardTitle>
              <p className="text-muted-foreground">
                {locale === 'rs'
                  ? 'Trenutno nema dostupnih proizvoda.'
                  : 'There are no products available at the moment.'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { locale } = await paramsPromise

  const title = (locale === 'rs' ? 'Proizvodi' : 'Products') + ' | Payload Website Template'
  const description =
    locale === 'rs'
      ? 'Pogledajte našu kolekciju svežih, kvalitetnih proizvoda.'
      : 'Browse our collection of fresh, quality products.'

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
    },
  }
}

const queryProducts = cache(async ({ locale, draft }: { locale: TypedLocale; draft: boolean }) => {
  const payload = await getPayload({ config: configPromise })

  try {
    const result = await payload.find({
      collection: 'products',
      draft,
      limit: 100,
      overrideAccess: draft,
      pagination: false,
      depth: 2,
      locale,
      select: {
        id: true,
        title: true,
        slug: true,
        image: true,
      },
    })

    return result.docs || []
  } catch (error) {
    console.error('Error querying products:', error)
    return []
  }
})
