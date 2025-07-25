import type { Media } from '@/payload-types'

export const getImageUrl = (
  img: number | Media | null | undefined,
  fallback = '/noimg.svg',
): string => {
  return typeof img === 'object' && img?.url ? img.url : fallback
}
