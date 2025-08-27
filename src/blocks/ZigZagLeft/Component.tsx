'use client'

import { cn } from '@/utilities/ui'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'
import Link from 'next/link'

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
  content: {
    image: Media
    title: string
    description?: string
    callToAction?: {
      text: string
      link: string
      openInNewTab?: boolean
    }
  }
}

export const ZigZagLeftBlock: React.FC<Props> = ({ className, background, sectionId, content }) => {
  const { image, title, description, callToAction } = content

  return (
    <section id={sectionId} className={cn('w-full relative bg-white', className)}>
      <div className="container py-20 lg:py-28">
        <Card className="border-0 bg-transparent shadow-none">
          <CardContent className="p-0 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="flex justify-center order-1 h-full">
              {image?.url && (
                <div className="relative w-full max-w-2xl aspect-[4/3] group">
                  <div className="w-full h-full">
                    <Image
                      src="/bg-bubble.svg"
                      alt=""
                      width={540}
                      height={535}
                      className="w-full h-full"
                    />
                  </div>
                  <div className="absolute top-6 left-6 right-6 bottom-6 md:top-12 md:left-12 md:right-12 md:bottom-12">
                    <Image
                      src={image.url}
                      alt={image.alt || title}
                      fill
                      className="rounded-2xl shadow-lg object-cover transition-all duration-500 ease-out hover:scale-110 hover:shadow-2xl hover:rotate-1"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6 lg:space-y-8 px-4 lg:px-0 order-2 flex flex-col justify-center h-full">
              <div className="space-y-4">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                  {title}
                </h2>
                <div className="w-16 h-1 bg-[#9BC273] rounded-full"></div>
              </div>
              {description && (
                <p className="text-lg text-gray-600 leading-relaxed max-w-lg">{description}</p>
              )}
              {callToAction?.text && callToAction.link && (
                <div className="pt-4">
                  <Button
                    asChild
                    size="lg"
                    className="bg-[#9BC273] hover:bg-[#8BAF66] text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg shadow-md"
                  >
                    <Link
                      href={callToAction.link}
                      target={callToAction.openInNewTab ? '_blank' : '_self'}
                      rel={callToAction.openInNewTab ? 'noopener noreferrer' : undefined}
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
    </section>
  )
}
