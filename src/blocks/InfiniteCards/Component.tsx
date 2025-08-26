'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/utilities/ui'

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
}

export const InfiniteCards: React.FC<Props> = ({ heading, description, cards, className }) => {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-900 mb-4">
            {heading}
          </h2>
          {description && <p className="text-lg text-gray-600 max-w-2xl mx-auto">{description}</p>}
        </div>

        <div
          className={cn(
            'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 lg:gap-12 items-center justify-items-center',
            className,
          )}
        >
          {cards.map((partner, index) => (
            <div
              key={index}
              className="group relative flex items-center justify-center p-6 transition-all duration-300 hover:scale-105"
            >
              {partner.link?.url ? (
                <Link
                  href={partner.link.url}
                  className="block w-full h-full"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {partner.image?.url && (
                    <div className="relative w-32 h-16 md:w-40 md:h-20 lg:w-48 lg:h-24">
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
                  <div className="relative w-32 h-16 md:w-40 md:h-20 lg:w-48 lg:h-24">
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
