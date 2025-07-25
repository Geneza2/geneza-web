import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

export const revalidatePositions: CollectionAfterChangeHook = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = `/open-positions/${doc.slug}`

      payload.logger.info(`Revalidating position at path: ${path}`)

      revalidatePath(path)
      revalidateTag('open-positions-sitemap')
    }

    // If the position was previously published, we need to revalidate the old path
    if (previousDoc._status === 'published' && doc._status !== 'published') {
      const oldPath = `/open-positions/${previousDoc.slug}`

      payload.logger.info(`Revalidating old position at path: ${oldPath}`)

      revalidatePath(oldPath)
      revalidateTag('open-positions-sitemap')
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    const path = `/open-positions/${doc?.slug}`

    revalidatePath(path)
    revalidateTag('open-positions-sitemap')
  }

  return doc
}
