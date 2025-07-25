import type { GlobalAfterChangeHook } from 'payload'
import { revalidateTag } from 'next/cache'

export const revalidateHeader: GlobalAfterChangeHook = async ({ req, req: { context }, doc }) => {
  if (!context.disableRevalidate) {
    const locale = req.query?.locale || 'en'
    const tag = `global_header_${locale}`

    req.payload.logger.info(`Revalidating header for locale: ${locale}`)
    revalidateTag(tag)
  }

  return doc
}
