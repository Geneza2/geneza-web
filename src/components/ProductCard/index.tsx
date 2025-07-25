import React from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Media } from '@/components/Media'
import { ChefHat } from 'lucide-react'
import type { Product } from '@/payload-types'

interface ProductCardProps {
  product: Product
  locale: string
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, locale }) => {
  return (
    <Link href={`/${locale}/products/${product.slug}`} className="group block h-full">
      <Card className="h-full bg-white shadow-lg border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
        <div className="relative aspect-square overflow-hidden">
          {product.image ? (
            <Media
              resource={product.image}
              size="100vw"
              className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <ChefHat className="w-16 h-16 text-gray-400" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <CardContent className="p-6">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#9BC273] transition-colors duration-200 line-clamp-2">
            {product.title}
          </h3>

          <div className="mt-4 flex items-center text-[#9BC273]">
            <span className="text-sm font-medium">
              {locale === 'rs' ? 'Pogledaj detalje' : 'View Details'}
            </span>
            <div className="ml-2 w-5 h-5 border-2 border-[#9BC273] rounded-full flex items-center justify-center group-hover:bg-[#9BC273] transition-colors duration-200">
              <div className="w-2 h-2 bg-[#9BC273] rounded-full group-hover:bg-white transition-colors duration-200" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
