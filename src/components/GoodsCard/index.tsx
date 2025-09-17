'use client'
import { cn } from '@/utilities/ui'
import React from 'react'
import type { Good } from '@/payload-types'
import { TypedLocale } from 'payload'
import Image from 'next/image'
import { Card, CardTitle } from '@/components/ui/card'
import { MapPin, Package } from 'lucide-react'
import { getImageUrl } from '@/utilities/getImageUrl'

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
        'group overflow-hidden bg-white/80 backdrop-blur-sm border-0 rounded-3xl shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-[#9BC273]/10 hover:-translate-y-1',
        className,
      )}
    >
      <div className="flex h-32 sm:h-36 lg:h-40">
        {(image || metaImage) && (
          <div className="w-32 h-32 sm:w-36 sm:h-36 lg:w-40 lg:h-40 flex-shrink-0 relative overflow-hidden rounded-l-3xl">
            <Image
              src={getImageUrl(image || metaImage)}
              alt={getImageUrl(image || metaImage, 'Product image')}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 128px, (max-width: 1024px) 144px, 160px"
            />
          </div>
        )}

        <div className="flex-1 p-4 sm:p-6 flex flex-col justify-between min-h-0">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 mr-4">
              <CardTitle className="text-base sm:text-lg font-bold text-gray-900 line-clamp-2 leading-tight transition-colors duration-300 group-hover:text-[#9BC273]">
                {title}
              </CardTitle>
              {country && (
                <div className="flex items-center text-gray-500 mt-2">
                  <MapPin className="w-4 h-4 mr-2 text-[#9BC273]" />
                  <span className="text-sm font-medium">{country}</span>
                </div>
              )}
            </div>
            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#9BC273]/10 to-[#9BC273]/5 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:from-[#9BC273]/20 group-hover:to-[#9BC273]/10 group-hover:scale-110">
              <Package className="w-6 h-6 text-[#9BC273]" />
            </div>
          </div>

          <div className="space-y-2">
            {description && (
              <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">{description}</p>
            )}

            <div className="flex items-center pt-2">
              <div className="flex items-center text-xs text-gray-500">
                <span className="inline-block w-2 h-2 bg-[#9BC273] rounded-full mr-2"></span>
                <span className="font-medium">{locale === 'rs' ? 'Dostupno' : 'Available'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
