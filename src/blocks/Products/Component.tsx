'use client'

import { cn } from '@/utilities/ui'
import { Media } from '@/components/Media'
import Link from 'next/link'
import { TypedLocale } from 'payload'
import type { Media as MediaType } from '@/payload-types'

type Product = {
  id: number
  title: string
  slug: string
  image?: MediaType
  highlightImage?: MediaType
}

type Props = {
  className?: string
  title: string
  description: string
  products: Product[]
  locale: TypedLocale
}

const ProductItem: React.FC<{ product: Product; locale: TypedLocale }> = ({ product, locale }) => {
  const { title: productTitle, slug, image, highlightImage } = product

  return (
    <Link href={`/${locale}/products/${slug}`} className="block text-center h-full">
      {image && (
        <div className="relative w-full aspect-square overflow-hidden mb-3 max-w-80 mx-auto rounded-lg group">
          <Media resource={image} className="w-full h-full object-contain scale-95" />
          {highlightImage && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Media
                resource={highlightImage}
                className="w-2/3 h-2/3 object-contain group-hover:scale-105 group-hover:rotate-6 transition-all duration-300 ease-out"
              />
            </div>
          )}
        </div>
      )}
      <h3 className="text-lg font-semibold text-gray-800">{productTitle}</h3>
    </Link>
  )
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
    <section
      className={cn(
        'w-full py-8 sm:py-12 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden',
        className,
      )}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/3 -translate-x-1/2 w-[44rem] h-[44rem] rounded-full bg-[#9BC273]/30 blur-[120px]" />
        <div className="absolute top-1/4 -right-40 w-[42rem] h-[42rem] rounded-full bg-amber-200/35 blur-[120px]" />
        <div className="absolute -bottom-40 left-0 w-[52rem] h-[52rem] rounded-full bg-[#9BC273]/25 blur-[120px]" />

        <div className="absolute inset-0 opacity-[0.16] [background-image:radial-gradient(circle,_rgba(155,194,115,0.7)_1px,_transparent_1px)] [background-size:14px_14px]" />
      </div>

      <div className="container relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">{title}</h2>
          <p className="text-base text-gray-700 max-w-3xl mx-auto leading-relaxed">{description}</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product, index) => (
            <div
              key={product.id ? `product-${product.id}` : `product-${index}`}
              className="transition-all duration-300"
            >
              <ProductItem product={product} locale={locale} />
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 w-full">
        <svg
          className="w-full h-auto"
          x="0px"
          y="0px"
          preserveAspectRatio="none"
          viewBox="0 0 1920 408"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M1920 1V408H0V286C0 286 266.068 493.552 883 361C883 361 1341.03 264.823 1914 3L1920 0V1Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  )
}
