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
  certifications: Certification[]
  className?: string
}

export const Certifications: React.FC<Props> = ({ heading, certifications, className }) => {
  return (
    <section className={cn('relative w-full bg-white py-10 sm:py-16 md:py-20', className)}>
      <div className="container px-4 sm:px-6 md:px-8">
        <h2 className="text-center text-2xl md:text-3xl lg:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80 mb-12">
          {heading}
        </h2>

        <div className="flex flex-wrap justify-center gap-8 md:gap-12 lg:gap-16">
          {certifications.map(({ image, pdfFile, title }, index) => {
            const content = (
              <div className="group relative flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 transition-transform duration-300 hover:scale-105 cursor-pointer">
                {image?.url && (
                  <Image
                    src={image.url}
                    alt={title || 'Certification'}
                    fill
                    className="object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                )}
              </div>
            )

            return pdfFile?.url ? (
              <Button
                key={index}
                variant="ghost"
                size="clear"
                className="p-0 h-auto w-auto hover:bg-transparent focus:bg-transparent active:bg-transparent"
                onClick={() => window.open(pdfFile.url, '_blank')}
              >
                {content}
              </Button>
            ) : (
              <div key={index}>{content}</div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
