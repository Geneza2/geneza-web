import type { Block } from 'payload'

export const Products: Block = {
  slug: 'products',
  interfaceName: 'productsBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Title',
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      label: 'Description',
    },
    {
      name: 'products',
      type: 'relationship',
      relationTo: 'products',
      required: true,
      hasMany: true,
      maxRows: 50,
    },
  ],
}
