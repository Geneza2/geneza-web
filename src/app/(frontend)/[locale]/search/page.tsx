import type { Metadata } from 'next/types'
import { TypedLocale } from 'payload'
import { Suspense } from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { SearchResults } from '@/components/SearchResults/index'
import { getServerSideURL } from '@/utilities/getURL'

type Args = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { locale } = await params
  const safeLocale = locale || 'en'

  return {
    title: safeLocale === 'rs' ? 'Pretraga' : 'Search',
    description:
      safeLocale === 'rs'
        ? 'Pretražite našu kolekciju proizvoda, stranica i sadržaja'
        : 'Search our collection of products, pages and content',
  }
}

export default async function SearchPage({ params, searchParams }: Args) {
  const { locale } = await params
  const searchParamsData = await searchParams
  const safeLocale = (locale || 'en') as TypedLocale

  const qParam = searchParamsData.q
  const query: string = Array.isArray(qParam) ? (qParam[0] ?? '') : (qParam ?? '')

  interface ResultItem {
    id: string
    title: string
    type: 'page' | 'post' | 'product' | 'good' | 'position' | 'category' | 'media'
    slug: string
    description?: string
    url: string
    image?: string
  }
  let results: ResultItem[] = []
  if (query.trim()) {
    try {
      await getPayload({ config: configPromise })
      const baseURL = getServerSideURL()
      const res = await fetch(
        `${baseURL}/api/search?q=${encodeURIComponent(query)}&locale=${safeLocale}`,
        {
          cache: 'no-store',
        },
      )
      if (res.ok) {
        const data = await res.json()
        results = data.results || []
      }
    } catch {}
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#9BC273] via-[#8AB162] to-[#7BA050]"></div>
        <div className="absolute inset-0 bg-black/5"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-white/10 rounded-full blur-lg"></div>
          <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
        </div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
              {safeLocale === 'rs' ? 'Pretraga' : 'Search'}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              {safeLocale === 'rs'
                ? 'Pronađite ono što tražite u našoj kolekciji proizvoda i sadržaja'
                : "Find what you're looking for in our collection of products and content"}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Suspense
          fallback={
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#9BC273]/20 border-t-[#9BC273]"></div>
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#7BA050]/30 animate-pulse"></div>
              </div>
              <span className="mt-4 text-lg text-gray-600 font-medium">
                {safeLocale === 'rs' ? 'Pretražujem...' : 'Searching...'}
              </span>
            </div>
          }
        >
          <SearchResults query={query} locale={safeLocale} results={results} />
        </Suspense>
      </div>
    </div>
  )
}
