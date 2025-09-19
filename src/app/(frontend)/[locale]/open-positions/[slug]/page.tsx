import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import { TypedLocale } from 'payload'
import { generateMeta } from '@/utilities/generateMeta'
import { generatePositionSlug } from '@/utilities/generatePositionSlug'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { openPositionsTranslations } from '@/i18n/translations/open-positions'
import { retryOperation } from '@/utilities/retryOperation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, CheckCircle, ExternalLink, ArrowLeft } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function generateStaticParams() {
  try {
    const payload = await getPayload({ config: configPromise })
    const openPositions = await retryOperation(() =>
      payload.find({
        collection: 'openPositions',
        draft: false,
        limit: 1000,
        overrideAccess: false,
        pagination: false,
        locale: 'en',
        select: { slug: true, jobOffers: true },
      }),
    )

    const params: { slug: string }[] = []

    openPositions.docs.forEach((doc) => {
      if (doc.jobOffers && Array.isArray(doc.jobOffers)) {
        doc.jobOffers.forEach((jobOffer) => {
          if (jobOffer?.position) {
            const positionSlug = generatePositionSlug(jobOffer.position)
            if (positionSlug) params.push({ slug: positionSlug })
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
  params: Promise<{ slug?: string; locale: TypedLocale }>
}

export default async function Position({ params: paramsPromise }: Args) {
  try {
    const { isEnabled: draft } = await draftMode()
    const { slug = '', locale } = await paramsPromise
    const url = `/${locale}/open-positions/${slug}`
    const t = openPositionsTranslations[locale] || openPositionsTranslations.en

    const position = await queryPositionBySlug({ slug, locale })

    if (!position) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardContent className="p-8 text-center space-y-4">
              <h1 className="text-2xl font-semibold">
                {locale === 'rs' ? 'Pozicija nije pronađena' : 'Position Not Found'}
              </h1>
              <p className="text-muted-foreground">
                {locale === 'rs'
                  ? 'Pozicija koju tražite ne postoji ili je uklonjena.'
                  : 'The position you are looking for does not exist or has been removed.'}
              </p>
              <Button asChild className="w-full">
                <Link href={`/${locale}/open-positions`} className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  {locale === 'rs' ? 'Nazad na pozicije' : 'Back to Positions'}
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      )
    }

    return (
      <div className="min-h-screen bg-background">
        <PayloadRedirects disableNotFound url={url} />
        {draft && <LivePreviewListener />}

        <div className="container mx-auto px-4 py-8">
          {position.jobOffers?.map((job, index) => (
            <div key={job.id || index} className="space-y-8">
              {job.image &&
                typeof job.image === 'object' &&
                'url' in job.image &&
                job.image.url && (
                  <div className="relative w-full h-[400px] md:h-[500px] rounded-lg overflow-hidden">
                    <Image
                      src={job.image.url}
                      alt={job.position}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6">
                      <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                        {job.position}
                      </h1>
                      {job.date && (
                        <Badge variant="secondary" className="inline-flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {t.applicationDeadline}: {new Date(job.date).toLocaleDateString('en-GB')}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

              <div className="space-y-6">
                {job.requirements && job.requirements.length > 0 && (
                  <Card className="bg-white">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <div className="w-1 h-6 bg-primary rounded-full" />
                        {job.requirementsTitle || t.requirements}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {job.requirements.map((req, reqIndex) => (
                          <li key={req.id || reqIndex} className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                            <span className="text-muted-foreground">{req.item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {job.responsibilities && job.responsibilities.length > 0 && (
                  <Card className="bg-white">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <div className="w-1 h-6 bg-primary rounded-full" />
                        {job.responsibilitiesTitle || t.responsibilities}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {job.responsibilities.map((resp, respIndex) => (
                          <li key={resp.id || respIndex} className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                            <span className="text-muted-foreground">{resp.item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {job.callToAction && (
                  <Card className="bg-primary text-primary-foreground">
                    <CardContent className="p-8">
                      <div className="flex items-center gap-3 mb-4">
                        <CheckCircle className="w-6 h-6" />
                        <h3 className="text-xl font-semibold">{t.readyToApply}</h3>
                      </div>
                      <p className="mb-6 opacity-90">{t.applyMessage}</p>
                      <Button asChild variant="secondary" size="lg" className="font-semibold">
                        <a
                          href="mailto:geneza@geneza.com?subject=Job Application"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2"
                        >
                          {job.callToAction.text}
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error loading position:', error)
    const { locale } = await paramsPromise
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center space-y-4">
            <h1 className="text-2xl font-semibold">{locale === 'rs' ? 'Greška' : 'Error'}</h1>
            <p className="text-muted-foreground">
              {locale === 'rs'
                ? 'Došlo je do greške pri učitavanju pozicije.'
                : 'An error occurred while loading the position.'}
            </p>
            <Button asChild className="w-full">
              <Link href={`/${locale}/open-positions`} className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
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
    try {
      const { isEnabled: draft } = await draftMode()
      const payload = await getPayload({ config: configPromise })

      const englishResult = await retryOperation(() =>
        payload.find({
          collection: 'openPositions',
          draft,
          limit: 100,
          overrideAccess: draft,
          pagination: false,
          depth: 2,
          locale: 'en',
        }),
      )

      let foundDocId = null
      let foundJobOfferIndex = null

      for (const doc of englishResult.docs) {
        if (doc.jobOffers && Array.isArray(doc.jobOffers)) {
          for (let i = 0; i < doc.jobOffers.length; i++) {
            const jobOffer = doc.jobOffers[i]
            if (jobOffer?.position) {
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

      const result = await retryOperation(() =>
        payload.find({
          collection: 'openPositions',
          draft,
          limit: 1,
          overrideAccess: draft,
          pagination: false,
          depth: 2,
          locale: locale,
          where: { id: { equals: foundDocId } },
        }),
      )

      const doc = result.docs[0]
      if (!doc?.jobOffers || !Array.isArray(doc.jobOffers)) return null

      const specificJobOffer = doc.jobOffers[foundJobOfferIndex]
      if (!specificJobOffer) return null

      return { ...doc, jobOffers: [specificJobOffer] }
    } catch (error) {
      console.error('Error querying position by slug:', error)
      return null
    }
  },
)
