import { Button, type ButtonProps } from '@/components/ui/button'
import { cn } from '@/utilities/ui'
import Link from 'next/link'
import React from 'react'

import type { Page, Post, Product, OpenPosition, Category, Good } from '@/payload-types'

// Map collection names to their route paths
const getCollectionPath = (relationTo: string): string => {
  const collectionPathMap: Record<string, string> = {
    pages: '',
    posts: 'posts',
    products: 'products',
    openPositions: 'open-positions',
    goods: 'goods',
    categories: 'categories',
  }

  return collectionPathMap[relationTo] || relationTo
}

type CMSLinkType = {
  appearance?: 'inline' | ButtonProps['variant']
  children?: React.ReactNode
  className?: string
  label?: string | null
  locale?: string
  newTab?: boolean | null
  reference?: {
    relationTo: 'pages' | 'posts' | 'products' | 'openPositions' | 'goods' | 'categories'
    value: Page | Post | Product | OpenPosition | Good | Category | string | number
  } | null
  size?: ButtonProps['size'] | null
  type?: 'custom' | 'reference' | null
  url?: string | null
}

export const CMSLink: React.FC<CMSLinkType> = (props) => {
  const {
    type,
    appearance = 'inline',
    children,
    className,
    newTab,
    reference,
    size: sizeFromProps,
    url,
    locale,
  } = props

  let href: string | null = null

  // Handle custom URL type
  if (type === 'custom' && url) {
    href = url
  }

  // Handle reference type - simplified approach
  if (type === 'reference' && reference?.value) {
    const refValue = reference.value
    if (typeof refValue === 'object' && refValue && 'slug' in refValue && refValue.slug) {
      if (reference.relationTo === 'pages') {
        href = `/${locale || 'en'}/${refValue.slug}`
      } else {
        // For all collections, use the mapped path
        const collectionPath = getCollectionPath(reference.relationTo)
        href = `/${locale || 'en'}/${collectionPath}/${refValue.slug}`
      }
    }
  }

  if (!href) return null

  const size = appearance === 'link' ? 'clear' : sizeFromProps
  const newTabProps = newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {}

  /* Ensure we don't break any styles set by richText */
  if (appearance === 'inline') {
    return (
      <Link className={cn(className)} href={href} {...newTabProps}>
        {children && children}
      </Link>
    )
  }

  return (
    <Button asChild className={className} size={size} variant={appearance}>
      <Link className={cn(className)} href={href} {...newTabProps}>
        {children && children}
      </Link>
    </Button>
  )
}
