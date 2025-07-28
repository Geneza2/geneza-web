'use client'
import { cn } from '@/utilities/ui'
import React, { useState } from 'react'
import { TypedLocale } from 'payload'
import { GoodsCard } from '@/components/GoodsCard'
import type { Good } from '@/payload-types'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { goodsTranslations } from '@/i18n/translations/goods'
import { Search } from 'lucide-react'

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
    <div className={cn('container')}>
      <div className="mb-8">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9BC273] focus:border-transparent"
          />
        </div>
      </div>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
        <TabsList className="grid w-full grid-cols-auto-fit mb-8">
          <TabsTrigger value="all" className="text-sm font-medium">
            {t.allCategories}
          </TabsTrigger>
          {categories.map((category) => (
            <TabsTrigger key={category} value={category} className="text-sm font-medium">
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedCategory} className="mt-0">
          {filteredGoods.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                {searchQuery ? t.noProducts : t.noProductsInCategory}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredGoods.map((good, index) => {
                if (typeof good === 'object' && good !== null && good.products) {
                  return good.products.map((product, productIndex) => (
                    <GoodsCard
                      key={`${index}-${productIndex}`}
                      doc={{
                        ...good,
                        products: [product],
                      }}
                      relationTo="goods"
                      locale={locale}
                    />
                  ))
                }
                return null
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
