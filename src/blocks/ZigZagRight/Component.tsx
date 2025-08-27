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

export const ZigZagRightBlock: React.FC<Props> = ({
  className,
  background,
  sectionId,
  content,
}) => {
  const { image, title, description, callToAction } = content

  return (
    <section
      id={sectionId}
      className={cn('w-full transition-all duration-300 ease-in-out', className)}
      style={{
        background: background?.url ? `url(${background.url}) center / cover no-repeat` : '#fff',
      }}
    >
      <div className="container py-16">
        <Card className="border-0 bg-transparent shadow-none">
          <CardContent className="p-0 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-stretch">
            <div className="space-y-4 md:space-y-6 px-4 md:px-0 order-2 md:order-1 flex flex-col justify-center h-full">
              <div className="space-y-4">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 transition-colors duration-300 ease-in-out">
                  {title}
                </h2>
                <div className="w-16 h-1 bg-[#9BC273] rounded-full"></div>
              </div>
              {description && (
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed transition-colors duration-300 ease-in-out">
                  {description}
                </p>
              )}
              {callToAction?.text && callToAction.link && (
                <div className="pt-2">
                  <Button
                    asChild
                    className="transition-all duration-300 ease-in-out hover:scale-105"
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

            <div className="flex justify-center order-1 md:order-2 h-full">
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
                      className="rounded-2xl shadow-lg object-cover transition-all duration-500 ease-out hover:scale-110 hover:shadow-2xl hover:-rotate-1"
                    />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
