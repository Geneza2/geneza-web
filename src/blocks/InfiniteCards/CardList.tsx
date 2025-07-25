'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

type Card = {
  image?: { url: string }
  link?: { url: string }
  title?: string
}

type CardListProps = {
  cards: Card[]
  duplicateCount: number
}

const CardList: React.FC<CardListProps> = ({ cards, duplicateCount }) => {
  const duplicatedCards: Card[] = []
  for (let i = 0; i < duplicateCount; i++) {
    duplicatedCards.push(...cards)
  }

  return (
    <>
      {duplicatedCards.map((card, index) => (
        <li
          key={index}
          className="group relative w-[250px] sm:w-[300px] md:w-[350px] lg:w-[450px] max-w-full shrink-0 rounded-2xl border border-b-0 border-zinc-200 bg-white px-4 py-6 flex flex-col items-center justify-between transition-transform duration-300 hover:scale-105"
        >
          {card.image?.url && (
            <div className="relative w-full h-40 flex items-center justify-center">
              <Image
                src={card.image.url}
                alt={card.title || ''}
                fill
                className="object-contain transition-all duration-500 group-hover:scale-105"
              />
            </div>
          )}
          {card.link?.url && <Link href={card.link.url} className="absolute inset-0" />}
        </li>
      ))}
    </>
  )
}

export default CardList
