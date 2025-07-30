'use client'
import React, { useState } from 'react'
import { TypedLocale } from 'payload'
import { GoodsCard } from '@/components/GoodsCard'
import type { Good } from '@/payload-types'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Search, Package, Filter, Menu } from 'lucide-react'
import { goodsTranslations } from '@/i18n/translations/goods'

export type Props = {
  goods: Good[]
  locale: TypedLocale
  availableCategories?: Array<{ id: number; title: string }>
}

export const GoodsArchive: React.FC<Props> = (props) => {
  const { goods, locale } = props
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const t = goodsTranslations[locale] || goodsTranslations.en

  const categories = goods
    .map((good) => good.title)
    .filter(Boolean)
    .sort()

  const filteredGoods = goods.filter((good) => {
    if (!good.products || good.products.length === 0) {
      return false
    }

    const searchLower = searchQuery.toLowerCase()

    const hasMatchingProduct = good.products.some((product) => {
      if (!product || !product.title) return false

      const { title, description, country } = product
      return (
        title?.toLowerCase().includes(searchLower) ||
        description?.toLowerCase().includes(searchLower) ||
        country?.toLowerCase().includes(searchLower)
      )
    })

    if (!hasMatchingProduct) return false

    if (selectedCategory === 'all') return true

    return good.title === selectedCategory
  })

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
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    variant={selectedCategory === category ? 'default' : 'ghost'}
                    className={`w-full justify-start ${
                      selectedCategory === category
                        ? 'bg-[#9BC273] hover:bg-[#9BC273]/90 text-white'
                        : 'hover:bg-accent'
                    }`}
                  >
                    {category}
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
                  {filteredGoods.map((good, index) => {
                    if (typeof good === 'object' && good !== null && good.products) {
                      return good.products.map((product, productIndex) => (
                        <div
                          key={`${index}-${productIndex}`}
                          className="animate-fade-in animate-slide-in-from-bottom-2"
                          style={{ animationDelay: `${index * 75 + productIndex * 25}ms` }}
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
                      ))
                    }
                    return null
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
