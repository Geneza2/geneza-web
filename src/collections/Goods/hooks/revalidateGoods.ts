import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'

export const revalidateGoods: CollectionAfterChangeHook = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    const paths = ['/goods', '/en/goods', '/rs/goods']

    // Always revalidate when content changes, regardless of status
    if (doc._status === 'published' || previousDoc?._status === 'published') {
      payload.logger.info(
        `Revalidating goods at paths: ${paths.join(', ')} (status: ${doc._status})`,
      )

      paths.forEach((path) => {
        revalidatePath(path)
      })
      revalidateTag('goods-sitemap')
      revalidateTag('goods')
    }

    // Also revalidate when switching between draft and published
    if (previousDoc?._status !== doc._status) {
      payload.logger.info(
        `Revalidating goods due to status change: ${previousDoc?._status} -> ${doc._status}`,
      )

      paths.forEach((path) => {
        revalidatePath(path)
      })
      revalidateTag('goods-sitemap')
      revalidateTag('goods')
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook = ({ doc: _doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    // Revalidate all locale-specific paths
    const paths = ['/goods', '/en/goods', '/rs/goods']

    paths.forEach((path) => {
      revalidatePath(path)
    })
    revalidateTag('goods-sitemap')
    revalidateTag('goods')
  }
}
