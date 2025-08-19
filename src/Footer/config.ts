import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateFooter } from './hooks/revalidateFooter'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'branding',
      type: 'group',
      localized: true,
      fields: [
        {
          name: 'missionStatement',
          type: 'textarea',
          label: 'Mission Statement',
          defaultValue:
            'Blending regenerative and precision agriculture with natural air-drying, for herbs that embody purity and sustainability.  ',
        },
        {
          name: 'socialMedia',
          type: 'group',
          fields: [
            {
              name: 'facebook',
              type: 'text',
              label: 'Facebook URL',
            },
            {
              name: 'instagram',
              type: 'text',
              label: 'Instagram URL',
            },
            {
              name: 'linkedin',
              type: 'text',
              label: 'LinkedIn URL',
            },
            {
              name: 'tiktok',
              type: 'text',
              label: 'TikTok URL',
            },
          ],
        },
      ],
    },
    {
      name: 'sitemapSections',
      type: 'array',
      label: 'Sitemap Sections',
      localized: true,
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Section Title',
          required: true,
        },
        {
          name: 'links',
          type: 'array',
          label: 'Section Links',
          fields: [
            link({
              appearances: false,
            }),
          ],
          maxRows: 10,
        },
      ],
      maxRows: 4,
      admin: {
        initCollapsed: true,
      },
    },
    {
      name: 'contactInfo',
      type: 'group',
      localized: true,
      fields: [
        {
          name: 'email',
          type: 'email',
          label: 'Email Address',
          defaultValue: 'geneza@geneza.com',
        },
        {
          name: 'phone',
          type: 'text',
          label: 'Phone Number',
          defaultValue: '+381 24 4874 987',
        },
        {
          name: 'address',
          type: 'text',
          label: 'Address',
          defaultValue: '24420 Kanjiža, Srbija Put Narodnih heroja 17',
        },
      ],
    },
    {
      name: 'copyright',
      type: 'text',
      label: 'Copyright Text',
      localized: true,
      defaultValue: '©2025 Geneza. All rights reserved.',
    },
    {
      name: 'navItems',
      type: 'array',
      localized: true,
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 6,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Footer/RowLabel#RowLabel',
        },
      },
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}
