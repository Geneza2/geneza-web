'use client'

import React, { useState } from 'react'
import { Search, X, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { TypedLocale } from 'payload'
import { useRouter } from 'next/navigation'
import { useDebounce } from '@/utilities/useDebounce'
import { getApiURL } from '@/utilities/getURL'

type SearchResult = {
  id: string
  title: string
  type: 'page' | 'post' | 'product' | 'good' | 'position'
  slug: string
  description?: string
  url: string
}

type GlobalSearchProps = {
  locale: TypedLocale
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({ locale }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()
  const debouncedQuery = useDebounce(query, 300)

  // Perform search when query changes
  React.useEffect(() => {
    if (!debouncedQuery.trim() || debouncedQuery.length < 2) {
      setResults([])
      return
    }

    const performSearch = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(
          getApiURL(`/api/search?q=${encodeURIComponent(debouncedQuery)}&locale=${locale}`),
        )
        if (response.ok) {
          const data = await response.json()
          setResults(data.results || [])
        }
      } catch (error) {
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }

    performSearch()
  }, [debouncedQuery, locale])

  const handleToggle = () => {
    setIsOpen(!isOpen)
    if (!isOpen) {
      setQuery('')
      setResults([])
    }
  }

  const handleClear = () => {
    setQuery('')
    setResults([])
  }

  const handleResultClick = (url: string) => {
    router.push(url)
    setIsOpen(false)
    setQuery('')
    setResults([])
  }

  const getTypeLabel = (type: string) => {
    const labels = {
      page: locale === 'rs' ? 'Stranica' : 'Page',
      post: locale === 'rs' ? 'Objava' : 'Post',
      product: locale === 'rs' ? 'Proizvod' : 'Product',
      good: locale === 'rs' ? 'Roba' : 'Good',
      position: locale === 'rs' ? 'Pozicija' : 'Position',
    }
    return labels[type as keyof typeof labels] || type
  }

  return (
    <div className="relative">
      {/* Search Toggle Button */}
      <Button
        onClick={handleToggle}
        variant="ghost"
        size="sm"
        className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
      >
        <Search className="w-5 h-5 text-gray-600" />
      </Button>

      {/* Search Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50" onClick={handleToggle}>
          <div className="flex items-start justify-center pt-20 px-4">
            <div
              className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border-0 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Search Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      type="text"
                      placeholder={
                        locale === 'rs' ? 'Pretražite sve sadržaje...' : 'Search all content...'
                      }
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="pl-12 pr-12 py-4 text-lg border-2 border-gray-200 bg-gray-50 rounded-xl transition-all duration-200 focus:border-[#9BC273] focus:ring-2 focus:ring-[#9BC273]/20"
                      autoFocus
                    />
                    {query && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleClear}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-200 rounded-lg"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <Button
                    onClick={handleToggle}
                    variant="ghost"
                    size="sm"
                    className="p-2 hover:bg-gray-100 rounded-xl"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Search Results */}
              <div className="max-h-96 overflow-y-auto">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-6 h-6 animate-spin text-[#9BC273]" />
                    <span className="ml-3 text-gray-600">
                      {locale === 'rs' ? 'Pretražujem...' : 'Searching...'}
                    </span>
                  </div>
                ) : results.length > 0 ? (
                  <div className="py-2">
                    {results.map((result) => (
                      <button
                        key={result.id}
                        onClick={() => handleResultClick(result.url)}
                        className="w-full text-left px-6 py-4 hover:bg-gray-50 transition-colors duration-200 border-b border-gray-50 last:border-b-0"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="text-lg font-medium text-gray-900 truncate mb-1">
                              {result.title}
                            </div>
                            {result.description && (
                              <div className="text-sm text-gray-500 line-clamp-2 mb-2">
                                {result.description}
                              </div>
                            )}
                            <div className="text-xs text-gray-400">{result.url}</div>
                          </div>
                          <div className="ml-4 flex-shrink-0">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#9BC273]/20 text-[#7BA050]">
                              {getTypeLabel(result.type)}
                            </span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : query.length >= 2 ? (
                  <div className="py-12 text-center">
                    <div className="text-lg text-gray-500 mb-2">
                      {locale === 'rs' ? 'Nema rezultata' : 'No results found'}
                    </div>
                    <div className="text-sm text-gray-400">
                      {locale === 'rs'
                        ? 'Pokušajte sa drugim pojmom'
                        : 'Try a different search term'}
                    </div>
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <div className="text-sm text-gray-400 mb-4">
                      {locale === 'rs'
                        ? 'Unesite najmanje 2 karaktera za pretragu'
                        : 'Type at least 2 characters to search'}
                    </div>
                    <div className="text-xs text-gray-300">
                      {locale === 'rs'
                        ? 'Pretražuje stranice, objave, proizvode, robu i pozicije'
                        : 'Searches pages, posts, products, goods and positions'}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
