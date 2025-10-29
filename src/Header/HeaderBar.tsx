import React from 'react'
import type { Header as HeaderType } from '@/payload-types'
import { TypedLocale } from 'payload'
import Link from 'next/link'
import { Logo } from '@/components/Logo/Logo'
import { HeaderNav } from './Navbar/NavigationMenu'
import { NavbarSearch } from '@/components/NavbarSearch'
import { LanguageSwitcher } from './Navbar/LocaleSwitcher'
import { MobileMenu } from './Navbar/MobileMenu'

type Props = {
  data: HeaderType
  locale: TypedLocale
}

export const HeaderBar: React.FC<Props> = ({ data, locale }) => {
  return (
    <>
      {/* Mobile Layout - Hidden on large screens */}
      <div
        className="flex items-center justify-between w-full nav:hidden transition-all duration-300 ease-in-out"
        role="navigation"
        aria-label="Mobile navigation"
      >
        <Link
          className="flex items-center"
          href={`/${locale || 'en'}`}
          aria-label="Geneza home page"
        >
          <Logo />
        </Link>
        <MobileMenu data={data} locale={locale} />
      </div>

      {/* Desktop Layout - Hidden on mobile */}
      <nav
        className="hidden nav:grid grid-cols-[minmax(200px,260px)_1fr_minmax(200px,300px)] items-center w-full gap-2 md:gap-3 lg:gap-5 transition-all duration-300 ease-in-out"
        aria-label="Desktop navigation"
      >
        <div className="flex items-center min-w-0">
          <Link
            className="flex items-center"
            href={`/${locale || 'en'}`}
            aria-label="Geneza home page"
          >
            <Logo />
          </Link>
        </div>
        <div className="flex flex-1 justify-center items-center min-w-0 px-1 md:px-2">
          <HeaderNav data={data} locale={locale} />
        </div>
        <div className="flex items-center justify-end gap-2 md:gap-3 lg:gap-4 min-w-0">
          <div className="w-full max-w-[200px] md:max-w-[240px] lg:max-w-[300px]">
            <NavbarSearch locale={locale} />
          </div>
          <div className="flex-shrink-0">
            <LanguageSwitcher />
          </div>
        </div>
      </nav>
    </>
  )
}
