import type { Media } from '@/payload-types'

export const getImageUrl = (
  img: number | Media | null | undefined,
  fallback = '/noimg.svg',
): string => {
  // Handle number ID - return empty string, let PayloadCMS handle it
  if (typeof img === 'number') {
    return fallback
  }

  // Handle Media object with url property
  if (img && typeof img === 'object' && 'url' in img && typeof img.url === 'string') {
    return img.url
  }

  // Handle Media object with sizes property (for responsive images)
  if (img && typeof img === 'object' && 'sizes' in img) {
    const sizes = img.sizes as Record<string, { url?: string }>

    // Try to get the URL from various size options in order of preference
    const sizeKeys = ['medium', 'large', 'small', 'thumbnail', 'xlarge', 'og']

    for (const key of sizeKeys) {
      if (sizes[key]?.url) {
        return sizes[key].url
      }
    }
  }

  return fallback
}
