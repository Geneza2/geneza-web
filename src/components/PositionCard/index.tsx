'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, ChevronRight } from 'lucide-react'

import { cn } from '@/utilities/ui'
import useClickableCard from '@/utilities/useClickableCard'
import { generatePositionSlug } from '@/utilities/generatePositionSlug'
import { getImageUrl } from '@/utilities/getImageUrl'
import { openPositionsTranslations } from '@/i18n/translations/open-positions'

import type { OpenPosition } from '@/payload-types'
import { TypedLocale } from 'payload'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export type PositionCardData = Pick<OpenPosition, 'slug' | 'title' | 'jobOffers' | 'meta'> & {
  englishPosition?: string
}

type Props = {
  className?: string
  doc?: PositionCardData
  relationTo?: 'openPositions'
  locale: TypedLocale
}

export const PositionCard: React.FC<Props> = ({ className, doc, locale }) => {
  const { card, link } = useClickableCard<HTMLDivElement>({})
  const t = openPositionsTranslations[locale] || openPositionsTranslations.en

  if (!doc) return null

  const { slug, jobOffers, meta, englishPosition } = doc
  const { image: metaImage } = meta || {}
  const job = jobOffers?.[0]
  if (!job) return null

  const { image, position, date, requirements } = job
  const previewRequirements = requirements?.slice(0, 2) || []

  const positionSlug = englishPosition
    ? generatePositionSlug(englishPosition)
    : position
      ? generatePositionSlug(position)
      : slug
  const href = `/${locale}/open-positions/${positionSlug}`

  const imageUrl = getImageUrl(image || metaImage)

  return (
    <Card
      ref={card.ref}
      className={cn(
        'overflow-hidden rounded-2xl border border-gray-200 bg-white transition-transform duration-300 ease-in-out hover:scale-[1.02]',
        className,
      )}
    >
      <div className="flex flex-col md:flex-row min-h-[320px]">
        {imageUrl && (
          <div className="relative h-48 md:h-auto md:w-80 flex-shrink-0 bg-gray-100">
            <Image
              src={imageUrl}
              alt={position || 'Position image'}
              fill
              className="object-cover w-full h-full"
              sizes="(max-width: 768px) 100vw, 320px"
            />
          </div>
        )}

        <div className={cn('flex flex-col justify-between p-6 md:p-8', !imageUrl && 'w-full')}>
          <CardHeader className="p-0 mb-4 space-y-2">
            <CardTitle className="text-2xl font-bold leading-tight text-gray-900">
              <Link href={href} ref={link.ref} className="transition-colors hover:text-[#9BC273]">
                {position}
              </Link>
            </CardTitle>

            {date && (
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="mr-2 h-4 w-4 shrink-0" />
                <span>
                  {t.applicationDeadline}: {new Date(date).toLocaleDateString('en-GB')}
                </span>
              </div>
            )}
          </CardHeader>

          {previewRequirements.length > 0 && (
            <CardContent className="p-0 space-y-4">
              <h4 className="flex items-center font-semibold text-gray-900">
                <span className="mr-3 h-5 w-1 rounded-full bg-[#9BC273]" />
                {t.requirements}
              </h4>

              <ul className="ml-4 space-y-2 text-sm text-gray-700">
                {previewRequirements.map((req, i) => (
                  <li key={i} className="flex items-start">
                    <span className="mt-2 mr-3 h-1.5 w-1.5 shrink-0 rounded-full bg-[#9BC273]" />
                    {req.item}
                  </li>
                ))}
              </ul>

              <div className="flex justify-end pt-4">
                <Button
                  asChild
                  size="sm"
                  className="bg-[#9BC273] text-white hover:bg-[#8AB562] font-medium shadow-sm"
                >
                  <Link href={href} className="inline-flex items-center">
                    {t.viewDetails}
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          )}
        </div>
      </div>
    </Card>
  )
}
