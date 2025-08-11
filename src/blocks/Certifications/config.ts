import { Block } from 'payload'

export const Certifications: Block = {
  slug: 'certifications',
  interfaceName: 'CertificationsBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Section Title',
      localized: true,
      required: true,
    },
    {
      name: 'certifications',
      type: 'array',
      label: 'Certifications',
      minRows: 1,
      maxRows: 10,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Certification Logo',
          required: true,
        },
        {
          name: 'title',
          type: 'text',
          label: 'Certification Name',
          required: true,
        },
        {
          name: 'pdfFile',
          type: 'upload',
          relationTo: 'media',
          filterOptions: {
            mimeType: { contains: 'application/pdf' },
          },
          label: 'PDF File',
        },
        {
          name: 'link',
          type: 'text',
          label: 'PDF URL (auto-generated from PDF file)',
          admin: {
            readOnly: true,
            description: 'This field is automatically populated when a PDF file is uploaded',
          },
        },
      ],
    },
  ],
}
