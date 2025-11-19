import { getClientSideURL } from '@/utilities/getURL'

/**
 * Processes media resource URL to ensure proper formatting
 * @param url The original URL from the resource
 * @param cacheTag Optional cache tag to append to the URL
 * @returns Properly formatted URL with cache tag if provided
 */
export const getMediaUrl = (url: string | null | undefined, cacheTag?: string | null): string => {
  if (!url) return ''

  // Clean up the URL first
  const cleanUrl = url.trim()

  // Handle Vercel Blob Storage URLs - return as is
  //if (cleanUrl.includes('vercel-storage.com')) {
  // return cacheTag ? `${cleanUrl}?${cacheTag}` : cleanUrl
  // }

  // Handle Cloudflare R2 URLs - return as is
  if (cleanUrl.includes('r2.cloudflarestorage.com') || cleanUrl.includes('.pub.r2.dev')) {
    return cacheTag ? `${cleanUrl}?${cacheTag}` : cleanUrl
  }

  // Check if URL already has http/https protocol
  if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) {
    return cacheTag ? `${cleanUrl}?${cacheTag}` : cleanUrl
  }

  // For relative URLs, prepend client-side URL
  const baseUrl = getClientSideURL()
  return cacheTag ? `${baseUrl}${cleanUrl}?${cacheTag}` : `${baseUrl}${cleanUrl}`
}
