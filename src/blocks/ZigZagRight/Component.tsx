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

export const ZigZagRightBlock: React.FC<Props> = ({ className, background, content }) => {
  const { image, title, description, callToAction } = content

  return (
    <section
      className={cn('w-full transition-all duration-300 ease-in-out', className)}
      style={{
        background: background?.url ? `url(${background.url}) center / cover no-repeat` : '#fff',
      }}
    >
      <div className="container py-16">
        <Card className="border-0 bg-transparent shadow-none">
          <CardContent className="p-0 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-stretch">
            <div className="space-y-4 md:space-y-6 px-4 md:px-0 order-2 md:order-1 flex flex-col justify-center h-full">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white transition-colors duration-300 ease-in-out">
                {title}
              </h2>
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
                <div className="relative w-full h-full min-h-[300px] md:min-h-[400px] transition-transform duration-300 ease-in-out hover:scale-105">
                  <Image
                    src={image.url}
                    alt={image.alt || title}
                    fill
                    className="rounded-xl shadow-md object-cover transition-shadow duration-300 ease-in-out hover:shadow-lg"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
