import { Block } from 'payload'

export const InfiniteCards: Block = {
  slug: 'infiniteCards',
  interfaceName: 'InfiniteCardsBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Section Title',
      localized: true,
      required: true,
    },
    {
      name: 'cards',
      type: 'array',
      label: 'Cards',
      minRows: 1,
      maxRows: 10,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Image',
          required: true,
          localized: false,
        },
        {
          name: 'link',
          type: 'group',
          label: 'Link',
          fields: [
            {
              name: 'url',
              type: 'text',
              label: 'URL',
              required: true,
            },
          ],
        },
      ],
    },
  ],
}
