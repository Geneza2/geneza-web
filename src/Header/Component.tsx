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
import { NavbarSearch } from '@/components/NavbarSearch'

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
        <div className="hidden md:grid grid-cols-[minmax(240px,300px)_1fr_minmax(240px,300px)] items-center w-full gap-3 md:gap-4 lg:gap-6">
          <div className="flex items-center min-w-0">
            <Link className="flex items-center" href={`/${locale || 'en'}`}>
              <Logo />
            </Link>
          </div>
          <div className="flex flex-1 justify-center items-center min-w-0 px-2">
            <HeaderNav data={headerData} locale={locale} />
          </div>
          <div className="flex items-center justify-end gap-2 md:gap-3 lg:gap-4 min-w-0">
            <div className="w-full max-w-[220px] md:max-w-[260px] lg:max-w-[300px]">
              <NavbarSearch locale={locale} />
            </div>
            <div className="flex-shrink-0">
              <LanguageSwitcher />
            </div>
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
