import type { Block } from 'payload'

export const Statistics: Block = {
  slug: 'statistics',
  interfaceName: 'StatisticsBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      localized: true,
      admin: {
        description: 'Main heading for the statistics section',
      },
    },
    {
      name: 'subtitle',
      type: 'text',
      localized: true,
      admin: {
        description: 'Small text above the title (optional)',
      },
    },
    {
      name: 'statistics',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 6,
      fields: [
        {
          name: 'number',
          type: 'number',
          required: true,
          admin: {
            description: 'The number to display and animate to',
          },
        },
        {
          name: 'suffix',
          type: 'text',
          admin: {
            description: 'Text to append after the number (e.g., "+", "%", "K")',
            placeholder: '+',
          },
        },
        {
          name: 'label',
          type: 'text',
          required: true,
          localized: true,
          admin: {
            description: 'Description text below the number',
            placeholder: 'Brands',
          },
        },
      ],
      admin: {
        description: 'Add statistics to display with animated counters',
      },
    },
    {
      name: 'animationDuration',
      type: 'number',
      defaultValue: 2000,
      admin: {
        description: 'Animation duration in milliseconds (default: 2000ms)',
        step: 100,
      },
    },
  ],
  labels: {
    singular: 'Statistics Block',
    plural: 'Statistics Blocks',
  },
}
