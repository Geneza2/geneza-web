import React, { Fragment } from 'react'

import type { Page } from '@/payload-types'

import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { CarouselBlock } from '@/blocks/Carousel/Component'
import { InfiniteCards } from '@/blocks/InfiniteCards/Component'
import { TypedLocale } from 'payload'
import { ZigZagLeftBlock } from '@/blocks/ZigZagLeft/Component'
import { ZigZagRightBlock } from '@/blocks/ZigZagRight/Component'
import { ProductsBlock } from '@/blocks/Products/Component'
import { ContactComponent } from './Contacts/Component'

const blockComponents = {
  archive: ArchiveBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  formBlock: FormBlock,
  mediaBlock: MediaBlock,
  carousel: CarouselBlock,
  infiniteCards: InfiniteCards,
  zigZagLeft: ZigZagLeftBlock,
  zigZagRight: ZigZagRightBlock,
  contactBlock: ContactComponent,
  products: ProductsBlock,
}

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
  locale: TypedLocale | null
}> = (props) => {
  const { blocks, locale } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              return (
                <div className="my-16" key={index}>
                  {/* @ts-expect-error - Block components have dynamic props that TypeScript cannot infer */}
                  <Block {...block} locale={locale} />
                </div>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
