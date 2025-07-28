'use client'
import { cn } from '@/utilities/ui'
import React from 'react'
import type { Good } from '@/payload-types'
import { TypedLocale } from 'payload'
import { Media } from '@/components/Media'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, Package } from 'lucide-react'

export const GoodsCard: React.FC<{
  className?: string
  doc?: Good
  relationTo?: 'goods'
  locale: TypedLocale
}> = (props) => {
  const { className, doc, locale } = props

  const { products, meta } = doc || {}
  const { image: metaImage } = meta || {}

  const firstProduct = products?.[0]
  if (!firstProduct) return null

  const { image, title, description, country } = firstProduct

  return (
    <Card
      className={cn(
        'group overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02]',
        className,
      )}
    >
      <div className="flex">
        {/* Image Section */}
        {(image || metaImage) && (
          <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0">
            <Media
              resource={image || metaImage}
              size="200px"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
          </div>
        )}

        {/* Content Section */}
        <div className="flex-1 p-4 sm:p-6">
          <CardHeader className="p-0 pb-2">
            <div className="flex items-start justify-between">
              <CardTitle className="text-base sm:text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-[#9BC273] transition-colors duration-200">
                {title}
              </CardTitle>
              <Package className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
            </div>
          </CardHeader>

          <CardContent className="p-0 space-y-3">
            {/* Country Badge */}
            {country && (
              <div className="flex items-center text-gray-600">
                <MapPin className="w-3 h-3 mr-1.5 text-gray-500" />
                <span className="text-xs font-medium">{country}</span>
              </div>
            )}

            {/* Description */}
            {description && (
              <p className="text-sm text-gray-600 line-clamp-2 group-hover:text-gray-700 transition-colors duration-200">
                {description.length > 100 ? `${description.substring(0, 100)}...` : description}
              </p>
            )}
          </CardContent>
        </div>
      </div>
    </Card>
  )
}
