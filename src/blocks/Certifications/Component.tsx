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
  className: _className,
}) => {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-900 mb-4 flex items-center justify-center">
            <div className="w-8 h-0.5 bg-[#9BC273] mr-3"></div>
            {heading}
            <div className="w-8 h-0.5 bg-[#9BC273] ml-3"></div>
          </h2>
          {description && <p className="text-lg text-gray-600 max-w-2xl mx-auto">{description}</p>}
        </div>

        <div className="flex flex-col items-center space-y-8 sm:flex-row sm:flex-wrap sm:justify-center sm:space-y-0 sm:gap-8">
          {certifications.map((certification, index) => (
            <div
              key={index}
              className={cn(
                'group relative flex items-center justify-center p-4 transition-all duration-300 hover:scale-105',
                'w-full max-w-xs sm:w-auto',
              )}
            >
              {certification.pdfFile?.url ? (
                <Button
                  variant="ghost"
                  className="p-0 h-auto hover:bg-transparent"
                  onClick={() =>
                    certification.pdfFile?.url && window.open(certification.pdfFile.url, '_blank')
                  }
                >
                  {certification.image?.url && (
                    <div className="relative w-32 h-20 md:w-40 md:h-24 lg:w-48 lg:h-28">
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
                  <div className="relative w-32 h-20 md:w-40 md:h-24 lg:w-48 lg:h-28">
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
