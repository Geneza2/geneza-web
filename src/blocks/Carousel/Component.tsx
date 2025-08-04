'use client'
import { cn } from '@/utilities/ui'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/scss/parallax'
import { Autoplay, Pagination, Parallax } from 'swiper/modules'
import Link from 'next/link'
import Image from 'next/image'

type Slide = {
  image?: {
    url?: string
  }
  title: string
  description?: string
  callToAction?: {
    text: string
    link: string
    openInNewTab?: boolean
  }
}

type Props = {
  className?: string
  slides: Slide[]
}

export const CarouselBlock: React.FC<Props> = ({ className, slides }) => {
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
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-screen h-[100vh]">
              {slide.image?.url && (
                <>
                  <Image
                    src={slide.image.url}
                    alt={slide.title}
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
                    <Link
                      href={slide.callToAction.link}
                      target={slide.callToAction.openInNewTab ? '_blank' : '_self'}
                      rel={slide.callToAction.openInNewTab ? 'noopener noreferrer' : undefined}
                      className="block md:inline-block text-gray-900 rounded bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium text-center text-sm px-5 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                      data-swiper-parallax-opacity="0"
                      data-swiper-parallax="-100"
                    >
                      {slide.callToAction.text}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
