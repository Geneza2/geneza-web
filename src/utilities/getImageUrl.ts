import type { Media } from '@/payload-types'

export const getImageUrl = (
  img: number | Media | null | undefined,
  fallback = '/noimg.svg',
): string => {
  if (img && typeof img === 'object' && 'url' in img && typeof img.url === 'string') {
    return img.url
  }

  return fallback
}
