import { TypedLocale } from 'payload'

export type Args = {
  params: Promise<{
    slug?: string
    locale: TypedLocale
  }>
}

export const languages = [
  { code: 'en', labelEn: 'English', labelRs: 'Engleski', flag: '/uk.svg' },
  { code: 'rs', labelEn: 'Serbian', labelRs: 'Srpski', flag: '/rs.svg' },
]
