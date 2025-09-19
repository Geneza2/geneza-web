import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'

export const revalidateGoods: CollectionAfterChangeHook = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = `/goods`

      payload.logger.info(`Revalidating goods at path: ${path}`)

      revalidatePath(path)
      revalidateTag('goods-sitemap')
    }

    if (previousDoc?._status === 'published' && doc._status !== 'published') {
      const oldPath = `/goods`

      payload.logger.info(`Revalidating old goods at path: ${oldPath}`)

      revalidatePath(oldPath)
      revalidateTag('goods-sitemap')
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook = ({ doc: _doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    revalidatePath('/goods')
    revalidateTag('goods-sitemap')
  }
}
