import React, { Fragment } from 'react'

import type { Page } from '@/payload-types'

import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { CarouselBlock } from '@/blocks/Carousel/Component'
import { InfiniteCards } from '@/blocks/InfiniteCards/Component'
import { Certifications } from '@/blocks/Certifications/Component'
import { TypedLocale } from 'payload'
import { ZigZagLeftBlock } from '@/blocks/ZigZagLeft/Component'
import { ZigZagRightBlock } from '@/blocks/ZigZagRight/Component'
import { ProductsBlock } from '@/blocks/Products/Component'
import { ContactComponent } from './Contacts/Component'
import { ImageBannerBlock } from './ImageBanner/Component'
import { CardsBlock } from './Cards/Component'

const blockComponents = {
  archive: ArchiveBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  formBlock: FormBlock,
  mediaBlock: MediaBlock,
  carousel: CarouselBlock,
  infiniteCards: InfiniteCards,
  certifications: Certifications,
  zigZagLeft: ZigZagLeftBlock,
  zigZagRight: ZigZagRightBlock,
  contactBlock: ContactComponent,
  products: ProductsBlock,
  imageBanner: ImageBannerBlock,
  cards: CardsBlock,
}

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
  locale: TypedLocale | null
}> = async (props) => {
  try {
    const { blocks, locale } = props

    const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

    if (hasBlocks) {
      const renderedBlocks = await Promise.all(
        blocks.map(async (block, index) => {
          try {
            const { blockType } = block

            if (blockType && blockType in blockComponents) {
              const Block = blockComponents[blockType as keyof typeof blockComponents]

              if (Block) {
                return (
                  <div className="" key={index}>
                    {/* @ts-expect-error - Block components have dynamic props that TypeScript cannot infer */}
                    <Block {...block} locale={locale} />
                  </div>
                )
              } else {
                console.error(`Block component not found for type: ${blockType}`)
                return (
                  <div key={index} className="p-4 bg-yellow-100 border border-yellow-300 rounded">
                    <p className="text-yellow-600">Block component not found: {blockType}</p>
                  </div>
                )
              }
            } else {
              console.error(`Unknown block type: ${blockType}`)
              return (
                <div key={index} className="p-4 bg-yellow-100 border border-yellow-300 rounded">
                  <p className="text-yellow-600">Unknown block type: {blockType}</p>
                </div>
              )
            }
          } catch (error) {
            console.error(`Error rendering block ${index}:`, error)
            return (
              <div key={index} className="p-4 bg-red-100 border border-red-300 rounded">
                <p className="text-red-600">
                  Error rendering block: {error instanceof Error ? error.message : 'Unknown error'}
                </p>
              </div>
            )
          }
        }),
      )

      return <Fragment>{renderedBlocks}</Fragment>
    }

    return null
  } catch (error) {
    console.error('Error in RenderBlocks:', error)
    return (
      <div className="p-4 bg-red-100 border border-red-300 rounded">
        <p className="text-red-600">
          Error rendering blocks: {error instanceof Error ? error.message : 'Unknown error'}
        </p>
      </div>
    )
  }
}
