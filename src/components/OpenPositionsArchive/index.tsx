import { cn } from '@/utilities/ui'
import React from 'react'
import { TypedLocale } from 'payload'

import { PositionCard, PositionCardData } from '@/components/PositionCard'

export type Props = {
  openPositions: PositionCardData[]
  locale: TypedLocale
}

export const OpenPositionsArchive: React.FC<Props> = (props) => {
  const { openPositions, locale } = props

  return (
    <div className={cn('container')}>
      <div className="space-y-6">
        {openPositions?.map((position, index) => {
          if (typeof position === 'object' && position !== null) {
            return (
              <PositionCard key={index} doc={position} relationTo="openPositions" locale={locale} />
            )
          }

          return null
        })}
      </div>
    </div>
  )
}
