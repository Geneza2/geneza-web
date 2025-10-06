'use client'

import React, { useMemo } from 'react'
import { Search, TrendingUp, Clock } from 'lucide-react'

type SearchSuggestion = {
  query: string
  type: 'popular' | 'recent' | 'trending'
  count?: number
}

type SearchSuggestionsProps = {
  query: string
  onSuggestionClick: (suggestion: string) => void
  locale: 'en' | 'rs'
}

export const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  query,
  onSuggestionClick,
  locale,
}) => {
  const suggestions: SearchSuggestion[] = useMemo(() => {
    if (query.length < 2 || typeof window === 'undefined') return []

    try {
      const recentSearches: string[] = JSON.parse(localStorage.getItem('recentSearches') || '[]')
      const analytics = JSON.parse(localStorage.getItem('searchAnalytics') || '[]') as Array<{
        query?: string
      }>
      const queryCounts: Record<string, number> = {}
      analytics.forEach((item) => {
        if (item.query) queryCounts[item.query] = (queryCounts[item.query] || 0) + 1
      })
      const popularSearches = Object.entries(queryCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([q, count]) => ({ query: q, count }))

      const filteredRecent = recentSearches
        .filter((s) => s.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 3)
        .map((s) => ({ query: s, type: 'recent' as const }))

      const filteredPopular = popularSearches
        .filter(
          ({ query: pq }) =>
            pq.toLowerCase().includes(query.toLowerCase()) && !recentSearches.includes(pq),
        )
        .slice(0, 3)
        .map(({ query: pq, count }) => ({ query: pq, type: 'popular' as const, count }))

      const trendingSuggestions = [
        { query: 'organic products', type: 'trending' as const },
        { query: 'healthy food', type: 'trending' as const },
        { query: 'natural ingredients', type: 'trending' as const },
      ]
        .filter(({ query: tq }) => tq.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 2)

      return [...filteredRecent, ...filteredPopular, ...trendingSuggestions].slice(0, 8)
    } catch {
      return []
    }
  }, [query])

  if (suggestions.length === 0) {
    return null
  }

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'recent':
        return <Clock className="w-4 h-4 text-gray-400" />
      case 'popular':
        return <TrendingUp className="w-4 h-4 text-blue-500" />
      case 'trending':
        return <Search className="w-4 h-4 text-green-500" />
      default:
        return <Search className="w-4 h-4 text-gray-400" />
    }
  }

  const getSuggestionLabel = (type: string) => {
    const labels = {
      recent: locale === 'rs' ? 'Nedavno' : 'Recent',
      popular: locale === 'rs' ? 'Popularno' : 'Popular',
      trending: locale === 'rs' ? 'Trending' : 'Trending',
    }
    return labels[type as keyof typeof labels] || type
  }

  return (
    <div className="py-2">
      <div className="px-4 py-2 text-xs font-medium text-gray-500 border-b border-gray-100">
        {locale === 'rs' ? 'Predlozi' : 'Suggestions'}
      </div>

      <div className="py-1">
        {suggestions.map((suggestion, index) => (
          <button
            key={`${suggestion.type}-${suggestion.query}-${index}`}
            onClick={() => onSuggestionClick(suggestion.query)}
            className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors duration-200 flex items-center gap-3"
          >
            {getSuggestionIcon(suggestion.type)}
            <div className="flex-1 min-w-0">
              <div className="text-sm text-gray-700 truncate">{suggestion.query}</div>
              <div className="text-xs text-gray-400 flex items-center gap-1">
                <span>{getSuggestionLabel(suggestion.type)}</span>
                {suggestion.count && (
                  <span>
                    • {suggestion.count} {locale === 'rs' ? 'pretraga' : 'searches'}
                  </span>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
