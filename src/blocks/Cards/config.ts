import type { Block } from 'payload'

export const Cards: Block = {
  slug: 'cards',
  interfaceName: 'CardsBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: false,
      label: 'Section Title',
      admin: {
        description: 'Optional title displayed above the cards section',
        placeholder: 'Enter section title...',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: false,
      label: 'Section Description',
      admin: {
        description: 'Optional description displayed below the title',
        placeholder: 'Enter section description...',
      },
    },
    {
      name: 'rows',
      type: 'select',
      required: false,
      defaultValue: 'one',
      label: 'Number of Rows',
      options: [
        { label: '1 Row (3 Cards)', value: 'one' },
        { label: '2 Rows (6 Cards)', value: 'two' },
      ],
      admin: {
        description: 'Choose how many rows of cards to display',
      },
    },
    {
      name: 'cards',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 6,
      label: 'Cards',
      admin: {
        description: 'Add up to 6 cards (3 per row)',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Card Title',
          admin: {
            placeholder: 'Enter card title...',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          required: false,
          label: 'Card Description',
          admin: {
            placeholder: 'Enter card description...',
            description: 'Optional description for the card',
          },
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: false,
          label: 'Card Image',
          admin: {
            description: 'Optional image to display with the card',
          },
        },
      ],
    },
  ],
}
