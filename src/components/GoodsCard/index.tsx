'use client'
import { cn } from '@/utilities/ui'
import React from 'react'
import type { Good } from '@/payload-types'
import { TypedLocale } from 'payload'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MapPin, Package } from 'lucide-react'
import { getImageUrl } from '@/utilities/getImageUrl'

export const GoodsCard: React.FC<{
  className?: string
  doc?: Good
  relationTo?: 'goods'
  locale: TypedLocale
}> = (props) => {
  const { className, doc } = props

  const { products, meta } = doc || {}
  const { image: metaImage } = meta || {}

  const firstProduct = products?.[0]
  if (!firstProduct) return null

  const { image, title, description, country } = firstProduct

  return (
    <Card
      className={cn(
        'group overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] bg-white',
        className,
      )}
    >
      <div className="flex h-24 sm:h-32">
        {(image || metaImage) && (
          <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 relative overflow-hidden">
            <Image
              src={getImageUrl(image || metaImage)}
              alt={getImageUrl(image || metaImage, 'Product image')}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              sizes="(max-width: 640px) 96px, 128px"
            />
          </div>
        )}

        <div className="flex-1 p-3 sm:p-4 flex flex-col justify-between min-h-0">
          <div className="flex items-start justify-between mb-1.5">
            <CardTitle className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-1 group-hover:text-[#9BC273] transition-colors duration-200 flex-1 mr-2">
              {title}
            </CardTitle>
            <Package className="w-6 h-6 text-[#9BC273] flex-shrink-0 mt-0.5" />
          </div>

          <div className="space-y-0.5">
            {country && (
              <div className="flex items-center text-gray-500">
                <MapPin className="w-4 h-4 mr-1 text-[#9BC273]" />
                <span className="text-xs font-semibold">{country}</span>
              </div>
            )}

            {description && (
              <p className="text-xs text-gray-500 line-clamp-1 group-hover:text-gray-600 transition-colors duration-200">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
