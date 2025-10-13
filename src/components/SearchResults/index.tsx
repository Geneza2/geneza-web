'use client'

import React from 'react'
import { TypedLocale } from 'payload'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Search,
  Package,
  FileText,
  ShoppingBag,
  Briefcase,
  Folder,
  Image as ImageIcon,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

type SearchResult = {
  id: string
  title: string
  type: 'page' | 'post' | 'product' | 'good' | 'position' | 'category' | 'media'
  slug: string
  description?: string
  url: string
  image?: string
  publishedAt?: string
}

type SearchResultsProps = {
  query: string
  locale: TypedLocale
  results: SearchResult[]
}

export const SearchResults: React.FC<SearchResultsProps> = ({ query, locale, results }) => {
  const router = useRouter()

  const getTypeIcon = (type: string) => {
    const icons = {
      product: Package,
      good: ShoppingBag,
      page: FileText,
      post: FileText,
      category: Folder,
      position: Briefcase,
      media: ImageIcon,
    }
    const Icon = icons[type as keyof typeof icons] || Search
    return <Icon className="w-4 h-4" />
  }

  const getTypeLabel = (type: string) => {
    const labels = {
      page: locale === 'rs' ? 'Stranica' : 'Page',
      post: locale === 'rs' ? 'Objava' : 'Post',
      product: locale === 'rs' ? 'Proizvod' : 'Product',
      good: locale === 'rs' ? 'Roba' : 'Good',
      position: locale === 'rs' ? 'Pozicija' : 'Position',
      category: locale === 'rs' ? 'Kategorija' : 'Category',
      media: locale === 'rs' ? 'Medija' : 'Media',
    }
    return labels[type as keyof typeof labels] || type
  }

  const getTypeColor = (type: string) => {
    const colors = {
      product: 'bg-blue-100 text-blue-700 border-blue-200',
      good: 'bg-green-100 text-green-700 border-green-200',
      page: 'bg-purple-100 text-purple-700 border-purple-200',
      post: 'bg-orange-100 text-orange-700 border-orange-200',
      category: 'bg-pink-100 text-pink-700 border-pink-200',
      position: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      media: 'bg-gray-100 text-gray-700 border-gray-200',
    }
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-700 border-gray-200'
  }

  const handleResultClick = (url: string) => {
    router.push(url)
  }

  if (!query.trim()) {
    return (
      <div className="text-center py-12">
        <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">
          {locale === 'rs' ? 'Unesite pojam za pretragu' : 'Enter a search term'}
        </h3>
        <p className="text-gray-500">
          {locale === 'rs'
            ? 'Koristite polje za pretragu u navigaciji da biste pronašli sadržaj'
            : 'Use the search field in the navigation to find content'}
        </p>
      </div>
    )
  }

  // Rendering below relies solely on provided results

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">
          {locale === 'rs' ? 'Nema rezultata' : 'No results found'}
        </h3>
        <p className="text-gray-500 mb-4">
          {locale === 'rs'
            ? `Nema rezultata za "${query}". Pokušajte sa drugim pojmom.`
            : `No results found for "${query}". Try a different search term.`}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border-0 p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              {locale === 'rs' ? 'Rezultati pretrage' : 'Search Results'}
            </h2>
            <p className="text-lg text-gray-600">
              {locale === 'rs'
                ? `Pronađeno ${results.length} rezultata za "${query}"`
                : `Found ${results.length} results for "${query}"`}
            </p>
          </div>
          <Badge
            variant="secondary"
            className="bg-gradient-to-r from-[#9BC273]/10 to-[#7BA050]/10 text-[#7BA050] border-[#9BC273]/20 px-4 py-2 text-sm font-semibold"
          >
            {results.length} {locale === 'rs' ? 'rezultata' : 'results'}
          </Badge>
        </div>
      </div>

      <div className="grid gap-8">
        {results.map((result) => (
          <Card
            key={result.id}
            onClick={() => handleResultClick(result.url)}
            className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-white/80 backdrop-blur-sm border-0 rounded-3xl shadow-lg overflow-hidden cursor-pointer"
          >
            <CardContent className="p-0">
              <div className="flex flex-col sm:flex-row">
                {result.image && (
                  <div className="flex-shrink-0 w-full sm:w-48 h-48 sm:h-auto rounded-t-3xl sm:rounded-l-3xl sm:rounded-tr-none overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50 shadow-md">
                    <Image
                      src={result.image}
                      alt={result.title}
                      width={192}
                      height={192}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                <div className="flex-1 p-8">
                  <div className="flex items-start justify-between gap-6 mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#9BC273] transition-colors duration-300">
                        {result.title}
                      </h3>

                      {result.description && (
                        <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed text-lg">
                          {result.description}
                        </p>
                      )}
                    </div>

                    <div className="flex-shrink-0">
                      <Badge
                        variant="outline"
                        className={`${getTypeColor(result.type)} flex items-center gap-2 px-4 py-2 font-semibold text-sm`}
                      >
                        {getTypeIcon(result.type)}
                        {getTypeLabel(result.type)}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
