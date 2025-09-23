'use client'
import { cn } from '@/utilities/ui'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/scss/parallax'
import { Autoplay, Pagination, Parallax } from 'swiper/modules'
import Link from 'next/link'
import Image from 'next/image'
import { getLinkHref } from '@/utilities/getLinkHref'
import { getImageUrl } from '@/utilities/getImageUrl'
import { TypedLocale } from 'payload'
import type { Media } from '@/payload-types' // Import Media type

type Slide = {
  image?: Media | null // Use Media type for image
  title: string
  description?: string
  callToAction?: {
    text: string
    link: {
      type?: 'reference' | 'custom' | null
      url?: string | null
      label?: string | null
      anchor?: string | null
      reference?: {
        relationTo?: string
        value?: { slug?: string | null } | number
      } | null
    }
    openInNewTab?: boolean
  }
}

type Props = {
  className?: string
  slides: Slide[]
  locale?: TypedLocale
}

export const CarouselBlock: React.FC<Props> = ({ className, slides, locale = 'en' }) => {
  return (
    <div className={cn('mx-auto w-full carousel-block', className)}>
      <Swiper
        modules={[Autoplay, Pagination, Parallax]}
        slidesPerView={1}
        pagination={{ clickable: true }}
        parallax={true}
        speed={1200}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        loop
        className="w-full h-[100vh]"
      >
        {slides.map((slide, index) => {
          const imageUrl = getImageUrl(slide.image)
          const imageAlt = slide.image?.alt || slide.title

          return (
            <SwiperSlide key={index}>
              <div className="relative w-screen h-[100vh]">
                {imageUrl && imageUrl !== '/noimg.svg' && (
                  <>
                    <Image
                      src={imageUrl}
                      alt={imageAlt}
                      fill
                      loading="eager"
                      className="absolute inset-0 object-cover"
                    />
                    <div className="absolute bg-black/20 w-full h-full z-5"></div>
                  </>
                )}

                <div className="absolute bottom-28 inset-x-0 flex justify-center md:block md:left-28 md:inset-x-auto p-8">
                  <div
                    className="max-w-3xl text-white opacity-0"
                    data-swiper-parallax-opacity="0"
                    data-swiper-parallax="-100"
                  >
                    <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-center md:text-left font-bold text-white pb-4">
                      {slide.title}
                    </h3>
                    {slide.description && (
                      <p
                        className="text-base sm:text-lg md:text-xl pb-6 text-center md:text-left text-white"
                        data-swiper-parallax-opacity="0"
                        data-swiper-parallax="-50"
                      >
                        {slide.description}
                      </p>
                    )}
                    {slide.callToAction?.text && slide.callToAction.link && (
                      <div className="flex justify-center md:justify-start">
                        <Link
                          href={getLinkHref({ link: slide.callToAction.link }, locale)}
                          target={slide.callToAction.openInNewTab ? '_blank' : '_self'}
                          rel={slide.callToAction.openInNewTab ? 'noopener noreferrer' : undefined}
                          className="inline-flex items-center justify-center px-8 py-3 text-base font-semibold text-white bg-[#9BC273] rounded-lg shadow-lg transition-all duration-300 hover:bg-[#8ab065] hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#9BC273]/50 active:scale-95"
                          data-swiper-parallax-opacity="0"
                          data-swiper-parallax="-100"
                        >
                          {slide.callToAction.text}
                          <svg
                            className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 8l4 4m0 0l-4 4m4-4H3"
                            />
                          </svg>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          )
        })}
      </Swiper>
    </div>
  )
}
