'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { ChevronRight, LayoutGrid } from 'lucide-react'
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
    if (categorySlug === 'all') {
      setSelectedCategory(categorySlug)
      const params = new URLSearchParams(searchParams.toString())
      params.delete('category')
      const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}`
      router.push(newUrl, { scroll: false })
    } else {
      setSelectedCategory(categorySlug)
      const params = new URLSearchParams(searchParams.toString())
      params.set('category', categorySlug)
      const newUrl = `${window.location.pathname}?${params.toString()}`
      router.push(newUrl, { scroll: false })
    }
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl border-0 shadow-xl overflow-hidden">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex items-center gap-3 mb-6 lg:mb-8">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#9BC273]/10 to-[#9BC273]/5 rounded-2xl flex items-center justify-center">
            <LayoutGrid className="w-5 h-5 sm:w-6 sm:h-6 text-[#9BC273]" />
          </div>
          <div>
            <h3 className="font-bold text-lg sm:text-xl text-gray-900">
              {locale === 'rs' ? 'Kategorije' : 'Categories'}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500">
              {locale === 'rs' ? 'Filtrirajte proizvode' : 'Filter products'}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            onClick={() => handleCategoryClick('all')}
            variant="ghost"
            className={`w-full justify-between group h-auto p-4 rounded-2xl transition-all duration-300 ${
              selectedCategory === 'all'
                ? 'bg-gradient-to-r from-[#9BC273] to-[#8AB162] text-white shadow-lg hover:shadow-xl'
                : 'hover:bg-gray-50 text-gray-700 hover:text-gray-900'
            }`}
          >
            <span className="font-medium">{t.allCategories}</span>
            <ChevronRight
              className={`w-5 h-5 transition-all duration-300 ${
                selectedCategory === 'all'
                  ? 'rotate-90 text-white'
                  : 'text-gray-400 group-hover:text-[#9BC273] group-hover:translate-x-1'
              }`}
            />
          </Button>

          {categories.map((category, _index) => (
            <Button
              key={category.slug}
              onClick={() => handleCategoryClick(category.slug)}
              variant="ghost"
              className={`w-full justify-between group h-auto p-4 rounded-2xl transition-all duration-300 ${
                selectedCategory === category.slug
                  ? 'bg-gradient-to-r from-[#9BC273] to-[#8AB162] text-white shadow-lg hover:shadow-xl'
                  : 'hover:bg-gray-50 text-gray-700 hover:text-gray-900'
              }`}
            >
              <span className="font-medium">{category.title}</span>
              <ChevronRight
                className={`w-5 h-5 transition-all duration-300 ${
                  selectedCategory === category.slug
                    ? 'rotate-90 text-white'
                    : 'text-gray-400 group-hover:text-[#9BC273] group-hover:translate-x-1'
                }`}
              />
            </Button>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-center text-sm text-gray-500">
            <span className="inline-block w-2 h-2 bg-[#9BC273] rounded-full mr-2"></span>
            <span>
              {categories.length + 1} {locale === 'rs' ? 'kategorija' : 'categories'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
