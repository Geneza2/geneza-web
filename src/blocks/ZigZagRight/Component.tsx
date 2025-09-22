'use client'

import { cn } from '@/utilities/ui'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { getLinkHref } from '@/utilities/getLinkHref'
import { TypedLocale } from 'payload'

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

  // Use the image as background, fallback to a default gradient
  const backgroundImage = image?.url || background?.url
  const backgroundStyle = backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : {}

  return (
    <section
      id={sectionId}
      className={cn('w-full relative min-h-[70vh] bg-cover bg-center bg-no-repeat', className)}
      style={backgroundStyle}
    >
      {/* Background overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-l from-black/60 via-black/40 to-black/60"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50"></div>

      <div className="relative z-10 container py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[50vh]">
          {/* Left side - Empty space for balance */}
          <div className="order-1 lg:order-1"></div>

          {/* Right side - Blur container with content */}
          <div className="order-2 lg:order-2">
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

      {/* Fallback background if no image */}
      {!backgroundImage && <div className="absolute inset-0 bg-[#D9D9D9] -z-10"></div>}
    </section>
  )
}
