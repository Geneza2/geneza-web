import type { Media } from '@/payload-types'

export const getImageUrl = (
  img: number | Media | null | undefined,
  fallback = '/noimg.svg',
): string => {
  try {
    // Handle number ID - return fallback for now
    if (typeof img === 'number') {
      return fallback
    }

    // Handle Media object with url property
    if (img && typeof img === 'object' && 'url' in img && typeof img.url === 'string' && img.url) {
      return img.url
    }

    // Handle Media object with sizes property (for responsive images)
    if (img && typeof img === 'object' && 'sizes' in img && img.sizes) {
      const sizes = img.sizes as Record<string, { url?: string }>

      // Try to get the URL from various size options in order of preference
      const sizeKeys = ['medium', 'large', 'small', 'thumbnail', 'xlarge', 'og']

      for (const key of sizeKeys) {
        if (sizes[key]?.url && typeof sizes[key].url === 'string') {
          return sizes[key].url
        }
      }
    }

    return fallback
  } catch (error) {
    console.error('Error in getImageUrl:', error)
    return fallback
  }
}
