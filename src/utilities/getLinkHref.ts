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
  const anchor = link?.anchor ? `#${link.anchor}` : ''

  // Helper to safely join paths
  const withLocale = (path: string) => (locale ? `/${locale}${path}` : path)

  // 1. Handle Goods special case
  if (
    link?.label === 'Goods' ||
    (link?.type === 'reference' && link?.reference?.relationTo === 'goods')
  ) {
    const base = withLocale('/goods')

    const ref = link?.reference?.value
    const slug = ref && typeof ref === 'object' && 'slug' in ref ? ref.slug : null

    if (slug) {
      return `${base}?category=${slug}${anchor}`
    }

    return `${base}${anchor}`
  }

  // 2. Custom URL
  if (link?.type === 'custom' && link?.url) {
    const url = link.url as string
    const fullPath = url.startsWith('/') ? url : `/${url}`
    return `${withLocale(fullPath)}${anchor}`
  }

  // 3. Reference-based routing
  const reference = link?.reference as {
    relationTo?: string
    value?: { slug?: string | null }
  }

  const relationTo = reference?.relationTo
  const slug = reference?.value?.slug

  if (!slug) {
    // Fallback to homepage if no slug
    return `${withLocale('')}${anchor}`
  }

  // 4. Goods reference (should’ve already been caught, but double-safe)
  if (relationTo === 'goods') {
    return `${withLocale('/goods')}?category=${slug}${anchor}`
  }

  // 5. Non-detailed collections (no slug in URL)
  if (relationTo === 'products' || relationTo === 'openPositions') {
    const path = collectionPathMap[relationTo] || relationTo
    return `${withLocale(`/${path}`)}${anchor}`
  }

  // 6. Slug-based collection routes
  if (relationTo && relationTo !== 'pages') {
    const path = collectionPathMap[relationTo] || relationTo
    return `${withLocale(`/${path}/${slug}`)}${anchor}`
  }

  // 7. Default: regular pages
  return `${withLocale(`/${slug}`)}${anchor}`
}
