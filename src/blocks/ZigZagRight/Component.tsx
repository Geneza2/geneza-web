'use client'

import { cn } from '@/utilities/ui'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import Image from 'next/image'
import { getLinkHref } from '@/utilities/getLinkHref'
import { TypedLocale } from 'payload'
import { useEffect, useRef, useState } from 'react'

type Media = {
  url?: string
  alt?: string
  width?: number
  height?: number
}

type Props = {
  className?: string
  background?: Media
  sectionId?: string
  locale?: TypedLocale | null
  content: {
    image: Media
    title: string
    description?: string
    callToAction?: {
      text: string
      linkType?: 'reference' | 'custom' | null
      url?: string | null
      anchor?: string | null
      newTab?: boolean
      reference?: {
        relationTo?: string
        value?: { slug?: string | null } | number
      } | null
    }
  }
}

export const ZigZagRightBlock: React.FC<Props> = ({
  className,
  background,
  sectionId,
  locale,
  content,
}) => {
  const { image, title, description, callToAction } = content
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  const backgroundImage = image?.url || background?.url

  useEffect(() => {
    const currentSection = sectionRef.current
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry?.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    if (currentSection) {
      observer.observe(currentSection)
    }

    return () => {
      if (currentSection) {
        observer.unobserve(currentSection)
      }
    }
  }, [])

  return (
    <>
      <section
        ref={sectionRef}
        id={sectionId}
        className={cn('w-full relative min-h-[70vh] bg-cover bg-center bg-no-repeat', className)}
        style={{ position: 'relative' }}
        aria-label={title}
      >
        {backgroundImage && (
          <Image
            src={backgroundImage}
            alt={image?.alt || background?.alt || ''}
            fill
            className="object-cover object-center"
            sizes="100vw"
            priority={false}
            quality={85}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-l from-black/20 via-black/10 to-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/15"></div>

        <div className="relative z-10 container py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[50vh]">
            <div className="order-1 lg:order-1"></div>

            <div
              className={cn(
                'order-2 lg:order-2 transition-all duration-1000',
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10',
              )}
            >
              <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
                <CardContent className="p-8 lg:p-12">
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight drop-shadow-lg">
                        {title}
                      </h2>
                      <div className="w-16 h-1 bg-[#9BC273] rounded-full shadow-lg"></div>
                    </div>
                    {description && (
                      <p className="text-lg text-white/90 leading-relaxed drop-shadow-md">
                        {description}
                      </p>
                    )}
                    {callToAction?.text && (
                      <div className="pt-4">
                        <Button
                          asChild
                          size="lg"
                          className="bg-[#9BC273] hover:bg-[#8BAF66] text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300 ease-out hover:scale-105 hover:shadow-2xl shadow-lg backdrop-blur-sm"
                          aria-label={callToAction.text}
                        >
                          <Link
                            href={
                              callToAction.linkType === 'custom' && callToAction.url
                                ? callToAction.url
                                : callToAction.linkType === 'reference' && callToAction.reference
                                  ? getLinkHref(
                                      {
                                        link: {
                                          type: 'reference',
                                          reference: {
                                            relationTo: callToAction.reference.relationTo,
                                            value: callToAction.reference.value,
                                          },
                                          anchor: callToAction.anchor,
                                        },
                                      },
                                      locale || 'en',
                                    )
                                  : '#'
                            }
                            target={callToAction.newTab ? '_blank' : '_self'}
                            rel={callToAction.newTab ? 'noopener noreferrer' : undefined}
                            aria-label={callToAction.text}
                          >
                            {callToAction.text}
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {!backgroundImage && <div className="absolute inset-0 bg-[#D9D9D9] -z-10"></div>}
      </section>
      <div className="h-2 w-full bg-[#F5F5F5]"></div>
    </>
  )
}
