import type { Block } from 'payload'

export const Products: Block = {
  slug: 'products',
  interfaceName: 'productsBlock',
  fields: [
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
