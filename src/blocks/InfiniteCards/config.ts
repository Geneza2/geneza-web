import { Block } from 'payload'

export const InfiniteCards: Block = {
  slug: 'infiniteCards',
  interfaceName: 'InfiniteCardsBlock',
  labels: {
    singular: 'Partners Section',
    plural: 'Partners Sections',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Section Title',
      localized: true,
      required: true,
      defaultValue: 'Our Partners',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Section Description',
      localized: true,
      admin: {
        description: 'Description text that appears below the section title',
      },
    },
    {
      name: 'cards',
      type: 'array',
      label: 'Partners',
      minRows: 1,
      maxRows: 20,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Partner Logo',
          required: true,
          admin: {
            description: "Upload the partner's logo (recommended: PNG or SVG format)",
          },
        },
        {
          name: 'title',
          type: 'text',
          label: 'Partner Name',
          admin: {
            description: 'Name of the partner (used for accessibility)',
          },
        },
        {
          name: 'link',
          type: 'group',
          label: 'Partner Website',
          fields: [
            {
              name: 'url',
              type: 'text',
              label: 'Website URL',
              admin: {
                description: "Link to partner's website (optional)",
              },
            },
          ],
        },
      ],
    },
  ],
}
