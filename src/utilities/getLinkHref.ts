import { TypedLocale } from 'payload'

const collectionPathMap: Record<string, string> = {
  pages: '',
  posts: 'posts',
  products: 'products',
  openPositions: 'open-positions',
  goods: 'goods',
  categories: 'categories',
}

type LinkData = {
  type?: 'reference' | 'custom' | null
  url?: string | null
  label?: string | null
  anchor?: string | null
  reference?: {
    relationTo?: string
    value?: { slug?: string | null } | number
  } | null
}

export const getLinkHref = (item: { link: LinkData } | LinkData, locale?: TypedLocale): string => {
  const link = 'link' in item ? item.link : item

  if (!link) {
    return locale ? `/${locale}` : '/'
  }

  // If link exists but has no type or invalid data, return home page
  if (
    !link.type ||
    (link.type === 'reference' && !link.reference) ||
    (link.type === 'custom' && !link.url)
  ) {
    return locale ? `/${locale}` : '/'
  }

  // Handle custom URLs
  if (link.type === 'custom' && link.url) {
    const url = link.url
    const fullUrl = locale ? `/${locale}${url.startsWith('/') ? url : `/${url}`}` : url
    return link.anchor ? `${fullUrl}#${link.anchor}` : fullUrl
  }

  // Handle reference links
  if (link.type === 'reference' && link.reference) {
    const { relationTo, value } = link.reference
    
    // Handle populated objects (with depth=2, references should be populated)
    const slug = typeof value === 'object' && value && 'slug' in value ? value.slug || '' : ''

    // If no relationTo, return home page
    if (!relationTo) {
      return locale ? `/${locale}` : '/'
    }

    // Special handling for goods
    if (relationTo === 'goods') {
      const baseUrl = locale ? `/${locale}/goods` : '/goods'
      const url = slug ? `${baseUrl}?category=${slug}` : baseUrl
      return link.anchor ? `${url}#${link.anchor}` : url
    }

    // Handle products and open-positions (no individual slugs)
    if (relationTo === 'products' || relationTo === 'openPositions') {
      const collectionPath = collectionPathMap[relationTo] || relationTo
      const url = locale ? `/${locale}/${collectionPath}` : `/${collectionPath}`
      return link.anchor ? `${url}#${link.anchor}` : url
    }

    // Handle other collections with slug-based routing
    if (relationTo !== 'pages') {
      const collectionPath = collectionPathMap[relationTo] || relationTo
      const url = locale ? `/${locale}/${collectionPath}/${slug}` : `/${collectionPath}/${slug}`
      return link.anchor ? `${url}#${link.anchor}` : url
    }

    // Handle pages (just use slug directly)
    if (relationTo === 'pages') {
      const url = locale ? `/${locale}/${slug}` : `/${slug}`
      return link.anchor ? `${url}#${link.anchor}` : url
    }
  }

  // Fallback to home page
  const url = locale ? `/${locale}` : '/'
  return link.anchor ? `${url}#${link.anchor}` : url
}
