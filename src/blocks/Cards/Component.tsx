import React from 'react'
import Image from 'next/image'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

type CardItem = {
  title: string
  description?: string
  image?: {
    url: string
    alt?: string
  }
}

type CardsBlockProps = {
  title?: string
  description?: string
  cards: CardItem[]
  rows?: 'one' | 'two'
}

export const CardsBlock: React.FC<CardsBlockProps> = ({
  title,
  description,
  cards,
  rows = 'one',
}) => {
  // Early return if no cards
  if (!cards || cards.length === 0) {
    return null
  }

  // Limit cards based on rows selection
  const maxCards = rows === 'one' ? 3 : 6
  const displayCards = cards.slice(0, maxCards)

  // Render section header
  const renderHeader = () => (
    <div className="text-center mb-8">
      {title && <h2 className="text-3xl font-bold text-white mb-4">{title}</h2>}
      {description && (
        <p className="text-lg text-white/90 max-w-3xl mx-auto leading-relaxed">{description}</p>
      )}
    </div>
  )

  // Render individual card
  const renderCard = (card: CardItem, index: number) => (
    <Card
      key={`${card.title}-${index}`}
      className="h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
    >
      {card.image && (
        <div className="relative h-48 overflow-hidden rounded-t-lg">
          <Image
            src={card.image.url}
            alt={card.image.alt || card.title}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}
      <CardHeader className="p-6">
        <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
          {card.title}
        </CardTitle>
        {card.description && (
          <CardDescription className="text-base text-gray-600 dark:text-gray-300 leading-relaxed mt-2">
            {card.description}
          </CardDescription>
        )}
      </CardHeader>
    </Card>
  )

  return (
    <section className="py-8 bg-gradient-to-br from-[#9BC273] via-[#8AB162] to-[#7BA050]">
      <div className="container mx-auto px-4 max-w-7xl">
        {renderHeader()}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayCards.map((card, index) => renderCard(card, index))}
        </div>
      </div>
    </section>
  )
}
