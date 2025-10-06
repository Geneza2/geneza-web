'use client'

import React from 'react'

type SearchAnalyticsData = {
  query: string
  timestamp: number
  resultsCount: number
  clickedResult?: string
}

type PopularSearch = {
  query: string
  count: number
  lastSearched: number
}

export const SearchAnalytics: React.FC = () => {
  const trackSearch = (_query: string, _resultsCount: number) => {}

  const trackResultClick = (_query: string, _resultUrl: string) => {}

  if (typeof window !== 'undefined') {
    ;(window as any).searchAnalytics = {
      trackSearch,
      trackResultClick,
    }
  }

  return null
}

export const useSearchAnalytics = () => {
  const trackSearch = (query: string, resultsCount: number) => {
    if (typeof window !== 'undefined' && (window as any).searchAnalytics) {
      ;(window as any).searchAnalytics.trackSearch(query, resultsCount)
    }
  }

  const trackResultClick = (query: string, resultUrl: string) => {
    if (typeof window !== 'undefined' && (window as any).searchAnalytics) {
      ;(window as any).searchAnalytics.trackResultClick(query, resultUrl)
    }
  }

  return { trackSearch, trackResultClick }
}
