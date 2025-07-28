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
        'hover:cursor-pointer transition-all duration-300 hover:shadow-lg bg-white border border-gray-200 hover:border-gray-300 rounded-lg overflow-hidden',
        className,
      )}
    >
      <div className="flex flex-row min-h-[120px]">
        {(image || metaImage) && (
          <div className="w-32 h-32 relative flex-shrink-0 overflow-hidden">
            <Media
              resource={image || metaImage}
              size="200px"
              className="object-cover w-full h-full"
            />
          </div>
        )}

        <div className={cn('flex-1 p-4', !(image || metaImage) && 'w-full')}>
          <CardHeader className="p-0 space-y-2">
            <div className="flex flex-col space-y-1">
              <CardTitle className="text-lg font-semibold text-gray-900 leading-tight">
                {title}
              </CardTitle>

              {country && (
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                  <span className="text-xs font-medium">{country}</span>
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent className="p-0 mt-2">
            {description && (
              <div className="space-y-2">
                <p className="text-gray-600 leading-relaxed text-sm">
                  {description.length > 150 ? `${description.substring(0, 150)}...` : description}
                </p>
              </div>
            )}
          </CardContent>
        </div>
      </div>
    </Card>
  )
}
