import type { Metadata } from 'next/types'
import { TypedLocale } from 'payload'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import { OpenPositionsArchive } from '@/components/OpenPositionsArchive'
import { openPositionsTranslations } from '@/i18n/translations/open-positions'

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

    const openPositions = await payload.find({
      collection: 'openPositions',
      depth: 2,
      limit: 100,
      overrideAccess: false,
      select: {
        title: true,
        slug: true,
        jobOffers: true,
        categories: true,
        meta: true,
      },
    })

    const allPositions = openPositions.docs.flatMap((doc) =>
      (doc.jobOffers || [])
        .filter((jobOffer) => jobOffer && jobOffer.position)
        .map((jobOffer, index) => ({
          id: doc.id,
          title: doc.title,
          slug: doc.slug || '',
          jobOffers: [jobOffer],
          categories: doc.categories,
          meta: doc.meta,
          _index: index,
        })),
    )

    return (
      <div className="pt-24 pb-24">
        <div className="container mb-16">
          <div className="prose dark:prose-invert max-w-none">
            <h1>{t.title}</h1>
          </div>
        </div>

        <div className="container mb-8">
          <div className="text-sm font-semibold">
            {allPositions.length === 0 &&
              (locale === 'rs' ? 'Nema rezultata pretrage.' : 'Search produced no results.')}
            {allPositions.length > 0 &&
              (locale === 'rs'
                ? `Prikazano ${allPositions.length} ${allPositions.length > 1 ? 'otvorenih pozicija' : 'otvorena pozicija'}`
                : `Showing ${allPositions.length} ${allPositions.length > 1 ? 'Open Positions' : 'Open Position'}`)}
          </div>
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
          <p className="text-center text-gray-600">
            {locale === 'rs'
              ? 'Greška pri učitavanju pozicija. Molimo pokušajte ponovo.'
              : 'Error loading positions. Please try again.'}
          </p>
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
