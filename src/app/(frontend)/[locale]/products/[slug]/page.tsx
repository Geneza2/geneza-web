import type { Metadata } from 'next'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import { TypedLocale } from 'payload'
import { generateMeta } from '@/utilities/generateMeta'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { Button } from '@/components/ui/button'
import RichText from '@/components/RichText'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ProductOrderForm } from '@/components/ProductOrderForm'
import { ArrowLeft, Info, ChefHat, Apple, MapPin, Calendar, Clock, Package } from 'lucide-react'
import Image from 'next/image'

export async function generateStaticParams() {
  try {
    const payload = await getPayload({ config: configPromise })
    const products = await payload.find({
      collection: 'products',
      draft: false,
      limit: 1000,
      overrideAccess: false,
      pagination: false,
      select: { slug: true },
    })
    return products.docs?.map(({ slug }) => ({ slug })) || []
  } catch (error) {
    console.error('Error generating static params for products:', error)
    return []
  }
}

type Args = {
  params: Promise<{
    slug?: string
    locale: TypedLocale
  }>
}

export default async function ProductPage({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '', locale } = await paramsPromise
  const url = `/${locale}/products/` + slug

  try {
    const product = await queryProductBySlug({ slug, locale, draft })

    if (!product) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl mb-4">
                {locale === 'rs' ? 'Proizvod nije pronađen' : 'Product Not Found'}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                {locale === 'rs'
                  ? 'Proizvod koji tražite ne postoji ili je uklonjen.'
                  : 'The product you are looking for does not exist or has been removed.'}
              </p>
              <Button asChild>
                <a href={`/${locale}/products`}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {locale === 'rs' ? 'Nazad na proizvode' : 'Back to Products'}
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      )
    }

    const backgroundImage =
      product.backgroundImage && typeof product.backgroundImage === 'object'
        ? product.backgroundImage.url
        : null

    return (
      <div className="min-h-screen bg-gray-50">
        <PayloadRedirects disableNotFound url={url} />
        {draft && <LivePreviewListener />}

        <div
          className="relative bg-cover bg-center h-[42vh]"
          style={{ backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined }}
        >
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="lg:hidden">
          <div className="container mx-auto px-4 -mt-20 relative z-10">
            <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-2xl max-w-xs mx-auto">
              <div className="text-center space-y-5">
                <div>
                  {product.image && typeof product.image === 'object' && product.image.url ? (
                    <Image
                      src={product.image.url}
                      alt={product.image.alt || product.title}
                      width={180}
                      height={180}
                      className="w-40 h-40 object-cover rounded-full mx-auto"
                    />
                  ) : (
                    <div className="w-40 h-40 bg-muted flex items-center justify-center rounded-full mx-auto">
                      <ChefHat className="w-10 h-10 text-muted-foreground" />
                    </div>
                  )}
                </div>

                <div>
                  <h1 className="text-xl font-bold text-gray-900 mb-2">{product.title}</h1>
                  {product.scientificName && (
                    <p className="text-sm italic mb-3" style={{ color: '#9BC273' }}>
                      {product.scientificName}
                    </p>
                  )}
                </div>

                <div className="prose prose-sm max-w-none text-gray-700 text-sm">
                  <div className="line-clamp-3">
                    <RichText data={product.description} enableGutter={false} />
                  </div>
                </div>

                {product.cutSizes && product.cutSizes.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold mb-2 text-gray-800">
                      {locale === 'rs' ? 'Dostupni rezovi' : 'Cut Size'}
                    </h3>
                    <div className="flex flex-wrap gap-1.5 justify-center">
                      {product.cutSizes.map((cut, index) => (
                        <div
                          key={index}
                          className={`text-xs px-2.5 py-1 rounded-full border cursor-pointer transition-all ${
                            index === 0
                              ? 'text-white border-transparent'
                              : 'text-gray-600 border-gray-300 hover:border-gray-400'
                          }`}
                          style={index === 0 ? { backgroundColor: '#9BC273' } : undefined}
                        >
                          {cut.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="hidden lg:block">
          <div className="container mx-auto px-4 -mt-40 relative z-10">
            <div className="grid grid-cols-2 gap-6 items-center">
              <div className="flex justify-start">
                {product.image && typeof product.image === 'object' && product.image.url ? (
                  <Image
                    src={product.image.url}
                    alt={product.image.alt || product.title}
                    width={400}
                    height={400}
                    className="w-[26rem] h-[26rem] object-cover rounded-full"
                  />
                ) : (
                  <div className="w-[26rem] h-[26rem] bg-muted flex items-center justify-center rounded-full">
                    <ChefHat className="w-28 h-28 text-muted-foreground" />
                  </div>
                )}
              </div>

              <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-2xl">
                <h1 className="text-4xl font-bold text-gray-900 mb-3">{product.title}</h1>
                {product.scientificName && (
                  <p className="text-xl italic mb-5" style={{ color: '#9BC273' }}>
                    {product.scientificName}
                  </p>
                )}

                <div className="prose max-w-none mb-5 text-gray-700">
                  <div className="line-clamp-2">
                    <RichText data={product.description} enableGutter={false} />
                  </div>
                </div>

                {product.cutSizes && product.cutSizes.length > 0 && (
                  <div>
                    <h3 className="text-base font-semibold mb-3 text-gray-800">
                      {locale === 'rs' ? 'Dostupni rezovi' : 'Cut Size'}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {product.cutSizes.map((cut, index) => (
                        <div
                          key={index}
                          className={`text-sm px-3 py-1.5 rounded-full border cursor-pointer transition-all ${
                            index === 0
                              ? 'text-white border-transparent'
                              : 'text-gray-600 border-gray-300 hover:border-gray-400'
                          }`}
                          style={index === 0 ? { backgroundColor: '#9BC273' } : undefined}
                        >
                          {cut.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {product.productInfo && (
              <Card>
                <CardHeader
                  className="text-white rounded-t-xl"
                  style={{ backgroundColor: '#9BC273' }}
                >
                  <CardTitle className="flex items-center text-lg">
                    <Info className="w-5 h-5 mr-3" />
                    {locale === 'rs' ? 'Informacije o produktu' : 'Product Information'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  {product.productInfo.origin && (
                    <div className="flex items-center justify-between py-3 border-b">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                        <span className="font-medium">
                          {locale === 'rs' ? 'Poreklo' : 'Origin'}:
                        </span>
                      </div>
                      <span>{product.productInfo.origin}</span>
                    </div>
                  )}
                  {product.productInfo.season && (
                    <div className="flex items-center justify-between py-3 border-b">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                        <span className="font-medium">
                          {locale === 'rs' ? 'Sezona' : 'Season'}:
                        </span>
                      </div>
                      <span>{product.productInfo.season}</span>
                    </div>
                  )}
                  {product.productInfo.shelfLife && (
                    <div className="flex items-center justify-between py-3 border-b">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                        <span className="font-medium">
                          {locale === 'rs' ? 'Trajnost' : 'Shelf Life'}:
                        </span>
                      </div>
                      <span>{product.productInfo.shelfLife}</span>
                    </div>
                  )}
                  {product.productInfo.storage && (
                    <div className="py-3 border-b">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Package className="w-4 h-4 mr-2 text-muted-foreground" />
                          <span className="font-medium">
                            {locale === 'rs' ? 'Čuvanje' : 'Storage'}:
                          </span>
                        </div>
                        <span className="text-muted-foreground">{product.productInfo.storage}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {product.nutritiveInfo && (
              <Card>
                <CardHeader className="bg-slate-800 text-white rounded-t-xl">
                  <CardTitle className="flex items-center text-lg">
                    <Apple className="w-5 h-5 mr-3" />
                    {locale === 'rs' ? 'Nutritivne vrednosti' : 'Nutritional Values'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {locale === 'rs' ? 'Na 100g' : 'Per 100g'}
                  </p>
                  {product.nutritiveInfo.calories && (
                    <div className="flex justify-between py-3 border-b">
                      <span className="font-medium">
                        {locale === 'rs' ? 'Kalorije' : 'Calories'}:
                      </span>
                      <span>{product.nutritiveInfo.calories}</span>
                    </div>
                  )}
                  {product.nutritiveInfo.protein && (
                    <div className="flex justify-between py-3 border-b">
                      <span className="font-medium">
                        {locale === 'rs' ? 'Proteini' : 'Protein'}:
                      </span>
                      <span>{product.nutritiveInfo.protein}g</span>
                    </div>
                  )}
                  {product.nutritiveInfo.carbohydrates && (
                    <div className="flex justify-between py-3 border-b">
                      <span className="font-medium">
                        {locale === 'rs' ? 'Ugljeni hidrati' : 'Carbohydrates'}:
                      </span>
                      <span>{product.nutritiveInfo.carbohydrates}g</span>
                    </div>
                  )}
                  {product.nutritiveInfo.additionalNutrients &&
                    product.nutritiveInfo.additionalNutrients.length > 0 && (
                      <div className="pt-4 border-t space-y-3">
                        {product.nutritiveInfo.additionalNutrients.map((nutrient, index) => (
                          <div key={index} className="flex justify-between py-2 border-b">
                            <span className="font-medium">{nutrient.name}:</span>
                            <span>
                              {nutrient.value} {nutrient.unit}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                </CardContent>
              </Card>
            )}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                {locale === 'rs' ? 'Naruči Proizvod' : 'Order Product'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ProductOrderForm productTitle={product.title} locale={locale} />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error loading product:', error)
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl mb-4">{locale === 'rs' ? 'Greška' : 'Error'}</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              {locale === 'rs'
                ? 'Došlo je do greške prilikom učitavanja proizvoda.'
                : 'An error occurred while loading the product.'}
            </p>
            <Button asChild>
              <a href={`/${locale}/products`}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                {locale === 'rs' ? 'Nazad na proizvode' : 'Back to Products'}
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '', locale } = await paramsPromise
  const product = await queryProductBySlug({ slug, locale, draft: false })
  return generateMeta({ doc: product })
}

const queryProductBySlug = cache(
  async ({ slug, locale, draft }: { slug: string; locale: TypedLocale; draft: boolean }) => {
    const payload = await getPayload({ config: configPromise })
    try {
      const result = await payload.find({
        collection: 'products',
        draft,
        limit: 1,
        overrideAccess: draft,
        pagination: false,
        depth: 2,
        locale,
        where: { slug: { equals: slug } },
      })
      return result.docs?.[0] || null
    } catch (error) {
      console.error('Error querying product by slug:', error)
      return null
    }
  },
)
