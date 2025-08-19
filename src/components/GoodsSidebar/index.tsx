'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Menu } from 'lucide-react'
import { TypedLocale } from 'payload'
import { goodsTranslations } from '@/i18n/translations/goods'
import { useRouter, useSearchParams } from 'next/navigation'

type Category = {
  slug: string
  title: string
}

type Props = {
  categories: Category[]
  selectedCategory: string
  setSelectedCategory: (category: string) => void
  locale: TypedLocale
}

export const GoodsSidebar: React.FC<Props> = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  locale,
}) => {
  const t = goodsTranslations[locale] || goodsTranslations.en
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleCategoryClick = (categorySlug: string) => {
    // Update local state first
    setSelectedCategory(categorySlug)

    // Update URL with category parameter
    const params = new URLSearchParams(searchParams.toString())
    if (categorySlug === 'all') {
      params.delete('category')
    } else {
      params.set('category', categorySlug)
    }

    const newUrl = `${window.location.pathname}?${params.toString()}`
    router.push(newUrl, { scroll: false })
  }

  return (
    <Card className="sticky top-8 bg-white">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Menu className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-lg">{locale === 'rs' ? 'Kategorije' : 'Categories'}</h3>
        </div>
        <div className="space-y-2">
          <Button
            onClick={() => handleCategoryClick('all')}
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
              onClick={() => handleCategoryClick(category.slug)}
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
  )
}
