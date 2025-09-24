import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { cache } from 'react'
import Image from 'next/image'
import { ArrowLeft, Info, Apple, MapPin, Calendar, Clock, Package } from 'lucide-react'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import RichText from '@/components/RichText'
import { generateMeta } from '@/utilities/generateMeta'
import { TypedLocale } from 'payload'
import { getImageUrl } from '@/utilities/getImageUrl'
import type { Product, Media } from '@/payload-types'
import { ReactNode } from 'react'
import { retryOperation } from '@/utilities/retryOperation'

export const dynamic = 'force-dynamic'
export const revalidate = 600
export const runtime = 'nodejs'

const query = cache(
  async ({ slug, locale, draft }: { slug: string; locale: TypedLocale; draft: boolean }) => {
    const payload = await getPayload({ config: configPromise })
    const { docs = [] } = await retryOperation(() =>
      payload.find({
        collection: 'products',
        draft,
        overrideAccess: draft,
        pagination: false,
        limit: 1,
        locale,
        depth: 2,
        where: { slug: { equals: slug } },
      }),
    )
    return docs[0] || null
  },
)

export async function generateStaticParams() {
  try {
    const payload = await getPayload({ config: configPromise })
    const { docs = [] } = await retryOperation(() =>
      payload.find({
        collection: 'products',
        draft: false,
        limit: 1000,
        overrideAccess: false,
        pagination: false,
        select: { slug: true },
      }),
    )

    // Generate params for both locales
    const params = []
    for (const doc of docs) {
      if (doc.slug) {
        params.push({ slug: doc.slug, locale: 'en' })
        params.push({ slug: doc.slug, locale: 'rs' })
      }
    }

    return params
  } catch (error) {
    console.error('Error generating static params for products:', error)
    return []
  }
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug = '', locale } = await params
  const product = await query({ slug, locale, draft: false })
  return generateMeta({ doc: product })
}

type Args = { params: Promise<{ slug?: string; locale: TypedLocale }> }

interface InfoRowProps {
  icon: ReactNode
  label: string
  value: string | number | null | undefined
}

interface InfoCardProps {
  icon: ReactNode
  title: string
  items: ReactNode[]
  sub?: string
}

interface CutSize {
  id?: string | null
  name: string
}

interface ProductImageProps {
  image: Media | number
  title: string
  isMobile: boolean
}

interface HeroContentProps {
  title: string
  scientificName?: string | null
  description: Product['description']
  cutSizes: CutSize[] | null
  image: Media | number
  highlightImage?: Media | number | null
  locale: TypedLocale
  isMobile: boolean
}

const InfoRow = ({ icon, label, value }: InfoRowProps) =>
  value && (
    <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0">
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
          {icon}
        </div>
        <span className="font-medium text-gray-900">{label}</span>
      </div>
      <span className="text-gray-600 font-medium">{value}</span>
    </div>
  )

const InfoCard = ({ icon, title, items, sub }: InfoCardProps) => (
  <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
    <CardHeader className="bg-gradient-to-r from-primary to-primary/90 text-white rounded-t-xl">
      <CardTitle className="flex items-center text-xl font-semibold">
        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
          {icon}
        </div>
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="p-6">
      {sub && <p className="text-sm text-gray-500 mb-4 bg-gray-50 px-3 py-2 rounded-lg">{sub}</p>}
      <div className="space-y-1">{items}</div>
    </CardContent>
  </Card>
)

