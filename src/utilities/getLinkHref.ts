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

  // Special handling for goods link - always point to main goods page with category parameter
  if (
    link?.label === 'Goods' ||
    (link?.type === 'reference' && link?.reference?.relationTo === 'goods')
  ) {
    const baseUrl = locale ? `/${locale}/goods` : '/goods'

    // If it's a specific goods reference, add the category parameter
    if (link?.type === 'reference' && link?.reference?.relationTo === 'goods') {
      const refValue = link.reference.value
      if (refValue && typeof refValue === 'object' && 'slug' in refValue && refValue.slug) {
        const url = `${baseUrl}?category=${refValue.slug}`
        return link?.anchor ? `${url}#${link.anchor}` : url
      }
    }

    const url = baseUrl
    return link?.anchor ? `${url}#${link.anchor}` : url
  }

  if (link?.type === 'custom' && link?.url) {
    const url = link.url as string
    const fullUrl = locale ? `/${locale}${url.startsWith('/') ? url : `/${url}`}` : url
    return link?.anchor ? `${fullUrl}#${link.anchor}` : fullUrl
  }

  const reference = link?.reference as
    | { relationTo?: string; value?: { slug?: string | null } }
    | undefined
  const relationTo = reference?.relationTo
  const ref = reference?.value
  const slug = typeof ref === 'object' && ref && 'slug' in ref ? ref.slug : ''

  if (!slug) {
    const url = locale ? `/${locale}` : '/'
    return link?.anchor ? `${url}#${link.anchor}` : url
  }

  // For goods, always use category parameter approach
  if (relationTo === 'goods') {
    const baseUrl = locale ? `/${locale}/goods` : '/goods'
    const url = `${baseUrl}?category=${slug}`
    return link?.anchor ? `${url}#${link.anchor}` : url
  }

  // For products and open-positions, use simple page routes without individual slugs
  if (relationTo === 'products' || relationTo === 'openPositions') {
    const collectionPath = collectionPathMap[relationTo] || relationTo
    const url = locale ? `/${locale}/${collectionPath}` : `/${collectionPath}`
    return link?.anchor ? `${url}#${link.anchor}` : url
  }

  // For other collections, use standard slug-based routing
  if (relationTo && relationTo !== 'pages') {
    const collectionPath = collectionPathMap[relationTo] || relationTo
    const url = locale ? `/${locale}/${collectionPath}/${slug}` : `/${collectionPath}/${slug}`
    return link?.anchor ? `${url}#${link.anchor}` : url
  }

  // For pages, just use the slug directly
  const url = locale ? `/${locale}/${slug}` : `/${slug}`
  return link?.anchor ? `${url}#${link.anchor}` : url
}
