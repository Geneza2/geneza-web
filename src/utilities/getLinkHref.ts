import { TypedLocale } from 'payload'

export const getLinkHref = (
  item: { link: Record<string, unknown> },
  locale?: TypedLocale,
): string => {
  const link = item.link

  // Handle custom URL type
  if (link?.type === 'custom' && link?.url) {
    return link.url as string
  }

  // Handle reference type
  const reference = link?.reference as { value?: { slug?: string | null } } | undefined
  const ref = reference?.value
  const slug = typeof ref === 'object' && ref && 'slug' in ref ? ref.slug : ''

  if (!slug) return locale ? `/${locale}` : '/'

  return locale ? `/${locale}/${slug}` : `/${slug}`
}
