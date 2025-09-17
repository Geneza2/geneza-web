import React from 'react'
import Image from 'next/image'

type ImageBannerProps = {
  image: {
    url: string
    alt?: string
  }
  height?: 'small' | 'medium' | 'large' | 'full'
  overlay?: boolean
  overlayOpacity?: number
}

const HEIGHT_CLASSES = {
  small: 'h-64',
  medium: 'h-96',
  large: 'h-[500px]',
  full: 'h-screen',
} as const

export const ImageBannerBlock: React.FC<ImageBannerProps> = ({
  image,
  height = 'medium',
  overlay = false,
  overlayOpacity = 0.3,
}) => {
  if (!image?.url) {
    return null
  }

  return (
    <section className={`relative w-full ${HEIGHT_CLASSES[height]} overflow-hidden`}>
      <Image
        src={image.url}
        alt={image.alt || 'Banner image'}
        fill
        className="object-cover"
        priority
        sizes="100vw"
        quality={90}
      />
      {overlay && (
        <div
          className="absolute inset-0 bg-black transition-opacity duration-300"
          style={{ opacity: overlayOpacity }}
          aria-hidden="true"
        />
      )}
    </section>
  )
}
