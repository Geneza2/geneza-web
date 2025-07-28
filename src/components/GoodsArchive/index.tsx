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

  const categories = availableCategories.map((cat) => cat.title).sort()

  const filteredGoods = goods.filter((good) => {
    const firstProduct = good.products?.[0]
    if (!firstProduct) {
      return false
    }

    const { title, description, country } = firstProduct
    const searchLower = searchQuery.toLowerCase()

    const matchesSearch =
      title?.toLowerCase().includes(searchLower) ||
      description?.toLowerCase().includes(searchLower) ||
      country?.toLowerCase().includes(searchLower)

    if (!matchesSearch) return false

    if (selectedCategory === 'all') return true

    if (good.categories && Array.isArray(good.categories)) {
      return good.categories.some((category) => {
        if (category && typeof category === 'object') {
          if ('title' in category) {
            return category.title === selectedCategory
          } else if ('id' in category && typeof (category as any).id === 'number') {
            const foundCategory = availableCategories.find((cat) => cat.id === (category as any).id)
            return foundCategory ? foundCategory.title === selectedCategory : false
          }
        } else if (typeof category === 'string') {
          return category === selectedCategory
        }
        return false
      })
    }

    return false
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
                if (typeof good === 'object' && good !== null) {
                  return <GoodsCard key={index} doc={good} relationTo="goods" locale={locale} />
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
