import type { Metadata } from 'next/types'
import { TypedLocale } from 'payload'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import { OpenPositionsArchive } from '@/components/OpenPositionsArchive'
import { openPositionsTranslations } from '@/i18n/translations/open-positions'
import { Badge } from '@/components/ui/badge'

export const dynamic = 'force-static'
export const revalidate = 600

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
      <div className="pt-24 pb-24">
        <div className="container mb-16">
          <div className="prose dark:prose-invert max-w-none">
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
      </div>
    )
  } catch (error) {
    console.error('Error loading open positions:', error)
    return (
      <div className="pt-24 pb-24">
        <div className="container mb-16">
          <div className="prose dark:prose-invert max-w-none">
            <h1>{t.title}</h1>
          </div>
        </div>
        <div className="container">
          <Badge variant="destructive" className="text-center">
            {locale === 'rs'
              ? 'Greška pri učitavanju pozicija. Molimo pokušajte ponovo.'
              : 'Error loading positions. Please try again.'}
          </Badge>
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
