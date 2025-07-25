'use client'

import React from 'react'
import CardList from './CardList'
import { cn } from '@/utilities/ui'
import { InfiniteScrollAnimation } from '@/hooks/InfiniteScrollAnimationHelper'

type Card = {
  image?: { url: string }
  link?: { url: string }
  title?: string
}

type Props = {
  heading: string
  cards: Card[]
  className?: string
}

export const InfiniteCards: React.FC<Props> = ({ heading, cards, className }) => {
  const { duplicatedCount, animationStyle, pauseClassName } = InfiniteScrollAnimation()

  return (
    <div className="relative w-screen left-1/2 -translate-x-1/2 overflow-hidden py-10 sm:py-16 md:py-20 bg-[#f6f6f6]">
      <div className="container px-4 sm:px-6 md:px-8">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
          {heading}
        </h2>
      </div>

      <div className={cn('relative z-20 max-w-full mx-auto overflow-hidden', className)}>
        <ul
          className={cn(
            'flex w-max min-w-full shrink-0 flex-nowrap gap-4 py-4 animate-scroll',
            pauseClassName,
          )}
          style={animationStyle}
        >
          <CardList cards={cards} duplicateCount={duplicatedCount} />
        </ul>
      </div>
    </div>
  )
}
