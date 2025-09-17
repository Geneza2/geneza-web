import type { Block } from 'payload'

export const ZigZagLeft: Block = {
  slug: 'zigZagLeft',
  interfaceName: 'zigZagLeftBlock',
  fields: [
    {
      name: 'sectionId',
      type: 'text',
      label: 'Section ID',
      admin: {
        description: 'Unique ID for this section (used for navigation links)',
      },
    },
    {
      name: 'content',
      type: 'group',
      localized: true,
      fields: [
        {
          name: 'background',
          type: 'upload',
          relationTo: 'media',
          required: false,
          localized: false,
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          localized: false,
        },
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
        },
        {
          name: 'callToAction',
          type: 'group',
          fields: [
            {
              name: 'text',
              type: 'text',
              required: true,
              admin: {
                description: 'Button text to display',
              },
            },
            {
              name: 'linkType',
              type: 'radio',
              dbName: 'cta_type',
              admin: {
                layout: 'horizontal',
                width: '50%',
              },
              defaultValue: 'reference',
              options: [
                {
                  label: 'Internal link',
                  value: 'reference',
                },
                {
                  label: 'Custom URL',
                  value: 'custom',
                },
              ],
            },
            {
              name: 'newTab',
              type: 'checkbox',
              admin: {
                style: {
                  alignSelf: 'flex-end',
                },
                width: '50%',
              },
              label: 'Open in new tab',
            },
            {
              name: 'reference',
              type: 'relationship',
              admin: {
                condition: (_, siblingData) => siblingData?.linkType === 'reference',
              },
              label: 'Document to link to',
              relationTo: ['pages', 'posts', 'products', 'openPositions', 'goods', 'categories'],
              required: true,
            },
            {
              name: 'anchor',
              type: 'text',
              admin: {
                condition: (_, siblingData) => siblingData?.linkType === 'reference',
                description: 'Optional: Add section ID to scroll to (e.g., "contact" for #contact)',
                placeholder: 'section-id',
              },
              label: 'Section ID',
              required: false,
            },
            {
              name: 'url',
              type: 'text',
              admin: {
                condition: (_, siblingData) => siblingData?.linkType === 'custom',
              },
              label: 'Custom URL',
              required: true,
            },
          ],
        },
      ],
    },
  ],
}
