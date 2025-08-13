import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { cache } from 'react'
import Image from 'next/image'
import { ArrowLeft, Info, Apple, MapPin, Calendar, Clock, Package } from 'lucide-react'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { ProductOrderForm } from '@/components/ProductOrderForm'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import RichText from '@/components/RichText'
import { generateMeta } from '@/utilities/generateMeta'
import { TypedLocale } from 'payload'
import { getImageUrl } from '@/utilities/getImageUrl'

const query = cache(
  async ({ slug, locale, draft }: { slug: string; locale: TypedLocale; draft: boolean }) => {
    try {
      console.log('Querying product with:', { slug, locale, draft })
      const payload = await getPayload({ config: configPromise })
      const { docs = [] } = await payload.find({
        collection: 'products',
        draft,
        overrideAccess: draft,
        pagination: false,
        limit: 1,
        locale,
        depth: 2,
        where: { slug: { equals: slug } },
      })
      console.log('Query result:', { docsCount: docs.length, firstDoc: docs[0] })
      return docs[0] || null
    } catch (error) {
      console.error('Error in query function:', error)
      throw error
    }
  },
)

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const { docs = [] } = await payload.find({
    collection: 'products',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: { slug: true },
  })
  return docs.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug = '', locale } = await params
  const product = await query({ slug, locale, draft: false })
  return generateMeta({ doc: product })
}

type Args = {
  params: Promise<{ slug?: string; locale: TypedLocale }>
}

