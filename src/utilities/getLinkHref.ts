import { TypedLocale } from 'payload'

const collectionPathMap: Record<string, string> = {
  pages: '',
  posts: 'posts',
  products: 'products',
  openPositions: 'open-positions',
  categories: 'categories',
}

export const getLinkHref = (item: { link: Record<string, any> }, locale?: TypedLocale): string => {
  const link = item.link

  if (link?.type === 'custom' && link?.url) {
    return link.url as string
  }

  const reference = link?.reference as
    | { relationTo?: string; value?: { slug?: string | null } }
    | undefined
  const relationTo = reference?.relationTo

  if (relationTo && relationTo !== 'pages') {
    const collectionPath = collectionPathMap[relationTo] || relationTo
    return locale ? `/${locale}/${collectionPath}` : `/${collectionPath}`
  }

  const ref = reference?.value
  const slug = typeof ref === 'object' && ref && 'slug' in ref ? ref.slug : ''
  if (!slug) return locale ? `/${locale}` : '/'
  return locale ? `/${locale}/${slug}` : `/${slug}`
}
