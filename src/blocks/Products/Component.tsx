'use client'

import { cn } from '@/utilities/ui'
import { Media } from '@/components/Media'
import Link from 'next/link'
import { TypedLocale } from 'payload'
import type { Media as MediaType } from '@/payload-types'

type Product = {
  id: string
  title: string
  slug: string
  image?: MediaType
}

type Props = {
  className?: string
  products: Product[]
  locale: TypedLocale
}

export const ProductsBlock: React.FC<Props> = ({ className, products, locale }) => {
  if (!products || products.length === 0) {
    return null
  }

  return (
    <section className={cn('w-full py-16 sm:py-20', className)}>
      <div className="container">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {products.map((product) => {
            const { title: productTitle, slug, image } = product

            return (
              <Link
                key={product.id}
                href={`/${locale}/products/${slug}`}
                className="group block text-center"
              >
                {image && (
                  <div className="relative w-full aspect-square overflow-hidden mb-6 max-w-80 mx-auto">
                    <Media
                      resource={image}
                      className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                )}
                <h3 className="text-xl font-semibold text-gray-800 group-hover:text-[#9BC273] transition-colors duration-200">
                  {productTitle}
                </h3>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
