import { revalidateTag } from 'next/cache'
import type { CollectionAfterChangeHook } from 'payload'

export const revalidateProduct: CollectionAfterChangeHook = async ({
  doc: _doc,
  req: { payload: _payload, context },
}) => {
  if (!context.disableRevalidate) {
    revalidateTag('products-sitemap')
  }
}
