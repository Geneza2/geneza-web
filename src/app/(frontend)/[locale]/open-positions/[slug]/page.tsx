import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import _RichText from '@/components/RichText'
import { Media } from '@/components/Media'

import { TypedLocale } from 'payload'

import { generateMeta } from '@/utilities/generateMeta'
import { generatePositionSlug } from '@/utilities/generatePositionSlug'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { openPositionsTranslations } from '@/i18n/translations/open-positions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export async function generateStaticParams() {
  try {
    const payload = await getPayload({ config: configPromise })
    const openPositions = await payload.find({
      collection: 'openPositions',
      draft: false,
      limit: 1000,
      overrideAccess: false,
      pagination: false,
      select: {
        slug: true,
        jobOffers: true,
      },
    })

    const params: { slug: string }[] = []

    openPositions.docs.forEach((doc) => {
      if (doc.jobOffers && Array.isArray(doc.jobOffers)) {
        doc.jobOffers.forEach((jobOffer) => {
          if (jobOffer && jobOffer.position) {
            const positionSlug = generatePositionSlug(jobOffer.position)
            if (positionSlug) {
              params.push({ slug: positionSlug })
            }
          }
        })
      }
    })

    return params
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}

type Args = {
  params: Promise<{
    slug?: string
    locale: TypedLocale
  }>
}

