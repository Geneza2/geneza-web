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
      <Card className="h-full border-gray-100 transition-all duration-300 transform hover:-translate-y-2 overflow-hidden flex flex-col">
        <div className="relative aspect-square overflow-hidden flex-shrink-0">
          {product.image ? (
            <Media
              resource={product.image}
              size="100vw"
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ChefHat className="w-16 h-16 text-gray-400" />
            </div>
          )}
        </div>

        <CardContent className="p-3 flex-1 flex flex-col justify-between">
          <h3 className="text-base font-bold text-gray-900 group-hover:text-[#9BC273] transition-all duration-300 line-clamp-2 transform group-hover:scale-105">
            {product.title}
          </h3>

          <div className="mt-2 flex items-center text-[#9BC273] group-hover:scale-105 transition-transform duration-300">
            <span className="text-sm font-medium">
              {locale === 'rs' ? 'Pogledaj detalje' : 'View Details'}
            </span>
            <div className="ml-2 w-5 h-5 border-2 border-[#9BC273] rounded-full flex items-center justify-center group-hover:bg-[#9BC273] group-hover:scale-110 transition-all duration-300">
              <div className="w-2 h-2 bg-[#9BC273] rounded-full group-hover:bg-white transition-all duration-300" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
