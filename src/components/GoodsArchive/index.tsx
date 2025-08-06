'use client'

import React, { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { TypedLocale } from 'payload'
import { GoodsCard } from '@/components/GoodsCard'
import type { Good } from '@/payload-types'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Search, Package } from 'lucide-react'
import { goodsTranslations } from '@/i18n/translations/goods'
import { GoodsSidebar } from '../GoodsSidebar'
import { Logo } from '../Logo/Logo'

type Category = {
  slug: string
  title: string
}

export type Props = {
  goods: Good[]
  locale: TypedLocale
  availableCategories?: any[]
}

export const GoodsArchive: React.FC<Props> = ({ goods, locale, availableCategories = [] }) => {
  const searchParams = useSearchParams()

  // Initialized once from URL params (no reactive updates)
  const defaultCategory = searchParams.get('category') || 'all'
  const defaultSearch = searchParams.get('search') || ''

  const [selectedCategory, setSelectedCategory] = useState(defaultCategory)
  const [searchQuery, setSearchQuery] = useState(defaultSearch)

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
                <div className="relative max-w-md">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder={t.searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 pr-4 py-4 text-base border-0 bg-white rounded-2xl shadow-lg focus:ring-2 focus:ring-[#9BC273] focus:ring-offset-2 transition-all duration-200"
                  />
                </div>
              </div>

              {filteredGoods.length === 0 ? (
                <div className="text-center py-16">
                  <Card className="max-w-md mx-auto">
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
                  {filteredGoods.flatMap((good) =>
                    good.products.map((product, productIndex) => (
                      <div key={`${good.slug}-${productIndex}`}>
                        <GoodsCard
                          doc={{
                            ...good,
                            products: [product],
                          }}
                          relationTo="goods"
                          locale={locale}
                        />
                      </div>
                    )),
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
