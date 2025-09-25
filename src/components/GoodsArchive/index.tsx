'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { TypedLocale } from 'payload'
import { GoodsCard } from '@/components/GoodsCard'
import type { Good, Category as PayloadCategory } from '@/payload-types'
import { Input } from '@/components/ui/input'
import { Search, Package, ArrowRight, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { goodsTranslations } from '@/i18n/translations/goods'
import { GoodsSidebar } from '@/components/GoodsSidebar'
import { Logo } from '../Logo/Logo'

type Category = {
  slug: string
  title: string
}

interface ProductCutSize {
  id?: string | null
  name: string
}

export type Props = {
  goods: Good[]
  locale: TypedLocale
  availableCategories?: PayloadCategory[]
  productCutSizes?: Record<string, ProductCutSize[]>
  searchParams: { [key: string]: string | string[] | undefined }
}

export const GoodsArchive: React.FC<Props> = ({
  goods,
  locale,
  availableCategories = [],
  searchParams,
}) => {
  const router = useRouter()

  const selectedCategory: string = Array.isArray(searchParams.category)
    ? searchParams.category[0] || 'all'
    : searchParams.category || 'all'

  const selectedSubcategory: string = Array.isArray(searchParams.subcategory)
    ? searchParams.subcategory[0] || ''
    : searchParams.subcategory || ''

  const searchQuery: string = Array.isArray(searchParams.search)
    ? searchParams.search[0] || ''
    : searchParams.search || ''

  const t = goodsTranslations[locale] || goodsTranslations.en

  const setSelectedCategory = (category: string) => {
    const currentParams = new URLSearchParams()

    if (searchQuery) {
      currentParams.set('search', searchQuery)
    }

    if (category !== 'all') {
      currentParams.set('category', category)
    }

    // Clear subcategory when changing category
    if (selectedSubcategory) {
      currentParams.delete('subcategory')
    }

    const queryString = currentParams.toString()
    router.push(`${window.location.pathname}${queryString ? `?${queryString}` : ''}`, {
      scroll: false,
    })
  }

  const setSelectedSubcategory = (subcategory: string) => {
    const currentParams = new URLSearchParams()

    if (searchQuery) {
      currentParams.set('search', searchQuery)
    }

    if (selectedCategory && selectedCategory !== 'all') {
      currentParams.set('category', selectedCategory)
    }

    if (subcategory) {
      currentParams.set('subcategory', subcategory)
    }

    const queryString = currentParams.toString()
    router.push(`${window.location.pathname}${queryString ? `?${queryString}` : ''}`, {
      scroll: false,
    })
  }

  const updateSearchInURL = (query: string) => {
    const currentParams = new URLSearchParams()

    if (selectedCategory && selectedCategory !== 'all') {
      currentParams.set('category', selectedCategory)
    }

    if (selectedSubcategory) {
      currentParams.set('subcategory', selectedSubcategory)
    }

    if (query.trim()) {
      currentParams.set('search', query.trim())
    }

    const queryString = currentParams.toString()
    router.push(`${window.location.pathname}${queryString ? `?${queryString}` : ''}`, {
      scroll: false,
    })
  }

  const clearSearch = () => {
    updateSearchInURL('')
  }

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const query = formData.get('search') as string
    updateSearchInURL(query || '')
  }

  const sortCategoriesAlphabetical = (a: Category, b: Category) => a.title.localeCompare(b.title)

  const categories: Category[] =
    availableCategories.length > 0
      ? availableCategories
          .map((category) => ({
            slug: category.slug || '',
            title: category.title || '',
            parent:
              typeof category.parent === 'object' && category.parent
                ? {
                    slug: category.parent.slug || '',
                    title: category.parent.title || '',
                  }
                : null,
            order: typeof category.order === 'number' ? category.order : 0,
          }))
          .filter((category) => category.slug && category.title)
          .sort(sortCategoriesAlphabetical)
      : goods
          .map((good) => ({
            slug: good.slug || '',
            title: good.title || '',
            parent: null,
            order: 0,
          }))
          .filter((category) => category.slug && category.title)
          .sort(sortCategoriesAlphabetical)

  // Extract subcategories only from the selected category's goods
  const allSubcategories = React.useMemo(() => {
    // Don't show subcategories if "all" is selected
    if (selectedCategory === 'all') {
      return []
    }

    const subcategoryMap = new Map<string, { name: string; count: number }>()

    goods.forEach((good) => {
      // Check if this good matches the selected category
      let matchesCategory = false

      if (availableCategories.length > 0) {
        matchesCategory =
          good.categories?.some((cat: number | PayloadCategory) => {
            const categorySlug = typeof cat === 'object' && cat?.slug ? cat.slug : null
            return categorySlug === selectedCategory
          }) || false
      } else {
        matchesCategory = good.slug === selectedCategory
      }

      // Only process subcategories from goods that match the selected category
      if (matchesCategory) {
        good.products?.forEach((product) => {
          product.subcategories?.forEach((subcategory) => {
            if (subcategory.name) {
              const existing = subcategoryMap.get(subcategory.name)
              if (existing) {
                existing.count += 1
              } else {
                subcategoryMap.set(subcategory.name, { name: subcategory.name, count: 1 })
              }
            }
          })
        })
      }
    })

    return Array.from(subcategoryMap.values()).sort((a, b) => a.name.localeCompare(b.name))
  }, [goods, selectedCategory, availableCategories])

  const filteredGoods = goods
    .map((good) => {
      if (!good.products?.length) return null

      let matchesCategory = selectedCategory === 'all'

      if (selectedCategory !== 'all') {
        if (availableCategories.length > 0) {
          matchesCategory =
            good.categories?.some((cat: number | PayloadCategory) => {
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

        // Filter by subcategory if selected
        if (selectedSubcategory) {
          const hasMatchingSubcategory = product.subcategories?.some(
            (subcategory) => subcategory.name === selectedSubcategory,
          )
          if (!hasMatchingSubcategory) return false
        }

        // Filter by search query if provided
        if (!searchQuery || !searchQuery.trim()) return true

        const searchLower = searchQuery.toLowerCase().trim()

        const titleMatch = product.title?.toLowerCase().includes(searchLower)
        const descriptionMatch = product.description?.toLowerCase().includes(searchLower)
        const countryMatch = product.country?.toLowerCase().includes(searchLower)

        // Also search in subcategories
        const subcategoryMatch = product.subcategories?.some(
          (subcategory) =>
            subcategory.name?.toLowerCase().includes(searchLower) ||
            subcategory.description?.toLowerCase().includes(searchLower),
        )

        return titleMatch || descriptionMatch || countryMatch || subcategoryMatch
      })

      if (matchingProducts.length === 0) return null

      return {
        ...good,
        products: matchingProducts,
      }
    })
    .filter((item): item is Good => item !== null)

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-12">
        <div className="lg:w-80 flex-shrink-0">
          <div className="lg:sticky lg:top-8">
            <GoodsSidebar
              categories={categories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              subcategories={allSubcategories}
              selectedSubcategory={selectedSubcategory}
              setSelectedSubcategory={setSelectedSubcategory}
              locale={locale}
            />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border-0 shadow-xl p-6 sm:p-8 mb-8">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {locale === 'rs' ? 'Pronađite proizvod' : 'Find Product'}
              </h2>
              <p className="text-gray-600 mb-6">
                {locale === 'rs'
                  ? 'Pretražite kroz našu kolekciju kvalitetnih proizvoda'
                  : 'Search through our collection of quality products'}
              </p>

              <form onSubmit={handleSearchSubmit} className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    name="search"
                    type="text"
                    placeholder={t.searchPlaceholder}
                    defaultValue={searchQuery || ''}
                    className="pl-12 pr-12 py-4 text-base border-2 border-gray-200 bg-white rounded-2xl transition-all duration-200 focus:border-[#9BC273] focus:ring-2 focus:ring-[#9BC273]/20"
                  />
                  {searchQuery && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={clearSearch}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100 rounded-xl"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="px-6 py-4 rounded-2xl bg-[#9BC273] hover:bg-[#8AB162] border-0 shadow-lg"
                >
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </form>
            </div>
          </div>

          {filteredGoods.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 sm:p-12 max-w-md mx-auto border-0 shadow-xl">
                <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-gray-100 via-white to-gray-50 rounded-3xl flex items-center justify-center shadow-inner">
                  <div className="flex items-center gap-2">
                    <Package className="w-16 h-16 text-gray-400" />
                    <div className="select-none opacity-50">
                      <Logo />
                    </div>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {searchQuery ? t.noProducts : t.noProductsAvailable}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {searchQuery ? t.tryAdjustingSearch : t.checkBackLater}
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              {filteredGoods.flatMap((good, goodIndex) =>
                good.products.map((product, productIndex) => {
                  const productId = `${good.slug}-${productIndex}`

                  return (
                    <div
                      key={productId}
                      className="transform transition-all duration-300 hover:scale-[1.01]"
                      style={{
                        animation: `fadeInUp 0.6s ease-out ${(goodIndex * good.products.length + productIndex) * 0.1}s both`,
                      }}
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
                  )
                }),
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
