import type { Block } from 'payload'

export const ImageBanner: Block = {
  slug: 'imageBanner',
  interfaceName: 'ImageBannerBlock',
  fields: [
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Banner Image',
      admin: {
        description: 'Select the image to display as banner',
      },
    },
    {
      name: 'height',
      type: 'select',
      required: false,
      defaultValue: 'medium',
      label: 'Banner Height',
      options: [
        { label: 'Small (256px)', value: 'small' },
        { label: 'Medium (384px)', value: 'medium' },
        { label: 'Large (500px)', value: 'large' },
        { label: 'Full Screen', value: 'full' },
      ],
      admin: {
        description: 'Choose the height of the banner image',
      },
    },
    {
      name: 'overlay',
      type: 'checkbox',
      required: false,
      defaultValue: false,
      label: 'Add Dark Overlay',
      admin: {
        description: 'Add a dark overlay on top of the image',
      },
    },
    {
      name: 'overlayOpacity',
      type: 'number',
      required: false,
      defaultValue: 0.3,
      min: 0,
      max: 1,

      label: 'Overlay Opacity',
      admin: {
        description: 'Opacity of the overlay (0 = transparent, 1 = black)',
        condition: (data) => data.overlay === true,
      },
    },
  ],
}
