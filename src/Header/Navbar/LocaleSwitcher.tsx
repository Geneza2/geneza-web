'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import { useTransition } from 'react'
import Image from 'next/image'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { languages } from '@/utilities/argumentTypes'

export function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [, startTransition] = useTransition()

  const onSelectChange = (newLocale: string) => {
    if (newLocale === locale) return

    startTransition(() => {
      const segments = pathname.split('/')
      segments[1] = newLocale

      const newPath = segments.join('/') || '/'
      router.replace(newPath)
    })
  }

  const placeholderText = locale === 'rs' ? 'Jezik' : 'Language'
  const getLabel = (lang: (typeof languages)[0]) => (locale === 'rs' ? lang.labelRs : lang.labelEn)

  return (
    <div className="flex items-center">
      <Select onValueChange={onSelectChange} value={locale}>
        <SelectTrigger className="w-[80px] h-10 text-base px-4">
          <SelectValue placeholder={placeholderText} />
        </SelectTrigger>
        <SelectContent>
          {languages.map((lang) => (
            <SelectItem
              key={lang.code}
              value={lang.code}
              className="h-10 text-base pl-2 pr-8 [&>span:last-child]:right-2 [&>span:last-child]:left-auto"
            >
              <div className="flex items-center gap-2">
                <Image src={lang.flag} alt={getLabel(lang)} width={24} height={18} loading="lazy" />
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
