'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { TypedLocale } from 'payload'
import { GoodsCard } from '@/components/GoodsCard'
import type { Good } from '@/payload-types'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Search, Package, Menu } from 'lucide-react'
import { goodsTranslations } from '@/i18n/translations/goods'

type Category = {
  slug: string
  title: string
}

export type Props = {
  goods: Good[]
  locale: TypedLocale
}

export const GoodsArchive: React.FC<Props> = ({ goods, locale }) => {
  const searchParams = useSearchParams()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    const initialCategory = searchParams.get('category')
    const initialSearch = searchParams.get('search')

    if (initialCategory) setSelectedCategory(initialCategory)
    if (initialSearch) setSearchQuery(initialSearch)
  }, [searchParams])

  const t = goodsTranslations[locale] || goodsTranslations.en

  const categories: Category[] = goods
    .map((good) => ({
      slug: good.slug || '',
      title: good.title || '',
    }))
    .filter((category) => category.slug && category.title)
    .sort((a, b) => a.title.localeCompare(b.title))

  const filteredGoods = goods
    .map((good) => {
      if (!good.products?.length) return null

      const matchesCategory = selectedCategory === 'all' || good.slug === selectedCategory
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
          <Card className="sticky top-8 bg-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Menu className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-lg">
                  {locale === 'rs' ? 'Kategorije' : 'Categories'}
                </h3>
              </div>
              <div className="space-y-2">
                <Button
                  onClick={() => setSelectedCategory('all')}
                  variant={selectedCategory === 'all' ? 'default' : 'ghost'}
                  className={`w-full justify-start ${
                    selectedCategory === 'all'
                      ? 'bg-[#9BC273] hover:bg-[#9BC273]/90 text-white'
                      : 'hover:bg-accent'
                  }`}
                >
                  {t.allCategories}
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category.slug}
                    onClick={() => setSelectedCategory(category.slug)}
                    variant={selectedCategory === category.slug ? 'default' : 'ghost'}
                    className={`w-full justify-start ${
                      selectedCategory === category.slug
                        ? 'bg-[#9BC273] hover:bg-[#9BC273]/90 text-white'
                        : 'hover:bg-accent'
                    }`}
                  >
                    {category.title}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
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
                      <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-2xl flex items-center justify-center">
                        <Package className="w-10 h-10 text-gray-400" />
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
