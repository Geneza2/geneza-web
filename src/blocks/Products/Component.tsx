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
  title: string
  description: string
  products: Product[]
  locale: TypedLocale
}

export const ProductsBlock: React.FC<Props> = ({
  className,
  title,
  description,
  products,
  locale,
}) => {
  if (!products || products.length === 0) {
    return null
  }

  return (
    <section className={cn('w-full py-8 sm:py-12', className)}>
      <div className="container">
        {/* Title and Description Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">{title}</h2>
          <p className="text-base text-gray-700 max-w-3xl mx-auto leading-relaxed">{description}</p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product, index) => {
            const { title: productTitle, slug, image } = product

            return (
              <Link
                key={product.id}
                href={`/${locale}/products/${slug}`}
                className="group block text-center h-full transform transition-all duration-300 hover:scale-105 hover:-translate-y-2"
              >
                {image && (
                  <div className="relative w-full aspect-square overflow-hidden mb-3 max-w-72 mx-auto rounded-lg transition-all duration-300">
                    <Media
                      resource={image}
                      className="w-full h-full object-contain transition-all duration-500 group-hover:scale-105 group-hover:rotate-1"
                    />
                  </div>
                )}
                <h3 className="text-lg font-semibold text-gray-800 group-hover:text-[#9BC273] transition-all duration-300 transform group-hover:scale-105">
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
