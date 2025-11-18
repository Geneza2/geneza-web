'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { TypedLocale } from 'payload'
import { GoodsCard } from '@/components/GoodsCard'
import type { Good, Category as PayloadCategory } from '@/payload-types'
import { Input } from '@/components/ui/input'
import { Search, Package, X, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { goodsTranslations } from '@/i18n/translations/goods'
import { GoodsSidebar } from '@/components/GoodsSidebar'
import { Logo } from '../Logo/Logo'

type Category = {
  slug: string
  title: string
  order?: number
  hasSubcategories?: boolean
  parent?: {
    slug: string
    title: string
  } | null
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
  const [openAccordion, setOpenAccordion] = React.useState<'categories' | 'search' | null>(null)
  const [searchInput, setSearchInput] = React.useState<string>('')

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

  const updateSearchInURL = React.useCallback(
    (query: string) => {
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
    },
    [router, selectedCategory, selectedSubcategory],
  )

  const clearSearch = React.useCallback(() => {
    setSearchInput('')
    updateSearchInURL('')
  }, [updateSearchInURL])

  React.useEffect(() => {
    setSearchInput(searchQuery)
  }, [searchQuery])

  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== searchQuery) {
        updateSearchInURL(searchInput)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [searchInput, searchQuery, updateSearchInURL])

  const setSelectedCategory = (category: string) => {
    const currentParams = new URLSearchParams()

    if (searchQuery) {
      currentParams.set('search', searchQuery)
    }

    if (category !== 'all') {
      currentParams.set('category', category)
    }

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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value)
  }

  const sortCategoriesByOrder = (a: Category, b: Category) => (a.order || 0) - (b.order || 0)

  const categoriesWithSubcategories = React.useMemo(() => {
    const categorySet = new Set<string>()
    goods.forEach((good) => {
      if (!good) return
      if (good.products && good.products.length > 0) {
        const hasSubcategories = good.products.some(
          (product) => product && product.subcategories && product.subcategories.length > 0,
        )
        if (hasSubcategories) {
          categorySet.add(good.slug || '')
        }
      }
    })
    return categorySet
  }, [goods])

  const categories: Category[] =
    availableCategories.length > 0
      ? availableCategories
          .filter((category) => category !== null && category !== undefined)
          .map((category) => ({
            slug: category.slug || '',
            title: category.title || '',
            parent:
              typeof category.parent === 'object' && category.parent && category.parent !== null
                ? {
                    slug: category.parent.slug || '',
                    title: category.parent.title || '',
                  }
                : null,
            order: typeof category.order === 'number' ? category.order : 0,
            hasSubcategories: categoriesWithSubcategories.has(category.slug || ''),
          }))
          .filter((category) => category.slug && category.title)
          .sort(sortCategoriesByOrder)
      : goods
          .filter((good) => good !== null && good !== undefined)
          .map((good) => ({
            slug: good.slug || '',
            title: good.title || '',
            parent: null,
            order: typeof good.order === 'number' ? good.order : 0,
            hasSubcategories: categoriesWithSubcategories.has(good.slug || ''),
          }))
          .filter((category) => category.slug && category.title)
          .sort(sortCategoriesByOrder)

  const allSubcategories = React.useMemo(() => {
    if (selectedCategory === 'all') {
      return []
    }

    const subcategoryMap = new Map<string, { name: string; count: number }>()

    const selectedGood = goods.find((good) => good && good.slug === selectedCategory)
    if (selectedGood && selectedGood.products) {
      selectedGood.products.forEach((product) => {
        if (!product) return
        product.subcategories?.forEach((subcategory) => {
          if (!subcategory || !subcategory.name) return
          const existing = subcategoryMap.get(subcategory.name)
          if (existing) {
            existing.count += 1
          } else {
            subcategoryMap.set(subcategory.name, { name: subcategory.name, count: 1 })
          }
        })
      })
    }

    return Array.from(subcategoryMap.values()).sort((a, b) => a.name.localeCompare(b.name))
  }, [goods, selectedCategory])

  const filteredGoods = goods
    .map((good) => {
      if (!good.products?.length) return null

      const matchesCategory = selectedCategory === 'all' || good.slug === selectedCategory

      if (!matchesCategory) return null

      const matchingProducts = good.products.filter((product) => {
        if (!product) return false

        if (selectedSubcategory) {
          const hasMatchingSubcategory = product.subcategories?.some(
            (subcategory) => subcategory.name === selectedSubcategory,
          )
          if (!hasMatchingSubcategory) return false
        }

        if (!searchQuery || !searchQuery.trim()) return true

        const searchLower = searchQuery.toLowerCase().trim()

        const titleMatch = product.title?.toLowerCase().includes(searchLower)
        const descriptionMatch = product.description?.toLowerCase().includes(searchLower)
        const countryMatch = product.country?.toLowerCase().includes(searchLower)

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
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-12">
        <div className="hidden lg:block lg:w-80 flex-shrink-0 order-1">
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

        <div className="flex-1 min-w-0 order-2 lg:order-2">
          <div className="lg:hidden mb-4">
            <Button
              variant="outline"
              onClick={() => setOpenAccordion(openAccordion === 'categories' ? null : 'categories')}
              className={`w-full flex items-center justify-between gap-2 px-4 py-3 border-2 border-white/30 bg-white/90 backdrop-blur-md hover:border-[#9BC273] transition-all duration-200 min-h-[48px] shadow-lg ${
                openAccordion === 'categories'
                  ? 'rounded-t-2xl rounded-b-none border-b-0'
                  : 'rounded-2xl'
              }`}
            >
              <span className="text-sm font-medium">
                {locale === 'rs' ? 'Kategorije' : 'Categories'}
              </span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${openAccordion === 'categories' ? 'rotate-180' : ''}`}
              />
            </Button>

            {openAccordion === 'categories' && (
              <div className="border-2 border-t-0 border-white rounded-b-2xl overflow-hidden shadow-lg">
                <GoodsSidebar
                  categories={categories}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  subcategories={allSubcategories}
                  selectedSubcategory={selectedSubcategory}
                  setSelectedSubcategory={setSelectedSubcategory}
                  locale={locale}
                  isAccordion={true}
                />
              </div>
            )}
          </div>

          <div className="lg:hidden mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                name="search"
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchInput}
                onChange={handleSearchChange}
                autoFocus={false}
                autoComplete="off"
                inputMode="none"
                onFocus={(e) => e.target.setAttribute('inputmode', 'text')}
                className="pl-12 pr-12 py-4 text-base text-gray-900 bg-white border border-gray-200 rounded-xl shadow-sm transition-all duration-200 focus:border-[#9BC273] focus:ring-2 focus:ring-[#9BC273]/20 focus:shadow-md placeholder:text-gray-400"
              />
              {searchInput && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </Button>
              )}
            </div>
          </div>

          <div className="hidden lg:block mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                name="search"
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchInput}
                onChange={handleSearchChange}
                className="pl-12 pr-12 py-4 text-base text-gray-900 bg-white border border-gray-200 rounded-xl shadow-sm transition-all duration-200 focus:border-[#9BC273] focus:ring-2 focus:ring-[#9BC273]/20 focus:shadow-md placeholder:text-gray-400"
              />
              {searchInput && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </Button>
              )}
            </div>
          </div>

          {filteredGoods.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 sm:p-12 max-w-md mx-auto border-0 shadow-xl">
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
