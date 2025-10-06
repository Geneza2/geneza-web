'use client'

import React, { useState } from 'react'
import { Search, X, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { TypedLocale } from 'payload'
import { useRouter } from 'next/navigation'
import { useSearchAnalytics } from '@/components/SearchAnalytics'
import { SearchSuggestions } from '@/components/SearchSuggestions'
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

type NavbarSearchProps = {
  locale: TypedLocale
}

export const NavbarSearch: React.FC<NavbarSearchProps> = ({ locale }) => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)

  const router = useRouter()
  const inputRef = React.useRef<HTMLInputElement>(null)
  const { trackResultClick } = useSearchAnalytics()

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim() || searchQuery.length < 3) {
      setResults([])
      setIsLoading(false)
      setSelectedIndex(-1)
      return
    }

    setIsLoading(true)
    setSelectedIndex(-1)

    try {
      const searchUrl = `/api/search?q=${encodeURIComponent(searchQuery)}&locale=${locale}`
      const response = await fetch(searchUrl)

      if (response.ok) {
        const data = await response.json()
        setResults(data.results || [])
        if (typeof window !== 'undefined' && (window as any).searchAnalytics) {
          ;(window as any).searchAnalytics.trackSearch(searchQuery, data.results?.length || 0)
        }
      } else {
        setResults([])
      }
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isFocused) return

    const totalItems = results.length

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex((prev) => (prev + 1) % totalItems)
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex((prev) => (prev <= 0 ? totalItems - 1 : prev - 1))
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && selectedIndex < results.length && results[selectedIndex]) {
          handleResultClick(results[selectedIndex].url)
        } else {
          handleSearchSubmit(e as React.FormEvent)
        }
        break
      case 'Escape':
        setIsFocused(false)
        setSelectedIndex(-1)
        inputRef.current?.blur()
        break
    }
  }

  const handleClear = () => {
    setQuery('')
    setResults([])
    setSelectedIndex(-1)
  }

  const handleResultClick = (url: string) => {
    if (query.trim()) {
      trackResultClick(query.trim(), url)
    }

    router.push(url)
    setQuery('')
    setResults([])
    setIsFocused(false)
    setSelectedIndex(-1)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/${locale}/search?q=${encodeURIComponent(query.trim())}`)
      setQuery('')
      setResults([])
      setIsFocused(false)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    inputRef.current?.focus()
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
      product: 'bg-blue-100 text-blue-700',
      good: 'bg-green-100 text-green-700',
      page: 'bg-purple-100 text-purple-700',
      post: 'bg-orange-100 text-orange-700',
      category: 'bg-pink-100 text-pink-700',
      position: 'bg-indigo-100 text-indigo-700',
      media: 'bg-gray-100 text-gray-700',
    }
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-700'
  }

  const shouldShowResults = isFocused && results.length > 0

  return (
    <div className="relative w-full max-w-[260px]">
      <form onSubmit={handleSearchSubmit} className="relative">
        <Input
          ref={inputRef}
          type="text"
          placeholder={locale === 'rs' ? 'Pretraži...' : 'Search...'}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            performSearch(e.target.value)
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setTimeout(() => setIsFocused(false), 200)
          }}
          className="px-3 pr-10 py-2 w-full border border-gray-200 bg-white/80 backdrop-blur-sm rounded-2xl transition-all duration-200 focus:border-[#9BC273] focus:ring-2 focus:ring-[#9BC273]/20"
        />
        {query ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-3 h-3" />
          </Button>
        ) : (
          <Button
            type="submit"
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100 rounded-lg"
          >
            <Search className="w-3 h-3" />
          </Button>
        )}
      </form>

      {shouldShowResults && (
        <Card className="absolute top-full mt-2 w-96 max-h-[500px] overflow-y-auto bg-white/95 backdrop-blur-md border-0 shadow-xl z-50 right-0">
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
                {results.slice(0, 10).map((result, index) => (
                  <button
                    key={result.id}
                    onMouseDown={() => handleResultClick(result.url)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`w-full text-left px-4 py-3 transition-colors duration-200 border-b border-gray-50 last:border-b-0 ${
                      selectedIndex === index ? 'bg-[#9BC273]/10' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {result.image && (
                        <div className="flex-shrink-0 w-6 h-6 rounded-md overflow-hidden bg-gray-100">
                          <Image
                            src={result.image}
                            alt={result.title}
                            width={24}
                            height={24}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900 truncate">
                              {result.title}
                            </div>
                            {result.description && (
                              <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                                {result.description}
                              </div>
                            )}
                          </div>
                          <div className="flex-shrink-0">
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(result.type)}`}
                            >
                              {getTypeLabel(result.type)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}

                {results.length > 10 && (
                  <div className="px-4 py-2 text-center text-xs text-gray-400 border-t bg-gray-50">
                    {locale === 'rs'
                      ? `+${results.length - 10} više rezultata`
                      : `+${results.length - 10} more results`}
                  </div>
                )}

                <div className="px-4 py-3 border-t bg-gray-50">
                  <Button
                    onClick={() => router.push(`/${locale}/search?q=${encodeURIComponent(query)}`)}
                    className="w-full bg-[#9BC273] hover:bg-[#7BA050] text-white"
                    size="sm"
                  >
                    {locale === 'rs' ? 'Pogledaj sve rezultate' : 'View all results'}
                  </Button>
                </div>
              </div>
            ) : query.length >= 3 ? (
              <div className="py-8 text-center">
                <div className="text-sm text-gray-500">
                  {locale === 'rs' ? 'Nema rezultata' : 'No results found'}
                </div>
                <div className="text-xs text-gray-400 mt-1 mb-3">
                  {locale === 'rs' ? 'Pokušajte sa drugim pojmom' : 'Try a different search term'}
                </div>
                <Button
                  onClick={() => router.push(`/${locale}/search?q=${encodeURIComponent(query)}`)}
                  size="sm"
                  className="bg-[#9BC273] hover:bg-[#7BA050] text-white"
                >
                  {locale === 'rs' ? 'Pretraži sve' : 'Search all'}
                </Button>
              </div>
            ) : query.length >= 2 && query.length < 3 ? (
              <SearchSuggestions
                query={query}
                onSuggestionClick={handleSuggestionClick}
                locale={locale}
              />
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
