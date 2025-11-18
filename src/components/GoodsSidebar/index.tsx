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
  hasSubcategories?: boolean
}

type Subcategory = {
  name: string
  count: number
}

type Props = {
  categories: Category[]
  selectedCategory: string
  setSelectedCategory: (category: string) => void
  subcategories: Subcategory[]
  selectedSubcategory: string
  setSelectedSubcategory: (subcategory: string) => void
  locale: TypedLocale
  isAccordion?: boolean
}

export const GoodsSidebar: React.FC<Props> = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  subcategories,
  selectedSubcategory,
  setSelectedSubcategory,
  locale,
  isAccordion = false,
}) => {
  const t = goodsTranslations[locale] || goodsTranslations.en
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleCategoryClick = (categorySlug: string) => {
    if (categorySlug === selectedCategory) {
      return
    } else if (categorySlug === 'all') {
      setSelectedCategory('all')
      const params = new URLSearchParams(searchParams.toString())
      params.delete('category')
      params.delete('subcategory')
      const newUrl = `${window.location.pathname}?${params.toString()}`
      router.push(newUrl, { scroll: false })
    } else {
      setSelectedCategory(categorySlug)
      const params = new URLSearchParams(searchParams.toString())
      params.set('category', categorySlug)
      params.delete('subcategory')
      const newUrl = `${window.location.pathname}?${params.toString()}`
      router.push(newUrl, { scroll: false })
    }
  }

  const handleSubcategoryClick = (subcategoryName: string) => {
    if (subcategoryName === selectedSubcategory) {
      setSelectedSubcategory('')
      const params = new URLSearchParams(searchParams.toString())
      params.delete('subcategory')
      const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}`
      router.push(newUrl, { scroll: false })
    } else {
      setSelectedSubcategory(subcategoryName)
      const params = new URLSearchParams(searchParams.toString())
      params.set('subcategory', subcategoryName)
      const newUrl = `${window.location.pathname}?${params.toString()}`
      router.push(newUrl, { scroll: false })
    }
  }

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

    childCategories.forEach((child) => {
      if (child.parent) {
        const parentSlug = typeof child.parent === 'object' ? child.parent.slug : child.parent
        const parent = parentCategories.find((p) => p.slug === parentSlug)
        if (parent && parent.subcategories) {
          parent.subcategories.push(child)
        }
      }
    })

    parentCategories.sort((a, b) => (a.order || 0) - (b.order || 0))
    parentCategories.forEach((parent) => {
      if (parent.subcategories) {
        parent.subcategories.sort((a, b) => (a.order || 0) - (b.order || 0))
      }
    })

    parentCategories.forEach((parent) => {
      const categorySubcategories = subcategories && subcategories.length > 0
      if (categorySubcategories && parent.slug === selectedCategory) {
        if (!parent.subcategories) {
          parent.subcategories = []
        }
        parent.subcategories = subcategories.map((sub) => ({
          slug: sub.name.toLowerCase().replace(/\s+/g, '-'),
          title: sub.name,
          parent: null,
          order: 0,
          subcategories: [],
        }))
      } else if (!parent.subcategories || parent.subcategories.length === 0) {
        parent.subcategories = []
      }
    })

    return parentCategories
  }, [categories, subcategories, selectedCategory])

  return (
    <div
      className={`bg-white/90 backdrop-blur-md border-0 shadow-xl overflow-hidden ${isAccordion ? '' : 'rounded-3xl'}`}
    >
      <div className="p-3 sm:p-4 lg:p-8">
        <div className="flex items-center gap-3 mb-4 sm:mb-6 lg:mb-8">
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
        </div>{' '}
        <div className="space-y-3">
          {' '}
          <Button
            onClick={() => handleCategoryClick('all')}
            variant="ghost"
            className={`w-full justify-between group h-auto p-3 sm:p-4 rounded-2xl transition-all duration-300 min-h-[48px] ${
              selectedCategory === 'all'
                ? 'bg-gradient-to-r from-[#9BC273] to-[#8AB162] text-white shadow-lg hover:shadow-xl'
                : 'hover:bg-gray-50 text-gray-700 hover:text-gray-900'
            }`}
          >
            <span className="font-medium">{t.allCategories}</span>
          </Button>
          {organizedCategories.map((category, _index) => (
            <div key={category.slug} className="space-y-2">
              {category.slug === 'produced-by-geneza' ? (
                <Button
                  onClick={() => handleCategoryClick(category.slug)}
                  variant="ghost"
                  className={`w-full justify-between group h-auto p-3 sm:p-4 rounded-2xl transition-all duration-300 min-h-[48px] relative overflow-hidden ${
                    selectedCategory === category.slug
                      ? 'text-white shadow-lg hover:shadow-xl hover:text-white'
                      : 'hover:bg-gray-50 text-gray-700 hover:text-gray-900'
                  }`}
                  style={
                    selectedCategory === category.slug
                      ? {
                          backgroundImage: "url('/api/media/file/Geneza-011.webp')",
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }
                      : {}
                  }
                >
                  {' '}
                  <span className="font-medium relative z-10">{category.title}</span>
                  <ChevronRight
                    className={`w-5 h-5 transition-all duration-300 relative z-10 ${
                      category.hasSubcategories ||
                      (category.subcategories && category.subcategories.length > 0)
                        ? selectedCategory === category.slug
                          ? 'rotate-90 text-white'
                          : 'text-gray-400 group-hover:text-[#9BC273] group-hover:translate-x-1'
                        : 'invisible'
                    }`}
                  />
                </Button>
              ) : (
                <Button
                  onClick={() => handleCategoryClick(category.slug)}
                  variant="ghost"
                  className={`w-full justify-between group h-auto p-3 sm:p-4 rounded-2xl transition-all duration-300 min-h-[48px] ${
                    selectedCategory === category.slug
                      ? 'bg-gradient-to-r from-[#9BC273] to-[#8AB162] text-white shadow-lg hover:shadow-xl hover:text-white'
                      : 'hover:bg-gray-50 text-gray-700 hover:text-gray-900'
                  }`}
                >
                  {' '}
                  <span className="font-medium">{category.title}</span>
                  <ChevronRight
                    className={`w-5 h-5 transition-all duration-300 ${
                      category.hasSubcategories ||
                      (category.subcategories && category.subcategories.length > 0)
                        ? selectedCategory === category.slug
                          ? 'rotate-90 text-white'
                          : 'text-gray-400 group-hover:text-[#9BC273] group-hover:translate-x-1'
                        : 'invisible'
                    }`}
                  />
                </Button>
              )}
              {selectedCategory === category.slug &&
                category.subcategories &&
                category.subcategories.length > 0 && (
                  <div className="ml-6 space-y-1">
                    {category.subcategories.map((subcategory) => (
                      <Button
                        key={subcategory.slug}
                        onClick={() => handleSubcategoryClick(subcategory.title)}
                        variant="ghost"
                        className={`w-full justify-start group h-auto p-2 rounded-lg transition-all duration-300 text-sm ${
                          selectedSubcategory === subcategory.title
                            ? 'bg-gradient-to-r from-[#9BC273]/80 to-[#8AB162]/80 text-white shadow-md hover:shadow-lg hover:text-white'
                            : 'hover:bg-gray-50 text-gray-600 hover:text-gray-800'
                        }`}
                      >
                        <span className="font-normal">{subcategory.title}</span>
                      </Button>
                    ))}
                  </div>
                )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
