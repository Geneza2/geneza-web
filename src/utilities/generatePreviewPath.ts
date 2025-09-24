import { PayloadRequest, CollectionSlug } from 'payload'

const collectionPrefixMap: Partial<Record<CollectionSlug, string>> = {
  posts: '/posts',
  pages: '',
  openPositions: '/open-positions',
  products: '/products',
  goods: '/goods',
}

type Props = {
  collection: keyof typeof collectionPrefixMap
  slug: string
  req: PayloadRequest
}

export const generatePreviewPath = ({ collection, slug }: Props) => {
  const collectionPath = collectionPrefixMap[collection] || ''
  const fullPath = collectionPath ? `${collectionPath}/${slug}` : `/${slug}`

  const encodedParams = new URLSearchParams({
    slug,
    collection,
    path: fullPath,
    previewSecret: process.env.PREVIEW_SECRET || '',
  })

  const url = `/next/preview?${encodedParams.toString()}`

  return url
}
