import type { Block } from 'payload'

export const ZigZagRight: Block = {
  slug: 'zigZagRight',
  interfaceName: 'zigZagRightBlock',
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
