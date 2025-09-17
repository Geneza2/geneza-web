// Header.tsx
import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'
import { HeaderNav } from './Navbar/NavigationMenu'
import { MobileMenu } from './Navbar/MobileMenu'
import { Logo } from '@/components/Logo/Logo'
import type { Header as HeaderType } from '@/payload-types'
import Link from 'next/link'
import { TypedLocale } from 'payload'
import { LanguageSwitcher } from './Navbar/LocaleSwitcher'

type HeaderProps = {
  locale: TypedLocale
}

export async function Header({ locale }: HeaderProps) {
  const headerData: HeaderType = await getCachedGlobal('header', 3, locale ?? 'en')()

  return (
    <header
      className="w-full p-4 lg:px-12 bg-white/95 backdrop-blur-md relative z-10 border-b border-[#9BC273]/30"
      id="main-header"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-[#9BC273]/5 via-[#17323E]/3 to-[#9BC273]/5"></div>
      <div className="relative z-10">
        <div className="hidden md:flex items-center justify-between w-full">
          <div className="flex items-center w-[120px] min-w-[120px]">
            <Link className="flex items-center" href={`/${locale || 'en'}`}>
              <Logo />
            </Link>
          </div>
          <div className="flex flex-1 justify-center">
            <HeaderNav data={headerData} locale={locale} />
          </div>
          <div className="flex items-center justify-end w-[120px] min-w-[120px]">
            <LanguageSwitcher />
          </div>
        </div>
        <div className="flex md:hidden items-center justify-between w-full">
          <Link className="flex items-center" href={`/${locale || 'en'}`}>
            <Logo />
          </Link>
          <MobileMenu data={headerData} locale={locale} />
        </div>
      </div>
    </header>
  )
}
