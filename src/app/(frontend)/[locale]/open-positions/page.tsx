import type { Metadata } from 'next/types'
import { TypedLocale } from 'payload'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import Image from 'next/image'
import { OpenPositionsArchive } from '@/components/OpenPositionsArchive'
import { openPositionsTranslations } from '@/i18n/translations/open-positions'
import { Badge } from '@/components/ui/badge'

export const dynamic = 'force-dynamic'
export const revalidate = 600
export const runtime = 'nodejs'

type Args = {
  params: Promise<{
    locale: TypedLocale
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { locale } = await paramsPromise
  const t = openPositionsTranslations[locale] || openPositionsTranslations.en

  try {
    const payload = await getPayload({ config: configPromise })

    const [openPositions, englishOpenPositions] = await Promise.all([
      payload.find({
        collection: 'openPositions',
        depth: 2,
        limit: 100,
        overrideAccess: false,
        locale: locale,
        select: {
          id: true,
          title: true,
          slug: true,
          jobOffers: true,
          categories: true,
          meta: true,
        },
      }),
      payload.find({
        collection: 'openPositions',
        depth: 2,
        limit: 100,
        overrideAccess: false,
        locale: 'en',
        select: {
          id: true,
          jobOffers: {
            position: true,
          },
        },
      }),
    ])

    const englishPositionMap = new Map()
    englishOpenPositions.docs.forEach((doc) => {
      if (doc.jobOffers && Array.isArray(doc.jobOffers)) {
        doc.jobOffers.forEach((jobOffer, index) => {
          if (jobOffer && jobOffer.position) {
            englishPositionMap.set(`${doc.id}-${index}`, jobOffer.position)
          }
        })
      }
    })

    const allPositions = openPositions.docs.flatMap((doc) =>
      (doc.jobOffers || [])
        .filter((jobOffer) => jobOffer && jobOffer.position)
        .map((jobOffer, index) => {
          const englishPosition = englishPositionMap.get(`${doc.id}-${index}`) || jobOffer.position
          return {
            id: doc.id,
            title: doc.title,
            slug: doc.slug || '',
            jobOffers: [jobOffer],
            categories: doc.categories,
            meta: doc.meta,
            _index: index,
            englishPosition,
          }
        }),
    )

    return (
      <div className="pt-24 pb-24 bg-gradient-to-br from-gray-50 via-white to-green-50/30">
        <div className="container mb-16">
          <div className="prose max-w-none">
            <h1>{t.title}</h1>
          </div>
        </div>

        <div className="container mb-8">
          <Badge variant="outline" className="text-sm font-semibold">
            {allPositions.length === 0 &&
              (locale === 'rs' ? 'Nema rezultata pretrage.' : 'Search produced no results.')}
            {allPositions.length > 0 &&
              (locale === 'rs'
                ? `Prikazano ${allPositions.length} ${allPositions.length > 1 ? 'otvorenih pozicija' : 'otvorena pozicija'}`
                : `Showing ${allPositions.length} ${allPositions.length > 1 ? 'Open Positions' : 'Open Position'}`)}
          </Badge>
        </div>

        <OpenPositionsArchive openPositions={allPositions} locale={locale} />

        <div className="container mt-16">
          <div className="rounded-2xl bg-gradient-to-br from-[#9BC273]/10 to-[#7BA050]/5 border border-[#9BC273]/20 overflow-hidden shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-0 items-center">
              {/* Square Image on the left */}
              <div className="relative w-full md:w-64 lg:w-80 h-64 lg:h-80">
                <Image
                  src="/api/media/file/Geneza-011.jpg"
                  alt="Join our team"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 320px"
                  priority={false}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#9BC273]/20"></div>
              </div>

              {/* Text on the right */}
              <div className="p-8 md:p-12">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                  {locale === 'rs' ? 'Ne vidite svoju poziciju?' : "Don't see your position?"}
                </h3>
                <p className="text-base md:text-lg text-gray-700 mb-6">
                  {allPositions.length === 0 ? (
                    <span>
                      {locale === 'rs'
                        ? 'Ne pronalazite odgovarajuću poziciju? Kontaktirajte nas direktno i predstavite se.'
                        : "Didn't find a matching role? Contact us directly and introduce yourself."}
                    </span>
                  ) : (
                    <span>
                      {locale === 'rs'
                        ? 'Pošaljite nam svoju biografiju i predstavite se. Uvek tražimo talentovane ljude koji dele naše vrednosti.'
                        : "Send us your CV and introduce yourself. We're always looking for talented people who share our values."}
                    </span>
                  )}
                </p>
                <div className="flex justify-end">
                  <a
                    href="mailto:hr@geneza.rs"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#7BA050] hover:bg-[#6A8F45] text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    hr@geneza.rs
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  } catch (_error) {
    return (
      <div className="pt-24 pb-24 bg-gradient-to-br from-gray-50 via-white to-green-50/30">
        <div className="container mb-16">
          <div className="prose max-w-none">
            <h1>{t.title}</h1>
          </div>
        </div>
      </div>
    )
  }
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { locale } = await paramsPromise
  const t = openPositionsTranslations[locale] || openPositionsTranslations.en

  return {
    title: t.title,
  }
}