const CutSizes = ({ cutSizes, locale }: { cutSizes: CutSize[] | null; locale: string }) =>
  cutSizes &&
  cutSizes.length > 0 && (
    <div className="space-y-3 lg:space-y-4">
      <div className="flex flex-col space-y-3 lg:space-y-4">
        <h3 className="text-lg font-semibold text-white lg:text-xl xl:text-2xl tracking-wide">
          {locale === 'rs' ? 'Dostupni rezovi' : 'Cut Size'}
        </h3>
        <div className="flex flex-wrap gap-2 justify-start lg:gap-3 lg:w-full lg:justify-start lg:flex-nowrap">
          {cutSizes?.map((cut: CutSize) => (
            <span
              key={cut.id ?? cut.name}
              className="px-3 py-1 text-sm lg:px-4 lg:py-2 lg:text-base font-medium uppercase tracking-wide bg-white/10 text-gray-200 rounded-md hover:bg-white/20 hover:scale-105 transition-all duration-300 cursor-default"
            >
              {cut.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  )

const ProductImage = ({ image, title, isMobile }: ProductImageProps) => (
  <div className="flex justify-center py-4 lg:justify-start">
    <div className="relative">
      <div
        className={`${isMobile ? 'w-48 h-48 sm:w-56 sm:h-56 p-5' : 'w-80 h-80 xl:w-96 xl:h-96 2xl:w-[26rem] 2xl:h-[26rem] p-6 xl:p-8'} rounded-full overflow-hidden bg-white/15 backdrop-blur-sm border-2 border-white/30`}
      >
        {(() => {
          const imageUrl = getImageUrl(image)
          return imageUrl && imageUrl !== '/noimg.svg' ? (
            <Image
              src={imageUrl}
              alt={typeof image === 'object' && image?.alt ? image.alt : title}
              width={600}
              height={600}
              className="w-full h-full object-contain"
            />
          ) : null
        })()}
      </div>
      {!isMobile && (
        <>
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-primary/30 rounded-full blur-2xl animate-pulse" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/20 rounded-full blur-3xl animate-pulse" />
        </>
      )}
    </div>
  </div>
)

const HeroContent = ({
  title,
  scientificName,
  description,
  cutSizes,
  image,
  highlightImage,
  locale,
  isMobile,
}: HeroContentProps) => {
  // Use highlightImage if available, otherwise fall back to regular image
  const displayImage = highlightImage || image

  return (
    <div
      className={
        isMobile
          ? 'text-center text-white space-y-4 max-w-sm mx-auto'
          : 'text-left text-white space-y-6 w-full'
      }
    >
      <div className={isMobile ? 'space-y-2' : 'space-y-3'}>
        <h1
          className={
            isMobile
              ? 'text-3xl sm:text-4xl font-bold leading-tight'
              : 'text-3xl xl:text-4xl 2xl:text-5xl font-bold leading-tight tracking-tight'
          }
        >
          {title}
        </h1>
        {scientificName && (
          <div className="relative">
            <p
              className={`${isMobile ? 'text-lg sm:text-xl italic font-bold' : 'text-xl xl:text-2xl 2xl:text-3xl italic font-bold tracking-wide'} relative z-10 px-3 py-1 rounded-md bg-[#9BC273]/20 border border-[#9BC273]/30`}
              style={{ color: '#9BC273' }}
            >
              {scientificName}
            </p>
          </div>
        )}
      </div>
      {isMobile && <ProductImage image={displayImage} title={title} isMobile={true} />}
      <div className={isMobile ? 'px-2' : 'prose prose-base xl:prose-lg prose-invert max-w-none'}>
        <div
          className={
            isMobile
              ? 'prose prose-sm prose-invert text-gray-200 max-w-none [&_*]:text-gray-200'
              : 'text-gray-100 leading-relaxed font-light text-base xl:text-lg [&_*]:text-gray-100'
          }
        >
          <RichText data={description} enableGutter={false} />
        </div>
      </div>
      <CutSizes cutSizes={cutSizes || []} locale={locale} />
    </div>
  )
}

export default async function ProductPage({ params: p }: Args) {
  const { slug = '', locale } = await p
  const { isEnabled: draft } = await draftMode()
  const product = await query({ slug, locale, draft })

  if (!product) return <ErrorCard locale={locale} />

  const {
    title,
    image,
    highlightImage,
    scientificName,
    description,
    cutSizes = [],
    backgroundImage,
    productInfo,
    nutritiveInfo,
  } = product
  const imageUrl = typeof backgroundImage === 'object' ? backgroundImage?.url : undefined

  const productInfoItems = productInfo
    ? [
        [
          'origin',
          <MapPin key="origin-icon" className="w-4 h-4 text-primary" />,
          locale === 'rs' ? 'Poreklo' : 'Origin',
          productInfo.origin,
        ],
        [
          'season',
          <Calendar key="season-icon" className="w-4 h-4 text-primary" />,
          locale === 'rs' ? 'Sezona' : 'Season',
          productInfo.season,
        ],
        [
          'shelf',
          <Clock key="shelf-icon" className="w-4 h-4 text-primary" />,
          locale === 'rs' ? 'Trajnost' : 'Shelf Life',
          productInfo.shelfLife,
        ],
        [
          'storage',
          <Package key="storage-icon" className="w-4 h-4 text-primary" />,
          locale === 'rs' ? 'Čuvanje' : 'Storage',
          productInfo.storage,
        ],
      ].map(
        ([key, icon, label, value], index) =>
          value != null && (
            <InfoRow
              key={`${key as string}-${index}`}
              icon={icon}
              label={label as string}
              value={value as string | number | null | undefined}
            />
          ),
      )
    : []

  const nutritiveInfoItems = nutritiveInfo
    ? [
        ['cal', 'C', locale === 'rs' ? 'Kalorije' : 'Calories', nutritiveInfo.calories],
        ['prot', 'P', locale === 'rs' ? 'Proteini' : 'Protein', `${nutritiveInfo.protein}g`],
        [
          'carbs',
          'C',
          locale === 'rs' ? 'Ugljeni hidrati' : 'Carbohydrates',
          `${nutritiveInfo.carbohydrates}g`,
        ],
      ].map(
        ([key, letter, label, value], index) =>
          value != null && (
            <InfoRow
              key={`${key as string}-${index}`}
              icon={
                <span
                  key={`${key as string}-icon-${index}`}
                  className="w-4 h-4 bg-primary rounded-full text-xs text-white flex items-center justify-center"
                >
                  {letter as string}
                </span>
              }
              label={label as string}
              value={value as string | number | null | undefined}
            />
          ),
      )
    : []

  return (
    <div className="min-h-screen">
      <PayloadRedirects disableNotFound url={`/${locale}/products/${slug}`} />
      {draft && <LivePreviewListener />}

      <div className="relative h-[90vh]">
        {imageUrl && (
          <div className="absolute inset-0">
            <div
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${imageUrl})` }}
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>
        )}
        <div className="relative z-10 h-[90vh] flex items-center justify-center py-4 lg:py-8">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="lg:hidden flex items-center justify-center h-full">
              <HeroContent
                title={title}
                scientificName={scientificName}
                description={description}
                cutSizes={cutSizes || []}
                image={image}
                highlightImage={highlightImage}
                locale={locale}
                isMobile={true}
              />
            </div>
            <div className="hidden lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center lg:justify-center max-w-7xl mx-auto h-full">
              <div className="flex items-center justify-center">
                <ProductImage image={highlightImage || image} title={title} isMobile={false} />
              </div>
              <div className="flex items-center justify-center">
                <HeroContent
                  title={title}
                  scientificName={scientificName}
                  description={description}
                  cutSizes={cutSizes || []}
                  image={image}
                  highlightImage={highlightImage}
                  locale={locale}
                  isMobile={false}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="bg-gray-50 py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16">
            {productInfo && (
              <InfoCard
                icon={<Info className="w-5 h-5" />}
                title={locale === 'rs' ? 'Informacije o produktu' : 'Product Information'}
                items={productInfoItems}
              />
            )}
            {nutritiveInfo && (
              <InfoCard
                icon={<Apple className="w-5 h-5" />}
                title={locale === 'rs' ? 'Nutritivne vrednosti' : 'Nutritional Values'}
                sub={locale === 'rs' ? 'Na 100g' : 'Per 100g'}
                items={nutritiveInfoItems}
              />
            )}
          </div>
        </div>
      </section>
    </div>
  )
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
