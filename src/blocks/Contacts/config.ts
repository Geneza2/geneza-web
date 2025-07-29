import type { Block } from 'payload'

export const ContactBlock: Block = {
  slug: 'contactBlock',
  interfaceName: 'ContactBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      localized: true,
    },
    {
      name: 'companyInfo',
      type: 'group',
      label: 'Company Information',
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Company Name',
          defaultValue: 'Geneza Ltd.',
          localized: true,
        },
        {
          name: 'address',
          type: 'text',
          label: 'Address',
          defaultValue: '24420 Kanjiža, Put Narodnih heroja 17, Serbia',
          localized: true,
        },
        {
          name: 'tin',
          type: 'text',
          label: 'TIN (Tax payer ID)',
          defaultValue: '100870797',
        },
        {
          name: 'identificationNo',
          type: 'text',
          label: 'Identification No',
          defaultValue: '08579024',
        },
        {
          name: 'registrationNo',
          type: 'text',
          label: 'Registration No',
          defaultValue: '2140857024',
        },
        {
          name: 'industrialNo',
          type: 'text',
          label: 'Industrial No',
          defaultValue: '4621',
        },
        {
          name: 'vatId',
          type: 'text',
          label: 'VAT (Value-added tax ID)',
          defaultValue: '125364362',
        },
        {
          name: 'frontOffice',
          type: 'text',
          label: 'Front Office',
          defaultValue: '+381 24 4873 057, +381 24 4875 157, +381 24 4875 197',
        },
        {
          name: 'commercialDepartment',
          type: 'text',
          label: 'Commercial Department',
          defaultValue: '+381 24 4873 887, +381 24 4874 987',
        },
        {
          name: 'cell',
          type: 'text',
          label: 'Cell',
          defaultValue: '+381 63 1057 668',
        },
        {
          name: 'email',
          type: 'email',
          label: 'Email',
          defaultValue: 'geneza@geneza.rs',
        },
      ],
    },
    {
      name: 'contacts',
      type: 'array',
      label: 'Contact Cards',
      minRows: 1,
      fields: [
        {
          name: 'avatar',
          type: 'upload',
          relationTo: 'media',
          required: true,
          localized: false,
        },
        {
          name: 'name',
          type: 'text',
          required: true,
          localized: true,
        },
        {
          name: 'position',
          type: 'text',
          required: true,
          localized: true,
        },
        {
          name: 'email',
          type: 'email',
          required: true,
        },
        {
          name: 'phone',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
}
