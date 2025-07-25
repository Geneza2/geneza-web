import type { Block } from 'payload'

export const ZigZagLeft: Block = {
  slug: 'zigZagLeft',
  interfaceName: 'zigZagLeftBlock',
  fields: [
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
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
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
            },
            {
              name: 'link',
              type: 'text',
              required: true,
            },
            {
              name: 'openInNewTab',
              type: 'checkbox',
              defaultValue: false,
            },
          ],
        },
      ],
    },
  ],
}
