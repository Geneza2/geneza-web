import type { Metadata } from 'next'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload, type RequiredDataFromCollectionSlug } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import { homeStatic } from '@/endpoints/seed/home-static'
import { TypedLocale } from 'payload'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { generateMeta } from '@/utilities/generateMeta'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { retryOperation } from '@/utilities/retryOperation'

type Params = {
  slug?: string
  locale: TypedLocale
}

export default async function Page({ params }: { params: Promise<Params> }) {
  try {
    const { slug = 'home', locale } = (await params) as Params
    const url = '/' + slug

    console.log('Attempting to load page:', { slug, locale, url })

    let page: RequiredDataFromCollectionSlug<'pages'> | null = null

    try {
      page = await queryPage({
        slug,
        locale,
      })
    } catch (error) {
      console.error('Error querying page:', error)
    }

    if (!page && (slug === 'home' || slug === 'production')) {
      console.log('Using homeStatic fallback for:', slug)
      page = homeStatic
    }

    if (!page) {
      console.log('No page found for:', { slug, locale, url })
      return <PayloadRedirects url={url} />
    }

    console.log('Page found:', { slug, hasHero: !!page.hero, hasLayout: !!page.layout })

    const { hero, layout } = page

    // Ensure we have valid data
    if (!hero) {
      console.warn('No hero data found for page:', slug)
    }
    if (!layout || !Array.isArray(layout)) {
      console.warn('No layout data found or invalid format for page:', slug)
    }

    return (
      <ErrorBoundary>
        <article>
          <PayloadRedirects disableNotFound url={url} />

          {slug === 'about' && (
            <section className="relative z-0 w-full h-[100vh] -mt-[72px] md:-mt-[80px] overflow-hidden">
              <div className="absolute inset-0 w-[100vw] h-full">
                <iframe
                  src={`https://www.youtube.com/embed/_p54D9BB12o?autoplay=1&mute=1&loop=1&playlist=_p54D9BB12o&controls=0&modestbranding=1&rel=0&playsinline=1&enablejsapi=1`}
                  title="Regenerative Agriculture"
                  allow="autoplay; encrypted-media; accelerometer; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full border-0"
                  style={{ objectFit: 'cover', pointerEvents: 'none' }}
                  loading="eager"
                />
                <div className="absolute inset-0 bg-black/20" />
              </div>
            </section>
          )}

          <div className="relative z-10">
            <RenderHero {...hero} />
          </div>
          {await RenderBlocks({ blocks: layout || [], locale })}
        </article>
      </ErrorBoundary>
    )
  } catch (error) {
    console.error('Error in page component:', error)
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
          <p className="text-muted-foreground">
            We encountered an unexpected error. Please try refreshing the page.
          </p>
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-4 text-left">
              <summary className="cursor-pointer">Error Details</summary>
              <pre className="mt-2 text-sm bg-muted p-2 rounded overflow-auto">
                {error instanceof Error ? error.message : 'Unknown error'}
              </pre>
            </details>
          )}
        </div>
      </div>
    )
  }
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug = 'home', locale } = (await params) as Params

  const page = await queryPage({ slug, locale })

  return generateMeta({ doc: page })
}

const queryPage = cache(async ({ slug, locale }: { slug: string; locale: TypedLocale }) => {
  try {
    const { isEnabled: draft } = await draftMode()

    const payload = await getPayload({ config: configPromise })

    const result = await retryOperation(() =>
      payload.find({
        collection: 'pages',
        draft,
        limit: 1,
        locale,
        overrideAccess: draft,
        where: {
          slug: {
            equals: slug,
          },
        },
      }),
    )

    return result.docs?.[0] || null
  } catch (error) {
    console.error('Error in queryPage:', error)
    return null
  }
})
