'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/utilities/ui'
import { TypedLocale } from 'payload'

type Partner = {
  image?: { url: string }
  link?: { url: string }
  title?: string
}

type Props = {
  heading: string
  description?: string
  cards: Partner[]
  className?: string
  locale?: TypedLocale | null
}

export const InfiniteCards: React.FC<Props> = ({
  heading,
  description,
  cards,
  className,
  locale,
}) => {
  // Get the appropriate text based on locale
  const getTitleText = () => {
    switch (locale) {
      case 'rs':
        return 'Poverenje vodećih kompanija'
      case 'en':
      default:
        return 'Trusted by Industry Leaders'
    }
  }

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          {/* Title lines */}
          <div className="flex items-center justify-center mb-4">
            <div className="w-8 h-0.5 bg-[#9BC273] mr-3"></div>
            <span className="text-xs font-medium text-[#9BC273] uppercase tracking-wider">
              {getTitleText()}
            </span>
            <div className="w-8 h-0.5 bg-[#9BC273] ml-3"></div>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-900 mb-4">
            {heading}
          </h2>
          {description && <p className="text-lg text-gray-600 max-w-2xl mx-auto">{description}</p>}
        </div>

        <div className="flex flex-col items-center justify-center space-y-6 sm:flex-row sm:flex-wrap sm:justify-center sm:space-y-0 sm:gap-1 md:gap-2">
          {cards.slice(0, 5).map((partner, index) => (
            <div
              key={index}
              className={cn(
                'group relative flex items-center justify-center p-4 transition-all duration-300 hover:scale-105',
                'max-w-xs w-auto text-center mx-auto sm:w-auto',
              )}
            >
              {partner.link?.url ? (
                <Link
                  href={partner.link.url}
                  className="block w-full h-full"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {partner.image?.url && (
                    <div className="relative w-32 h-20 md:w-40 md:h-24 lg:w-48 lg:h-28 mx-auto">
                      <Image
                        src={partner.image.url}
                        alt={partner.title || 'Partner logo'}
                        fill
                        className="object-contain filter grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100"
                      />
                    </div>
                  )}
                </Link>
              ) : (
                partner.image?.url && (
                  <div className="relative w-32 h-20 md:w-40 md:h-24 lg:w-48 lg:h-28 mx-auto">
                    <Image
                      src={partner.image.url}
                      alt={partner.title || 'Partner logo'}
                      fill
                      className="object-contain filter grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100"
                    />
                  </div>
                )
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
