import { revalidateTag } from 'next/cache'
import type { AfterChangeHook } from 'payload/types'

export const revalidateProduct: AfterChangeHook = async ({ doc, req, operation }) => {
  if (req?.payload?.config?.serverURL) {
    const baseUrl = req.payload.config.serverURL

    if (operation === 'create') {
      revalidateTag('products-sitemap')
    }

    if (operation === 'update') {
      revalidateTag('products-sitemap')
    }

    if (operation === 'delete') {
      revalidateTag('products-sitemap')
    }
  }
}