export default async function ProductPage({ params: p }: Args) {
  try {
    const { slug = '', locale } = await p
    const { isEnabled: draft } = await draftMode()
    const url = `/${locale}/products/${slug}`

    const product = await query({ slug, locale, draft })
    if (!product) return <ErrorCard locale={locale} />

    const {
      title,
      image,
      scientificName,
      description,
      cutSizes = [],
      backgroundImage,
      productInfo,
      nutritiveInfo,
    } = product
    const imageUrl = typeof backgroundImage === 'object' ? backgroundImage?.url : undefined

    const InfoRow = ({ icon, label, value }: any) =>
      value && (
        <div className="flex justify-between items-center py-3 border-b text-sm">
          <div className="flex items-center">
            {icon}
            <span className="font-medium">{label}</span>
          </div>
          <span>{value}</span>
        </div>
      )

    const InfoCard = ({ icon, title, items, bg, sub }: any) => (
      <Card>
        <CardHeader className="text-white rounded-t-xl" style={{ backgroundColor: bg }}>
          <CardTitle className="flex items-center text-lg">
            {icon}
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {sub && <p className="text-sm text-muted-foreground">{sub}</p>}
          {items}
        </CardContent>
      </Card>
    )

    return (
      <div className="min-h-screen bg-gray-50">
        <PayloadRedirects disableNotFound url={url} />
        {draft && <LivePreviewListener />}
        <div
          className="relative bg-cover bg-center h-[42vh]"
          style={imageUrl ? { backgroundImage: `url(${imageUrl})` } : {}}
        >
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="container mx-auto px-4 -mt-40 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            <div className="flex justify-center">
              <Image
                src={getImageUrl(image)}
                alt={typeof image === 'object' && image?.alt ? image.alt : title}
                width={400}
                height={400}
                className="rounded-full object-cover w-40 h-40 lg:w-[26rem] lg:h-[26rem]"
              />
            </div>
            <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-2xl text-center lg:text-left space-y-4">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">{title}</h1>
              {scientificName && (
                <p className="italic text-sm lg:text-xl" style={{ color: '#9BC273' }}>
                  {scientificName}
                </p>
              )}
              <div className="prose text-sm lg:text-base text-gray-700 line-clamp-3 lg:line-clamp-2">
                <RichText data={description} enableGutter={false} />
              </div>
              {(cutSizes ?? []).length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-800">
                    {locale === 'rs' ? 'Dostupni rezovi' : 'Cut Size'}
                  </h3>
                  <div className="flex flex-wrap justify-center lg:justify-start gap-2 mt-1">
                    {(cutSizes ?? []).map((cut, i) => (
                      <span
                        key={cut.id ?? `${cut.name}-${i}`}
                        className="rounded-full border px-3 py-1.5 text-sm transition-all text-white border-transparent"
                        style={{ backgroundColor: '#9BC273' }}
                      >
                        {cut.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {productInfo && (
              <InfoCard
                icon={<Info className="w-5 h-5 mr-3" />}
                title={locale === 'rs' ? 'Informacije o produktu' : 'Product Information'}
                bg="#9BC273"
                items={[
                  <InfoRow
                    key="origin"
                    icon={<MapPin className="w-4 h-4 mr-2 text-muted-foreground" />}
                    label={locale === 'rs' ? 'Poreklo: ' : 'Origin: '}
                    value={productInfo.origin}
                  />,
                  <InfoRow
                    key="season"
                    icon={<Calendar className="w-4 h-4 mr-2 text-muted-foreground" />}
                    label={locale === 'rs' ? 'Sezona: ' : 'Season: '}
                    value={productInfo.season}
                  />,
                  <InfoRow
                    key="shelf"
                    icon={<Clock className="w-4 h-4 mr-2 text-muted-foreground" />}
                    label={locale === 'rs' ? 'Trajnost: ' : 'Shelf Life: '}
                    value={productInfo.shelfLife}
                  />,
                  <InfoRow
                    key="storage"
                    icon={<Package className="w-4 h-4 mr-2 text-muted-foreground" />}
                    label={locale === 'rs' ? 'Čuvanje: ' : 'Storage: '}
                    value={productInfo.storage}
                  />,
                ]}
              />
            )}

            {nutritiveInfo && (
              <InfoCard
                icon={<Apple className="w-5 h-5 mr-3" />}
                title={locale === 'rs' ? 'Nutritivne vrednosti' : 'Nutritional Values'}
                bg="rgb(30 41 59)"
                sub={locale === 'rs' ? 'Na 100g' : 'Per 100g'}
                items={[
                  <InfoRow
                    key="cal"
                    label={locale === 'rs' ? 'Kalorije: ' : 'Calories: '}
                    value={nutritiveInfo.calories}
                  />,
                  <InfoRow
                    key="prot"
                    label={locale === 'rs' ? 'Proteini: ' : 'Protein: '}
                    value={`${nutritiveInfo.protein}g`}
                  />,
                  <InfoRow
                    key="carbs"
                    label={locale === 'rs' ? 'Ugljeni hidrati: ' : 'Carbohydrates: '}
                    value={`${nutritiveInfo.carbohydrates}g`}
                  />,
                ]}
              />
            )}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                {locale === 'rs' ? 'Naruči Proizvod' : 'Order Product'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ProductOrderForm productTitle={title} locale={locale} cutSizes={cutSizes || []} />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error loading product:', error)
    const { locale } = await p
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {locale === 'rs' ? 'Greška' : 'Error'}
          </h1>
          <p className="text-gray-600 mb-4">
            {locale === 'rs'
              ? 'Došlo je do greške pri učitavanju proizvoda'
              : 'An error occurred while loading the product'}
          </p>
          <p className="text-sm text-gray-500 mb-6">
            {error instanceof Error ? error.message : 'Unknown error'}
          </p>
          <Button asChild>
            <a href={`/${locale}/products`}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              {locale === 'rs' ? 'Nazad na proizvode' : 'Back to Products'}
            </a>
          </Button>
        </div>
      </div>
    )
  }
}

function ErrorCard({ locale }: { locale: TypedLocale }) {
  const isRS = locale === 'rs'
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="max-w-md mx-auto text-center">
        <CardHeader>
          <CardTitle className="text-3xl mb-4">
            {isRS ? 'Proizvod nije pronađen' : 'Product Not Found'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            {isRS
              ? 'Proizvod koji tražite ne postoji ili je uklonjen.'
              : 'The product you are looking for does not exist or has been removed.'}
          </p>
          <Button asChild>
            <a href={`/${locale}/products`}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              {isRS ? 'Nazad na proizvode' : 'Back to Products'}
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
