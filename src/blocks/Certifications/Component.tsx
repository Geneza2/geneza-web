'use client'

import React from 'react'
import Image from 'next/image'
import { cn } from '@/utilities/ui'
import { Button } from '@/components/ui/button'

type Certification = {
  image?: { url: string }
  pdfFile?: { url: string }
  title?: string
}

type Props = {
  heading: string
  description?: string
  certifications: Certification[]
  className?: string
}

export const Certifications: React.FC<Props> = ({
  heading,
  description,
  certifications,
  className,
}) => {
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
          {certifications.map((certification, index) => (
            <div
              key={index}
              className="group relative flex items-center justify-center p-6 transition-all duration-300 hover:scale-105"
            >
              {certification.pdfFile?.url ? (
                <Button
                  variant="ghost"
                  className="p-0 h-auto hover:bg-transparent"
                  onClick={() => window.open(certification.pdfFile?.url!, '_blank')}
                >
                  {certification.image?.url && (
                    <div className="relative w-32 h-16 md:w-40 md:h-20 lg:w-48 lg:h-24">
                      <Image
                        src={certification.image.url}
                        alt={certification.title || 'Certification'}
                        fill
                        className="object-contain transition-all duration-300"
                      />
                    </div>
                  )}
                </Button>
              ) : (
                certification.image?.url && (
                  <div className="relative w-32 h-16 md:w-40 md:h-20 lg:w-48 lg:h-24">
                    <Image
                      src={certification.image.url}
                      alt={certification.title || 'Certification'}
                      fill
                      className="object-contain transition-all duration-300"
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
