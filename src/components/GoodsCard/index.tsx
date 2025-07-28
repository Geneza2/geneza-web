'use client'
import { cn } from '@/utilities/ui'
import React from 'react'
import type { Good } from '@/payload-types'
import { TypedLocale } from 'payload'
import { Media } from '@/components/Media'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { goodsTranslations } from '@/i18n/translations/goods'
import { MapPin } from 'lucide-react'

export const GoodsCard: React.FC<{
  className?: string
  doc?: Good
  relationTo?: 'goods'
  locale: TypedLocale
}> = (props) => {
  const { className, doc, locale } = props

  const t = goodsTranslations[locale] || goodsTranslations.en
  const { products, meta } = doc || {}
  const { image: metaImage } = meta || {}

  const firstProduct = products?.[0]
  if (!firstProduct) return null

  const { image, title, description, country } = firstProduct

  return (
    <Card
      className={cn(
        'hover:cursor-pointer bg-white border border-gray-200 hover:border-gray-300 rounded-lg sm:rounded-xl overflow-hidden group transition-all duration-300 hover:shadow-lg hover:scale-[1.01] hover:-translate-y-0.5',
        className,
      )}
    >
      <div className="flex flex-row min-h-[80px] sm:min-h-[120px]">
        {(image || metaImage) && (
          <div className="w-20 h-20 sm:w-32 sm:h-32 relative flex-shrink-0 overflow-hidden">
            <Media
              resource={image || metaImage}
              size="200px"
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}

        <div className={cn('flex-1 p-3 sm:p-5', !(image || metaImage) && 'w-full')}>
          <CardHeader className="p-0 space-y-1 sm:space-y-3">
            <div className="flex flex-col space-y-1 sm:space-y-2">
              <CardTitle className="text-sm sm:text-lg font-semibold text-gray-900 leading-tight line-clamp-2 transition-colors duration-300 group-hover:text-[#9BC273]">
                {title}
              </CardTitle>

              {country && (
                <div className="flex items-center text-gray-600 transition-colors duration-300 group-hover:text-[#9BC273]">
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-medium">{country}</span>
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent className="p-0 mt-1 sm:mt-3">
            {description && (
              <div className="space-y-1 sm:space-y-2">
                <p className="text-gray-600 leading-relaxed text-xs sm:text-base line-clamp-2 sm:line-clamp-3 transition-colors duration-300 group-hover:text-gray-700">
                  {description.length > 80 ? `${description.substring(0, 80)}...` : description}
                </p>
              </div>
            )}
          </CardContent>
        </div>
      </div>
    </Card>
  )
}
