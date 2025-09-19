import { Metadata } from 'next'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import { generateMeta } from '@/utilities/generateMeta'
import { TypedLocale } from 'payload'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import { homeStatic } from '@/endpoints/seed/home-static'
import type { Page as PageType } from '@/payload-types'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { retryOperation } from '@/utilities/retryOperation'

type Args = {
  params: Promise<{
    locale: TypedLocale
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  try {
    const { locale } = await paramsPromise
    const url = '/'

    let page: PageType | null

    try {
      page = await queryPage({
        slug: 'production',
        locale,
      })
    } catch (error) {
      console.error('Error querying page:', error)
      page = null
    }

    if (!page) {
      page = homeStatic as PageType
    }

    if (!page) {
      return <PayloadRedirects url={url} />
    }

    const { hero, layout } = page

    return (
      <article className="pb-8">
        <PayloadRedirects disableNotFound url={url} />
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-[#9BC273]/10 via-[#17323E]/5 to-[#9BC273]/10"></div>
          <div className="relative z-10">
            <RenderHero {...hero} />
          </div>
        </div>
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-[#17323E]/5 via-[#9BC273]/10 to-[#17323E]/5"></div>
          <div className="relative z-10">
            <RenderBlocks blocks={layout} locale={locale} />
          </div>
        </div>
      </article>
    )
  } catch (error) {
    console.error('Critical error in home page:', error)
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Welcome to Geneza</h1>
          <p className="text-muted-foreground">Loading content...</p>
        </div>
      </div>
    )
  }
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  try {
    const { locale } = await params
    const page = await queryPage({
      locale,
      slug: 'production',
    })

    return generateMeta({ doc: page })
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'Geneza',
      description: 'Welcome to Geneza',
    }
  }
}

const queryPage = cache(async ({ locale, slug }: { locale: TypedLocale; slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await retryOperation(() =>
    payload.find({
      collection: 'pages',
      draft,
      limit: 1,
      overrideAccess: draft,
      locale: locale,
      where: {
        slug: {
          equals: slug,
        },
      },
    }),
  )

  return result.docs?.[0] || null
})
