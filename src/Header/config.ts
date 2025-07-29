import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateHeader } from './hooks/revalidateHeader'

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'navItems',
      type: 'array',
      localized: true,
      fields: [
        link({
          appearances: false,
        }),
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: false,
          localized: false,
          admin: {
            description: 'Optional image for this main nav link',
          },
        },
        {
          name: 'subcategories',
          type: 'array',
          admin: {
            description: 'Add dropdown subcategories with internal page links or external URLs',
            initCollapsed: true,
          },
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
            },
            {
              name: 'description',
              type: 'text',
              required: true,
              admin: {
                description:
                  'Short description for this subcategory (shown in dropdown, max 2 lines)',
              },
            },
            link({
              appearances: false,
              disableLabel: true,
              overrides: {
                name: 'link',
                admin: {
                  description: 'Link to an internal page or external URL',
                },
              },
            }),
          ],
        },
      ],
      maxRows: 6,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Header/RowLabel#RowLabel',
        },
      },
    },
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}
