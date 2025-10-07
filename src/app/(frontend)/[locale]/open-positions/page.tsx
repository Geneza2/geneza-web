import type { Metadata } from 'next/types'
import { TypedLocale } from 'payload'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
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

        <div className="container mt-8">
          <div className="rounded-xl bg-[#9BC273]/10 border border-[#9BC273]/20 p-4 text-sm text-gray-700">
            {allPositions.length === 0 ? (
              <span>
                {locale === 'rs'
                  ? 'Ne pronalazite odgovarajuću poziciju? Pišite nam na '
                  : "Didn't find a matching role? Email us at "}
                <a href="mailto:hr@geneza.rs" className="font-semibold text-[#7BA050] underline">
                  hr@geneza.rs
                </a>
                .
              </span>
            ) : (
              <span>
                {locale === 'rs'
                  ? 'Ne pronalazite odgovarajuću poziciju? Pošaljite nam biografiju na '
                  : "Don't see your position? Send your CV to "}
                <a href="mailto:hr@geneza.rs" className="font-semibold text-[#7BA050] underline">
                  hr@geneza.rs
                </a>
                .
              </span>
            )}
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
