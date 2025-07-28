'use client'
import { cn } from '@/utilities/ui'
import React, { useState } from 'react'
import { TypedLocale } from 'payload'
import { GoodsCard } from '@/components/GoodsCard'
import type { Good } from '@/payload-types'

import { Input } from '@/components/ui/input'
import { goodsTranslations } from '@/i18n/translations/goods'
import { Search, Package } from 'lucide-react'

export type Props = {
  goods: Good[]
  locale: TypedLocale
  availableCategories?: Array<{ id: number; title: string }>
}

export const GoodsArchive: React.FC<Props> = (props) => {
  const { goods, locale, availableCategories = [] } = props
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const t = goodsTranslations[locale] || goodsTranslations.en

  console.log('props:', {
    goodsCount: goods.length,
    availableCategoriesCount: availableCategories.length,
  })
  console.log('categories:', availableCategories)

  const categories = goods
    .map((good) => good.title)
    .filter(Boolean)
    .sort()

  console.log('available category:', availableCategories)
  console.log('tabs:', categories)
  console.log(
    'Goods with their categories:',
    goods.map((g) => ({
      title: g.title,
      categories: g.categories,
      hasProducts: g.products && g.products.length > 0,
      productCount: g.products ? g.products.length : 0,
    })),
  )

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
      {/* Search & Filter Section */}
      <div className="max-w-4xl mx-auto mb-12">
        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
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

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-6 py-3 text-sm font-semibold rounded-xl transition-all duration-200 ${
              selectedCategory === 'all'
                ? 'bg-[#9BC273] text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 shadow-md hover:shadow-lg hover:scale-105 hover:text-[#9BC273]'
            }`}
          >
            {t.allCategories}
          </button>
          {categories.map((category, index) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 text-sm font-semibold rounded-xl transition-all duration-200 ${
                selectedCategory === category
                  ? 'bg-[#9BC273] text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 shadow-md hover:shadow-lg hover:scale-105 hover:text-[#9BC273]'
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Products Section */}
      <div className="max-w-6xl mx-auto">
        {filteredGoods.length === 0 ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-2xl flex items-center justify-center">
                <Package className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchQuery ? 'No products found' : 'No products available'}
              </h3>
              <p className="text-gray-600">
                {searchQuery
                  ? 'Try adjusting your search terms'
                  : 'Check back later for new products'}
              </p>
            </div>
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
      </div>
    </div>
  )
}
