'use client'

import Image from 'next/image'
import { useState } from 'react'

interface SafeImageProps {
  src: string
  alt: string
  fill?: boolean
  width?: number
  height?: number
  className?: string
  sizes?: string
  priority?: boolean
  quality?: number
  onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  fill = false,
  width,
  height,
  className,
  sizes,
  priority = false,
  quality = 75,
  onError,
}) => {
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setHasError(true)
    setIsLoading(false)
    if (onError) {
      onError(e)
    }
  }

  const handleLoad = () => {
    setIsLoading(false)
  }

  // Don't render if there's an error or no valid src
  if (hasError || !src || src === '/noimg.svg') {
    return null
  }

  const imageProps = {
    src,
    alt,
    className,
    sizes,
    priority,
    quality,
    onError: handleError,
    onLoad: handleLoad,
    ...(fill ? { fill: true } : { width, height }),
  }

  return (
    <div className="relative">
      {isLoading && <div className="absolute inset-0 bg-gray-200 animate-pulse rounded" />}
      <Image {...imageProps} alt={alt} />
    </div>
  )
}
