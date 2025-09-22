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
  parent?: {
    slug: string
    title: string
  } | null
  order?: number
  subcategories?: Category[]
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

  // Organize categories into parent-child structure
  const organizedCategories = React.useMemo(() => {
    const parentCategories: Category[] = []
    const childCategories: Category[] = []

    categories.forEach((category) => {
      if (!category.parent) {
        parentCategories.push({
          ...category,
          subcategories: [],
        })
      } else {
        childCategories.push(category)
      }
    })

    // Add subcategories to their parent categories
    childCategories.forEach((child) => {
      if (child.parent) {
        const parentSlug = typeof child.parent === 'object' ? child.parent.slug : child.parent
        const parent = parentCategories.find((p) => p.slug === parentSlug)
        if (parent && parent.subcategories) {
          parent.subcategories.push(child)
        }
      }
    })

    // Sort by order
    parentCategories.sort((a, b) => (a.order || 0) - (b.order || 0))
    parentCategories.forEach((parent) => {
      if (parent.subcategories) {
        parent.subcategories.sort((a, b) => (a.order || 0) - (b.order || 0))
      }
    })

    return parentCategories
  }, [categories])

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

          {organizedCategories.map((category, _index) => (
            <div key={category.slug} className="space-y-2">
              {/* Parent Category */}
              <Button
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

              {/* Subcategories */}
              {category.subcategories && category.subcategories.length > 0 && (
                <div className="ml-4 space-y-1">
                  {category.subcategories.map((subcategory) => (
                    <Button
                      key={subcategory.slug}
                      onClick={() => handleCategoryClick(subcategory.slug)}
                      variant="ghost"
                      className={`w-full justify-between group h-auto p-3 rounded-xl transition-all duration-300 text-sm ${
                        selectedCategory === subcategory.slug
                          ? 'bg-gradient-to-r from-[#9BC273]/80 to-[#8AB162]/80 text-white shadow-md hover:shadow-lg'
                          : 'hover:bg-gray-50 text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      <span className="font-normal">• {subcategory.title}</span>
                      <ChevronRight
                        className={`w-4 h-4 transition-all duration-300 ${
                          selectedCategory === subcategory.slug
                            ? 'rotate-90 text-white'
                            : 'text-gray-400 group-hover:text-[#9BC273] group-hover:translate-x-1'
                        }`}
                      />
                    </Button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-center text-sm text-gray-500">
            <span className="inline-block w-2 h-2 bg-[#9BC273] rounded-full mr-2"></span>
            <span>
              {categories.length + 1} {locale === 'rs' ? 'kategorija' : 'categories'}
            </span>
          </div>
          {organizedCategories.some((cat) => cat.subcategories && cat.subcategories.length > 0) && (
            <div className="flex items-center text-xs text-gray-400 mt-1">
              <span className="inline-block w-1.5 h-1.5 bg-gray-300 rounded-full mr-2"></span>
              <span>{locale === 'rs' ? 'Sa podkategorijama' : 'With subcategories'}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
