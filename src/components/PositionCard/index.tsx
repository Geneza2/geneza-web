'use client'
import { cn } from '@/utilities/ui'
import useClickableCard from '@/utilities/useClickableCard'
import Link from 'next/link'
import React from 'react'

import type { OpenPosition } from '@/payload-types'
import { TypedLocale } from 'payload'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { generatePositionSlug } from '@/utilities/generatePositionSlug'
import { openPositionsTranslations } from '@/i18n/translations/open-positions'
import { Calendar, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { getImageUrl } from '@/utilities/getImageUrl'

export type PositionCardData = Pick<OpenPosition, 'slug' | 'title' | 'jobOffers' | 'meta'> & {
  englishPosition?: string
}

export const PositionCard: React.FC<{
  className?: string
  doc?: PositionCardData
  relationTo?: 'openPositions'
  locale: TypedLocale
}> = (props) => {
  const { card, link } = useClickableCard<HTMLDivElement>({})
  const { className, doc, locale } = props

  const t = openPositionsTranslations[locale] || openPositionsTranslations.en
  const { slug, jobOffers, meta, englishPosition } = doc || {}
  const { image: metaImage } = meta || {}

  const firstJob = jobOffers?.[0]
  if (!firstJob) return null

  const { image, position, date, requirements } = firstJob
  const firstTwoRequirements = requirements?.slice(0, 2) || []

  const positionSlug = englishPosition
    ? generatePositionSlug(englishPosition)
    : position
      ? generatePositionSlug(position)
      : slug
  const href = `/${locale}/open-positions/${positionSlug}`

  return (
    <Card
      className={cn(
        'hover:cursor-pointer transition-all duration-300 hover:shadow-xl bg-white border border-gray-200 hover:border-gray-300 rounded-2xl overflow-hidden',
        className,
      )}
      ref={card.ref}
    >
      <div className="flex flex-col md:flex-row min-h-[320px]">
        {(image || metaImage) && (
          <div className="md:w-80 h-full relative flex-shrink-0 overflow-hidden">
            <Image
              src={getImageUrl(image || metaImage)}
              alt={position || 'Position image'}
              width={320}
              height={240}
              sizes="(max-width: 768px) 100vw, 320px"
              className="object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
        )}

        <div className={cn('flex-1 p-6 md:p-8', !(image || metaImage) && 'w-full')}>
          <CardHeader className="p-0 space-y-4">
            <div className="flex flex-col space-y-2">
              <CardTitle className="text-2xl font-bold text-gray-900 leading-tight">
                <Link
                  href={href}
                  ref={link.ref}
                  className="hover:text-[#9BC273] transition-colors duration-200"
                >
                  {position}
                </Link>
              </CardTitle>

              {date && (
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="text-sm font-medium">
                    {t.applicationDeadline}:
                    {new Date(date).toLocaleDateString('en-US').split('/').reverse().join('.')}
                  </span>
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent className="p-0 mt-6">
            {firstTwoRequirements.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 flex items-center">
                  <div className="w-1 h-5 bg-[#9BC273] rounded-full mr-3"></div>
                  {t.requirements}
                </h4>
                <ul className="space-y-2 ml-4">
                  {firstTwoRequirements.map((req, index) => (
                    <li
                      key={index}
                      className="text-gray-700 flex items-start text-sm leading-relaxed"
                    >
                      <span className="inline-block w-1.5 h-1.5 bg-[#9BC273] rounded-full mt-2 mr-3 flex-shrink-0" />
                      {req.item}
                    </li>
                  ))}
                </ul>

                <div className="flex items-center justify-end pt-4">
                  <Button
                    asChild
                    size="sm"
                    className="bg-[#9BC273] text-white hover:bg-[#8AB562] font-medium shadow-sm"
                  >
                    <Link href={href} className="inline-flex items-center">
                      {t.viewDetails}
                      <ChevronRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </div>
      </div>
    </Card>
  )
}
