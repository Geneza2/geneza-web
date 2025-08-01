import { TypedLocale } from 'payload'

const collectionPathMap: Record<string, string> = {
  pages: '',
  posts: 'posts',
  products: 'products',
  openPositions: 'open-positions',
  goods: 'goods',
  categories: 'categories',
}

export const getLinkHref = (item: { link: Record<string, any> }, locale?: TypedLocale): string => {
  const link = item.link

  // Special handling for goods link - always point to main goods page
  if (
    link?.label === 'Goods' ||
    (link?.type === 'reference' && link?.reference?.relationTo === 'goods')
  ) {
    const baseUrl = locale ? `/${locale}/goods` : '/goods'

    // If it's a specific goods reference, add the category parameter
    if (link?.type === 'reference' && link?.reference?.relationTo === 'goods') {
      const refValue = link.reference.value
      if (typeof refValue === 'object' && refValue && 'slug' in refValue && refValue.slug) {
        return `${baseUrl}?category=${refValue.slug}`
      }
    }

    return baseUrl
  }

  if (link?.type === 'custom' && link?.url) {
    const url = link.url as string
    return locale ? `/${locale}${url.startsWith('/') ? url : `/${url}`}` : url
  }

  const reference = link?.reference as
    | { relationTo?: string; value?: { slug?: string | null } }
    | undefined
  const relationTo = reference?.relationTo
  const ref = reference?.value
  const slug = typeof ref === 'object' && ref && 'slug' in ref ? ref.slug : ''

  if (!slug) return locale ? `/${locale}` : '/'

  if (relationTo && relationTo !== 'pages') {
    const collectionPath = collectionPathMap[relationTo] || relationTo
    return locale ? `/${locale}/${collectionPath}/${slug}` : `/${collectionPath}/${slug}`
  }

  // For pages, just use the slug directly
  return locale ? `/${locale}/${slug}` : `/${slug}`
}
