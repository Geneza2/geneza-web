'use client'
import { cn } from '@/utilities/ui'
import React from 'react'
import type { Good, Media } from '@/payload-types'
import { TypedLocale } from 'payload'
import Image from 'next/image'
import { Card, CardTitle } from '@/components/ui/card'
import { MapPin, Package, FileCheck2 } from 'lucide-react'
import { getImageUrl } from '@/utilities/getImageUrl'
import Link from 'next/link'

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

  const { image, description, country, specPdf, title } = firstProduct as any

  return (
    <Card
      className={cn(
        'group overflow-hidden bg-white/80 backdrop-blur-sm border-0 rounded-3xl shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-[#9BC273]/10 hover:-translate-y-1',
        className,
      )}
    >
      <div className="flex h-28 sm:h-32 lg:h-36 xl:h-40">
        {(image || metaImage) &&
          (() => {
            const imageUrl = getImageUrl(image || metaImage)
            return imageUrl && imageUrl !== '/noimg.svg' ? (
              <div className="w-28 h-28 sm:w-32 sm:h-32 lg:w-36 lg:h-36 xl:w-40 xl:h-40 flex-shrink-0 relative overflow-hidden rounded-l-3xl">
                <Image
                  src={imageUrl}
                  alt={(image as Media)?.alt || (metaImage as Media)?.alt || 'Product image'}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 128px, (max-width: 1024px) 144px, 160px"
                />
              </div>
            ) : null
          })()}

        <div className="flex-1 p-3 sm:p-4 lg:p-6 flex flex-col justify-between min-h-0">
          <div className="flex items-start justify-between mb-2 sm:mb-3">
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
            <div className="flex items-center gap-2">
              {specPdf && typeof specPdf === 'object' && 'url' in specPdf && specPdf.url && (
                <Link
                  href={(specPdf as any).url as string}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#9BC273]/10 to-[#9BC273]/5 rounded-2xl flex items-center justify-center transition-all duration-300 hover:from-[#9BC273]/20 hover:to-[#9BC273]/10 hover:scale-110"
                  aria-label="Open product PDF"
                >
                  <FileCheck2 className="w-5 h-5 sm:w-6 sm:h-6 text-[#9BC273]" />
                </Link>
              )}
              <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#9BC273]/10 to-[#9BC273]/5 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:from-[#9BC273]/20 group-hover:to-[#9BC273]/10 group-hover:scale-110">
                <Package className="w-5 h-5 sm:w-6 sm:h-6 text-[#9BC273]" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {description && (
              <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed flex items-center gap-2">
                <Package className="w-4 h-4 text-[#9BC273]" />
                <span>{description}</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
