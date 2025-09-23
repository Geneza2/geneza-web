import type { CollectionConfig } from 'payload'
import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { slugField } from '@/fields/slug'
import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { MediaBlock } from '../../blocks/MediaBlock/config'
import { revalidateGoods, revalidateDelete } from './hooks/revalidateGoods'

export const Goods: CollectionConfig = {
  slug: 'goods',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'bannerImage',
      label: 'Banner image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description:
          'Shown as the header image on Goods page when this category is selected (fallback when global Categories are not used). Use a wide image, e.g. 1920×800.',
      },
    },
    {
      name: 'products',
      type: 'array',
      required: true,
      localized: true,
      minRows: 1,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          localized: false,
        },
        {
          name: 'specPdf',
          label: 'Specification PDF',
          type: 'upload',
          relationTo: 'media',
          localized: false,
          admin: {
            description: 'Optional PDF to download with details/specification',
          },
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          localized: true,
        },
        {
          name: 'description',
          label: 'Packaging',
          type: 'textarea',
          required: true,
          localized: true,
        },
        {
          name: 'country',
          type: 'text',
          required: true,
          localized: true,
          admin: {
            description: 'Country of origin',
          },
        },
        {
          name: 'subcategories',
          label: 'Subcategories',
          type: 'array',
          localized: true,
          admin: {
            description: 'Optional subcategories for this product (e.g., sizes, cuts)',
          },
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
            },
            {
              name: 'description',
              type: 'text',
            },
          ],
        },
      ],
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'content',
              type: 'richText',
              required: true,
              localized: true,
              editor: lexicalEditor({
                features: ({ rootFeatures }) => [
                  ...rootFeatures,
                  HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                  BlocksFeature({ blocks: [MediaBlock] }),
                  FixedToolbarFeature(),
                  InlineToolbarFeature(),
                  HorizontalRuleFeature(),
                ],
              }),
            },
          ],
        },
        {
          label: 'Meta',
          fields: [
            {
              name: 'categories',
              type: 'relationship',
              relationTo: 'categories',
              hasMany: true,
              admin: { position: 'sidebar' },
            },
          ],
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({ hasGenerateFn: true }),
            MetaImageField({ relationTo: 'media' }),
            MetaDescriptionField({}),
            PreviewField({
              hasGenerateFn: true,
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    ...slugField(),
  ],
  versions: {
    drafts: {
      autosave: false,
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
  hooks: {
    afterChange: [revalidateGoods],
    afterDelete: [revalidateDelete],
  },
}
