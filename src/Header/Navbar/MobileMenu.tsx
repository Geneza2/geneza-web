'use client'

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { Menu } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import type { Header as HeaderType, Media } from '@/payload-types'
import { Logo } from '@/components/Logo/Logo'
import { getImageUrl } from '@/utilities/getImageUrl'
import { getLinkHref } from '@/utilities/getLinkHref'
import { TypedLocale } from 'payload'
import { usePathname, useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import { useTransition, useState } from 'react'
import { languages } from '@/utilities/argumentTypes'

type MobileMenuProps = {
  data: HeaderType
  locale: TypedLocale
}

const MobileLanguageSwitcher: React.FC<{ onLanguageChange: () => void }> = ({
  onLanguageChange,
}) => {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [, startTransition] = useTransition()

  const pathSegments = pathname.split('/')
  const currentLocale =
    pathSegments[1] === 'en' || pathSegments[1] === 'rs' ? pathSegments[1] : locale

  const onSelectChange = (newLocale: string) => {
    if (newLocale === currentLocale) return

    startTransition(() => {
      const segments = pathname.split('/')
      segments[1] = newLocale

      const newPath = segments.join('/') || '/'
      const searchParams = window.location.search
      const finalPath = searchParams ? `${newPath}${searchParams}` : newPath
      router.replace(finalPath)
      onLanguageChange() // Close the mobile menu
    })
  }

  const placeholderText = currentLocale === 'rs' ? 'Jezik' : 'Language'
  const getLabel = (lang: (typeof languages)[0]) =>
    currentLocale === 'rs' ? lang.labelRs : lang.labelEn

  return (
    <div className="flex items-center gap-2">
      <Select onValueChange={onSelectChange} value={currentLocale}>
        <SelectTrigger className="w-full h-12 text-base px-4">
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
                <span>{getLabel(lang)}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ data, locale }) => {
  const navItems = data?.navItems || []
  const [isOpen, setIsOpen] = useState(false)

  const handleLanguageChange = () => {
    setIsOpen(false)
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button className="md:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-black/20 bg-transparent hover:bg-black/10 transition-colors">
          <Menu className="w-6 h-6 text-black" />
          <span className="sr-only">Open navigation menu</span>
        </button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-screen max-w-full p-0 overflow-y-auto max-h-screen bg-white"
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <Logo />
        </div>
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <SheetDescription className="sr-only">Main navigation links for the site</SheetDescription>
        <nav className="flex flex-col gap-4 p-4">
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={getLinkHref(item, locale)}
              className="relative w-full h-24 flex items-center justify-center font-bold text-2xl"
              onClick={() => setIsOpen(false)}
            >
              {(() => {
                const imageUrl = getImageUrl(item.image)
                return imageUrl && imageUrl !== '/noimg.svg' ? (
                  <Image
                    src={imageUrl}
                    alt={(item.image as Media)?.alt || item.link.label}
                    fill
                    className="rounded object-cover"
                  />
                ) : null
              })()}
              <div className="w-full h-full bg-black/25 z-10"></div>
              <span className="absolute text-white tracking-widest z-20">{item.link.label}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-border mt-auto">
          <div className="mb-2 text-sm font-medium text-muted-foreground">
            {locale === 'rs' ? 'Jezik' : 'Language'}
          </div>
          <MobileLanguageSwitcher onLanguageChange={handleLanguageChange} />
        </div>
      </SheetContent>
    </Sheet>
  )
}
