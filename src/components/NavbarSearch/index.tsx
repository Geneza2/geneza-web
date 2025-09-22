'use client'

import React, { useState } from 'react'
import { Search, X, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { TypedLocale } from 'payload'
import { useRouter } from 'next/navigation'
import { useDebounce } from '@/utilities/useDebounce'

type SearchResult = {
  id: string
  title: string
  type: 'page' | 'post' | 'product' | 'good' | 'position' | 'category'
  slug: string
  description?: string
  url: string
}

type NavbarSearchProps = {
  locale: TypedLocale
}

export const NavbarSearch: React.FC<NavbarSearchProps> = ({ locale }) => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  const router = useRouter()
  const debouncedQuery = useDebounce(query, 500)

  // Perform search when query changes
  React.useEffect(() => {
    if (!debouncedQuery.trim() || debouncedQuery.length < 3) {
      setResults([])
      setIsLoading(false)
      return
    }

    const performSearch = async () => {
      setIsLoading(true)
      console.log(`[NavbarSearch] Searching for: "${debouncedQuery}" in locale: ${locale}`)

      try {
        const searchUrl = `/api/search?q=${encodeURIComponent(debouncedQuery)}&locale=${locale}`
        console.log(`[NavbarSearch] Fetching: ${searchUrl}`)

        const response = await fetch(searchUrl)
        console.log(`[NavbarSearch] Response status: ${response.status}`)

        if (response.ok) {
          const data = await response.json()
          console.log(`[NavbarSearch] Search results:`, data)
          setResults(data.results || [])
        } else {
          console.error(`[NavbarSearch] Search failed with status: ${response.status}`)
          const errorData = await response.json()
          console.error(`[NavbarSearch] Error details:`, errorData)
          setResults([])
        }
      } catch (error) {
        console.error('[NavbarSearch] Search error:', error)
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }

    performSearch()
  }, [debouncedQuery, locale])

  const handleClear = () => {
    setQuery('')
    setResults([])
  }

  const handleResultClick = (url: string) => {
    router.push(url)
    setQuery('')
    setResults([])
    setIsFocused(false)
  }

  const getTypeLabel = (type: string) => {
    const labels = {
      page: locale === 'rs' ? 'Stranica' : 'Page',
      post: locale === 'rs' ? 'Objava' : 'Post',
      product: locale === 'rs' ? 'Proizvod' : 'Product',
      good: locale === 'rs' ? 'Roba' : 'Good',
      position: locale === 'rs' ? 'Pozicija' : 'Position',
      category: locale === 'rs' ? 'Kategorija' : 'Category',
    }
    return labels[type as keyof typeof labels] || type
  }

  const shouldShowResults = isFocused && (query.length >= 3 || results.length > 0)

  return (
    <div className="relative">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          type="text"
          placeholder={locale === 'rs' ? 'Pretraži...' : 'Search...'}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            // Delay hiding results to allow clicking on them
            setTimeout(() => setIsFocused(false), 200)
          }}
          className="pl-10 pr-10 py-2 w-48 border-2 border-gray-200/50 bg-white/80 backdrop-blur-sm rounded-xl transition-all duration-200 focus:border-[#9BC273] focus:ring-2 focus:ring-[#9BC273]/20 focus:w-64 focus:bg-white"
        />
        {query && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-3 h-3" />
          </Button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {shouldShowResults && (
        <Card className="absolute top-full mt-2 w-80 max-h-96 overflow-y-auto bg-white/95 backdrop-blur-md border-0 shadow-xl z-50 right-0">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-5 h-5 animate-spin text-[#9BC273]" />
                <span className="ml-2 text-sm text-gray-600">
                  {locale === 'rs' ? 'Pretražujem...' : 'Searching...'}
                </span>
              </div>
            ) : results.length > 0 ? (
              <div className="py-2">
                {results.slice(0, 8).map((result) => (
                  <button
                    key={result.id}
                    onMouseDown={() => handleResultClick(result.url)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors duration-200 border-b border-gray-50 last:border-b-0"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {result.title}
                        </div>
                        {result.description && (
                          <div className="text-xs text-gray-500 mt-1 line-clamp-1">
                            {result.description}
                          </div>
                        )}
                      </div>
                      <div className="ml-2 flex-shrink-0">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#9BC273]/20 text-[#7BA050]">
                          {getTypeLabel(result.type)}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
                {results.length > 8 && (
                  <div className="px-4 py-2 text-center text-xs text-gray-400 border-t">
                    {locale === 'rs'
                      ? `+${results.length - 8} više rezultata`
                      : `+${results.length - 8} more results`}
                  </div>
                )}
              </div>
            ) : query.length >= 3 ? (
              <div className="py-8 text-center">
                <div className="text-sm text-gray-500">
                  {locale === 'rs' ? 'Nema rezultata' : 'No results found'}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {locale === 'rs' ? 'Pokušajte sa drugim pojmom' : 'Try a different search term'}
                </div>
              </div>
            ) : (
              <div className="py-6 text-center">
                <div className="text-xs text-gray-400">
                  {locale === 'rs'
                    ? 'Unesite najmanje 3 karaktera za pretragu'
                    : 'Type at least 3 characters to search'}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
