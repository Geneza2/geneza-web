import type { Metadata } from 'next'
import Link from 'next/link'

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
import { Badge } from '@/components/ui/badge'
import { Calendar, CheckCircle, ExternalLink } from 'lucide-react'

export async function generateStaticParams() {
  try {
    const payload = await getPayload({ config: configPromise })
    const openPositions = await payload.find({
      collection: 'openPositions',
      draft: false,
      limit: 1000,
      overrideAccess: false,
      pagination: false,
      locale: 'en',
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
    const position = await queryPositionBySlug({ slug, locale })

    if (!position) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <Card className="max-w-2xl w-full text-center">
            <CardContent className="p-12">
              <h1 className="text-3xl font-bold text-gray-900 mb-6">
                {locale === 'rs' ? 'Pozicija nije pronađena' : 'Position Not Found'}
              </h1>
              <p className="text-gray-600 text-base mb-8">
                {locale === 'rs'
                  ? 'Pozicija koju tražite ne postoji ili je uklonjena.'
                  : 'The position you are looking for does not exist or has been removed.'}
              </p>
              <Button asChild size="lg" className="bg-[#9BC273] hover:bg-[#8AB562] text-white">
                <Link href={`/${locale}/open-positions`}>
                  {locale === 'rs' ? 'Nazad na pozicije' : 'Back to Positions'}
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      )
    }

    return (
      <div className="min-h-screen bg-gray-50">
        <PayloadRedirects disableNotFound url={url} />
        {draft && <LivePreviewListener />}

        <div className="max-w-none mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {position.jobOffers?.map((job, index) => (
            <Card key={job.id || index} className="overflow-hidden border-0 shadow-none">
              {job.image && (
                <div className="relative w-full h-96 lg:h-[500px] overflow-hidden">
                  <Media resource={job.image} size="100vw" className="object-cover w-full h-full" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                </div>
              )}

              <CardContent className="p-8 lg:p-12">
                <div className="max-w-6xl mx-auto">
                  <div className="mb-8">
                    <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                      {job.position}
                    </h1>
                    {job.date && (
                      <Badge
                        variant="secondary"
                        className="inline-flex items-center px-6 py-3 text-base"
                      >
                        <Calendar className="w-5 h-5 mr-3" />
                        {t.applicationDeadline}:{' '}
                        {new Date(job.date)
                          .toLocaleDateString('en-GB')
                          .split('/')
                          .reverse()
                          .join('.')}
                      </Badge>
                    )}
                  </div>

                  <div className="grid lg:grid-cols-2 gap-12">
                    {job.requirements && job.requirements.length > 0 && (
                      <Card>
                        <CardHeader>
                          <div className="flex items-center">
                            <div className="w-2 h-8 bg-[#9BC273] rounded-full mr-4" />
                            <h2 className="text-2xl font-bold text-gray-900">
                              {job.requirementsTitle || t.requirements}
                            </h2>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-4">
                            {job.requirements.map((req, reqIndex) => (
                              <li key={req.id || reqIndex} className="flex items-start group">
                                <div className="w-3 h-3 bg-[#9BC273] rounded-full mt-2 mr-4 flex-shrink-0 group-hover:scale-125 transition-transform duration-200" />
                                <span className="text-gray-700 leading-relaxed text-base group-hover:text-gray-900 transition-colors duration-200">
                                  {req.item}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}

                    {job.responsibilities && job.responsibilities.length > 0 && (
                      <Card>
                        <CardHeader>
                          <div className="flex items-center">
                            <div className="w-2 h-8 bg-[#9BC273] rounded-full mr-4" />
                            <h2 className="text-2xl font-bold text-gray-900">
                              {job.responsibilitiesTitle || t.responsibilities}
                            </h2>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-4">
                            {job.responsibilities.map((resp, respIndex) => (
                              <li key={resp.id || respIndex} className="flex items-start group">
                                <div className="w-3 h-3 bg-[#9BC273] rounded-full mt-2 mr-4 flex-shrink-0 group-hover:scale-125 transition-transform duration-200" />
                                <span className="text-gray-700 leading-relaxed text-base group-hover:text-gray-900 transition-colors duration-200">
                                  {resp.item}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  {job.callToAction && (
                    <Card className="mt-12 bg-gradient-to-br from-[#9BC273] to-[#8AB562] text-white border-0">
                      <CardContent className="p-10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-20 translate-x-20" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-16 -translate-x-16" />
                        <div className="relative z-10 max-w-2xl">
                          <div className="flex items-center mb-6">
                            <CheckCircle className="w-8 h-8 mr-4 text-white" />
                            <h3 className="text-2xl font-bold">{t.readyToApply}</h3>
                          </div>
                          <p className="text-green-50 mb-8 leading-relaxed text-lg">
                            {t.applyMessage}
                          </p>
                          <Button
                            asChild
                            size="lg"
                            className="bg-white text-[#9BC273] border-2 border-white hover:bg-gray-50 font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 px-8 py-4 rounded-2xl"
                          >
                            <Link
                              href={job.callToAction.link}
                              target={job.callToAction.openInNewTab ? '_blank' : '_self'}
                              rel={
                                job.callToAction.openInNewTab ? 'noopener noreferrer' : undefined
                              }
                              className="inline-flex items-center"
                            >
                              {job.callToAction.text}
                              {job.callToAction.openInNewTab && (
                                <ExternalLink className="ml-4 w-5 h-5" />
                              )}
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error loading position:', error)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <Card className="max-w-2xl w-full text-center">
          <CardContent className="p-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              {locale === 'rs' ? 'Greška' : 'Error'}
            </h1>
            <p className="text-gray-600 text-base mb-8">
              {locale === 'rs'
                ? 'Došlo je do greške prilikom učitavanja pozicije.'
                : 'An error occurred while loading the position.'}
            </p>
            <Button asChild size="lg" className="bg-[#9BC273] hover:bg-[#8AB562] text-white">
              <Link href={`/${locale}/open-positions`}>
                {locale === 'rs' ? 'Nazad na pozicije' : 'Back to Positions'}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const position = await queryPositionBySlug({ slug, locale: 'en' })

  return generateMeta({ doc: position })
}

const queryPositionBySlug = cache(
  async ({ slug, locale }: { slug: string; locale: TypedLocale }) => {
    const { isEnabled: draft } = await draftMode()

    const payload = await getPayload({ config: configPromise })

    try {
      const englishResult = await payload.find({
        collection: 'openPositions',
        draft,
        limit: 100,
        overrideAccess: draft,
        pagination: false,
        depth: 2,
        locale: 'en',
      })

      let foundDocId = null
      let foundJobOfferIndex = null

      for (const doc of englishResult.docs) {
        if (doc.jobOffers && Array.isArray(doc.jobOffers)) {
          for (let i = 0; i < doc.jobOffers.length; i++) {
            const jobOffer = doc.jobOffers[i]
            if (jobOffer && jobOffer.position) {
              const positionSlug = generatePositionSlug(jobOffer.position)
              if (positionSlug === slug) {
                foundDocId = doc.id
                foundJobOfferIndex = i
                break
              }
            }
          }
        }
        if (foundDocId !== null) break
      }

      if (foundDocId === null || foundJobOfferIndex === null) return null

      const result = await payload.find({
        collection: 'openPositions',
        draft,
        limit: 1,
        overrideAccess: draft,
        pagination: false,
        depth: 2,
        locale: locale,
        where: {
          id: {
            equals: foundDocId,
          },
        },
      })

      const doc = result.docs[0]
      if (!doc || !doc.jobOffers || !Array.isArray(doc.jobOffers)) return null

      const specificJobOffer = doc.jobOffers[foundJobOfferIndex]
      if (!specificJobOffer) return null

      return {
        ...doc,
        jobOffers: [specificJobOffer],
      }
    } catch (error) {
      console.error('Error querying position by slug:', error)
      return null
    }
  },
)