export default async function Position({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '', locale } = await paramsPromise
  const url = `/${locale}/open-positions/` + slug

  const t = openPositionsTranslations[locale] || openPositionsTranslations.en

  try {
    const position = await queryPositionBySlug({ slug })

    if (!position) {
      return (
        <article className="pt-16 pb-16">
          <div className="container max-w-4xl">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-4">
                {locale === 'rs' ? 'Pozicija nije pronađena' : 'Position Not Found'}
              </h1>
              <p className="text-gray-600 mb-8">
                {locale === 'rs'
                  ? 'Pozicija koju tražite ne postoji ili je uklonjena.'
                  : 'The position you are looking for does not exist or has been removed.'}
              </p>
              <a
                href={`/${locale}/open-positions`}
                className="inline-flex items-center px-6 py-3 bg-[#9BC273] text-white rounded-lg hover:bg-[#8AB562] transition-colors"
              >
                {locale === 'rs' ? 'Nazad na pozicije' : 'Back to Positions'}
              </a>
            </div>
          </div>
        </article>
      )
    }

    return (
      <article className="pt-16 pb-16">
        <PayloadRedirects disableNotFound url={url} />

        {draft && <LivePreviewListener />}

        <div className="container max-w-4xl">
          <div className="space-y-8">
            {position.jobOffers?.map((job, index) => (
              <Card
                key={job.id || index}
                className="bg-white shadow-xl border-gray-100 hover:shadow-2xl transition-all duration-300 relative overflow-hidden"
              >
                {job.image && (
                  <div className="relative w-full h-72 md:h-80 overflow-hidden">
                    <Media
                      resource={job.image}
                      size="100vw"
                      className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                )}

                <CardContent className="p-8">
                  <CardHeader className="p-0 mb-8">
                    <CardTitle className="text-3xl font-bold text-gray-900 mb-4">
                      {job.position}
                    </CardTitle>
                    {job.date && (
                      <div className="inline-flex items-center px-4 py-2 bg-gray-50 rounded-full">
                        <svg
                          className="w-5 h-5 text-gray-500 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span className="text-gray-700 font-medium">
                          {t.applicationDeadline}:{' '}
                          {new Date(job.date)
                            .toLocaleDateString('en-GB')
                            .split('/')
                            .reverse()
                            .join('.')}
                        </span>
                      </div>
                    )}
                  </CardHeader>

                  {job.requirements && job.requirements.length > 0 && (
                    <div className="mb-8">
                      <CardHeader className="px-0 pb-6">
                        <div className="flex items-center">
                          <div className="w-1 h-8 bg-[#9BC273] rounded-full mr-4"></div>
                          <CardTitle className="text-2xl font-bold text-gray-900">
                            {job.requirementsTitle || t.requirements}
                          </CardTitle>
                        </div>
                      </CardHeader>
                      <Card className="bg-gray-50 border-gray-100">
                        <CardContent className="p-6">
                          <ul className="space-y-4">
                            {job.requirements.map((req, reqIndex) => (
                              <li key={req.id || reqIndex} className="flex items-start group">
                                <div className="w-2 h-2 bg-[#9BC273] rounded-full mt-3 mr-4 flex-shrink-0 group-hover:scale-125 transition-transform duration-200"></div>
                                <span className="text-gray-700 leading-relaxed group-hover:text-gray-900 transition-colors duration-200">
                                  {req.item}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {job.responsibilities && job.responsibilities.length > 0 && (
                    <div className="mb-8">
                      <CardHeader className="px-0 pb-6">
                        <div className="flex items-center">
                          <div className="w-1 h-8 bg-[#9BC273] rounded-full mr-4"></div>
                          <CardTitle className="text-2xl font-bold text-gray-900">
                            {job.responsibilitiesTitle || t.responsibilities}
                          </CardTitle>
                        </div>
                      </CardHeader>
                      <Card className="bg-gray-50 border-gray-100">
                        <CardContent className="p-6">
                          <ul className="space-y-4">
                            {job.responsibilities.map((resp, respIndex) => (
                              <li key={resp.id || respIndex} className="flex items-start group">
                                <div className="w-2 h-2 bg-[#9BC273] rounded-full mt-3 mr-4 flex-shrink-0 group-hover:scale-125 transition-transform duration-200"></div>
                                <span className="text-gray-700 leading-relaxed group-hover:text-gray-900 transition-colors duration-200">
                                  {resp.item}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {job.callToAction && (
                    <div className="bg-gradient-to-br from-[#9BC273] to-[#8AB562] rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
                      <div className="relative z-10">
                        <div className="flex items-center mb-4">
                          <svg
                            className="w-8 h-8 mr-3 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <h3 className="text-2xl font-bold">{t.readyToApply}</h3>
                        </div>
                        <p className="text-green-50 mb-6 leading-relaxed text-lg">
                          {t.applyMessage}
                        </p>
                        <Button
                          asChild
                          size="lg"
                          className="bg-white text-[#9BC273] border-2 border-white hover:bg-gray-50 font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
                        >
                          <a
                            href={job.callToAction.link}
                            target={job.callToAction.openInNewTab ? '_blank' : '_self'}
                            rel={job.callToAction.openInNewTab ? 'noopener noreferrer' : undefined}
                            className="inline-flex items-center"
                          >
                            {job.callToAction.text}
                            {job.callToAction.openInNewTab && (
                              <svg
                                className="ml-3 w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                />
                              </svg>
                            )}
                          </a>
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </article>
    )
  } catch (error) {
    console.error('Error loading position:', error)
    return (
      <article className="pt-16 pb-16">
        <div className="container max-w-4xl">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">{locale === 'rs' ? 'Greška' : 'Error'}</h1>
            <p className="text-gray-600 mb-8">
              {locale === 'rs'
                ? 'Došlo je do greške prilikom učitavanja pozicije.'
                : 'An error occurred while loading the position.'}
            </p>
            <a
              href={`/${locale}/open-positions`}
              className="inline-flex items-center px-6 py-3 bg-[#9BC273] text-white rounded-lg hover:bg-[#8AB562] transition-colors"
            >
              {locale === 'rs' ? 'Nazad na pozicije' : 'Back to Positions'}
            </a>
          </div>
        </div>
      </article>
    )
  }
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const position = await queryPositionBySlug({ slug })

  return generateMeta({ doc: position })
}

const queryPositionBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  try {
    const result = await payload.find({
      collection: 'openPositions',
      draft,
      limit: 100,
      overrideAccess: draft,
      pagination: false,
      depth: 2,
    })

    for (const doc of result.docs) {
      if (doc.jobOffers && Array.isArray(doc.jobOffers)) {
        for (const jobOffer of doc.jobOffers) {
          if (jobOffer && jobOffer.position) {
            const positionSlug = generatePositionSlug(jobOffer.position)
            if (positionSlug === slug) {
              return {
                ...doc,
                jobOffers: [jobOffer],
              }
            }
          }
        }
      }
      if (doc.slug === slug) {
        return doc
      }
    }

    return null
  } catch (error) {
    console.error('Error querying position by slug:', error)
    return null
  }
})
