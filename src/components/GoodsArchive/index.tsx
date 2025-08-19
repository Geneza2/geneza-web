'use client'

import React, { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { TypedLocale } from 'payload'
import { GoodsCard } from '@/components/GoodsCard'
import type { Good } from '@/payload-types'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Search, Package, ArrowRight, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { goodsTranslations } from '@/i18n/translations/goods'
import { GoodsSidebar } from '@/components/GoodsSidebar'
import { Logo } from '../Logo/Logo'

type Category = {
  slug: string
  title: string
}

type CutSize = {
  id?: string | null
  name: string
}

export type Props = {
  goods: Good[]
  locale: TypedLocale
  availableCategories?: any[]
  productCutSizes?: Record<string, CutSize[]>
}

export const GoodsArchive: React.FC<Props> = ({
  goods,
  locale,
  availableCategories = [],
  productCutSizes = {},
}) => {
  const searchParams = useSearchParams()
  const router = useRouter()

  const selectedCategory = searchParams.get('category') || 'all'
  const searchQuery = searchParams.get('search') || ''

  const [searchInput, setSearchInput] = useState(searchQuery)
  const [selectedCutSizes, setSelectedCutSizes] = useState<Record<string, string>>({})

  const setSelectedCategory = (category: string) => {}

  const updateSearchInURL = (query: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (query.trim()) {
      params.set('search', query)
    } else {
      params.delete('search')
    }
    router.push(`${window.location.pathname}?${params.toString()}`, { scroll: false })
  }

  const handleSearchInputChange = (query: string) => {
    setSearchInput(query)
  }

  const handleSearchSubmit = () => {
    updateSearchInURL(searchInput)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearchSubmit()
    }
  }

  const clearSearch = () => {
    setSearchInput('')
    updateSearchInURL('')
  }

  const t = goodsTranslations[locale] || goodsTranslations.en

  const sortCategoriesReverseAlphabetical = (a: Category, b: Category) =>
    b.title.localeCompare(a.title)

  const categories: Category[] =
    availableCategories.length > 0
      ? availableCategories
          .map((category) => ({
            slug: category.slug || '',
            title: category.title || '',
          }))
          .filter((category) => category.slug && category.title)
          .sort(sortCategoriesReverseAlphabetical)
      : goods
          .map((good) => ({
            slug: good.slug || '',
            title: good.title || '',
          }))
          .filter((category) => category.slug && category.title)
          .sort(sortCategoriesReverseAlphabetical)

  const handleCutSizeChange = (productId: string, cutSize: string) => {
    setSelectedCutSizes((prev) => ({
      ...prev,
      [productId]: cutSize,
    }))
  }

  const filteredGoods = goods
    .map((good) => {
      if (!good.products?.length) return null

      let matchesCategory = selectedCategory === 'all'

      if (selectedCategory !== 'all') {
        if (availableCategories.length > 0) {
          matchesCategory =
            good.categories?.some((cat: any) => {
              const categorySlug = typeof cat === 'object' && cat?.slug ? cat.slug : null
              return categorySlug === selectedCategory
            }) || false
        } else {
          matchesCategory = good.slug === selectedCategory
        }
      }

      if (!matchesCategory) return null

      const matchingProducts = good.products.filter((product) => {
        if (!product) return false
        if (!searchQuery.trim()) return true
        const searchLower = searchQuery.toLowerCase()
        return (
          product.title?.toLowerCase().includes(searchLower) ||
          product.description?.toLowerCase().includes(searchLower) ||
          product.country?.toLowerCase().includes(searchLower)
        )
      })

      if (matchingProducts.length === 0) return null

      return {
        ...good,
        products: matchingProducts,
      }
    })
    .filter((item): item is Good => item !== null)

  return (
    <div className="container">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:basis-1/3 lg:max-w-xs flex-shrink-0">
          <GoodsSidebar
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            locale={locale}
          />
        </div>

        <div className="lg:basis-2/3 flex-1">
          <Card>
            <CardContent className="p-6">
              <div className="mb-8">
                <div className="flex gap-2 max-w-md">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      type="text"
                      placeholder={t.searchPlaceholder}
                      value={searchInput}
                      onChange={(e) => handleSearchInputChange(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="pl-12 pr-12 py-4 text-base border-0 bg-white rounded-2xl transition-all duration-200"
                    />
                    {searchQuery && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearSearch}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  {searchInput !== searchQuery && (
                    <Button
                      onClick={handleSearchSubmit}
                      size="lg"
                      className="px-4 py-4 rounded-2xl"
                    >
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  )}
                </div>
                {searchInput !== searchQuery && searchInput.trim() && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {locale === 'rs'
                      ? 'Pritisnite Enter ili kliknite da pretražite'
                      : 'Press Enter or click to search'}
                  </p>
                )}
              </div>

              {filteredGoods.length === 0 ? (
                <div className="text-center py-16 animate-fade-in">
                  <Card className="max-w-md mx-auto animate-slide-up">
                    <CardContent className="pt-6">
                      <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-2xl flex items-center justify-center gap-2">
                        <Package className="w-16 h-16 text-gray-400" />
                        <div className="select-none">
                          <Logo />
                        </div>
                      </div>

                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {searchQuery ? t.noProducts : t.noProductsAvailable}
                      </h3>
                      <p className="text-gray-600">
                        {searchQuery ? t.tryAdjustingSearch : t.checkBackLater}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredGoods.flatMap((good, goodIndex) =>
                    good.products.map((product, productIndex) => {
                      const productId = `${good.slug}-${productIndex}`
                      const cutSizes = productCutSizes[product.title] || []

                      return (
                        <div
                          key={productId}
                          className="animate-fade-in-up"
                          style={{
                            animationDelay: `${(goodIndex * good.products.length + productIndex) * 50}ms`,
                          }}
                        >
                          <GoodsCard
                            doc={{
                              ...good,
                              products: [product],
                            }}
                            relationTo="goods"
                            locale={locale}
                          />
                        </div>
                      )
                    }),
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
