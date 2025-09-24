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
import { ErrorBoundary } from '@/components/ErrorBoundary'

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
      // Try to find home page first, then fallback to any page
      page = await queryPage({
        slug: 'production',
        locale,
      })

      // If no home page, try to get any published page
      if (!page) {
        const payload = await getPayload({ config: configPromise })
        const result = await retryOperation(() =>
          payload.find({
            collection: 'pages',
            limit: 1,
            overrideAccess: false,
            locale: locale,
            where: {
              _status: {
                equals: 'published',
              },
            },
          }),
        )
        page = result.docs?.[0] || null
      }
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

    // Ensure we have valid data
    if (!hero) {
      console.warn('No hero data found for home page')
    }
    if (!layout || !Array.isArray(layout)) {
      console.warn('No layout data found or invalid format for home page')
    }

    return (
      <ErrorBoundary>
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
              {await RenderBlocks({ blocks: layout || [], locale })}
            </div>
          </div>
        </article>
      </ErrorBoundary>
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
    let page = await queryPage({
      locale,
      slug: 'production',
    })

    // If no home page, try to get any published page
    if (!page) {
      const payload = await getPayload({ config: configPromise })
      const result = await retryOperation(() =>
        payload.find({
          collection: 'pages',
          limit: 1,
          overrideAccess: false,
          locale: locale,
          where: {
            _status: {
              equals: 'published',
            },
          },
        }),
      )
      page = result.docs?.[0] || null
    }

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
