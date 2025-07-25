import type { Config } from 'src/payload-types'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

const _locales = ['en', 'rs'] as const
export type PayloadLocale = (typeof _locales)[number] | undefined

type Global = keyof Config['globals']

async function getGlobal(slug: Global, depth = 0, locale: PayloadLocale = 'en') {
  const payload = await getPayload({ config: configPromise })

  const global = await payload.findGlobal({
    slug,
    depth,
    locale,
  })

  return global
}

export const getCachedGlobal = (slug: Global, depth = 0, locale: PayloadLocale = 'en') => {
  const normalizedLocale = locale ?? 'en'

  return unstable_cache(
    async () => getGlobal(slug, depth, normalizedLocale),
    [slug, normalizedLocale],
    {
      tags: [`global_${slug}_${normalizedLocale}`],
    },
  )
}
