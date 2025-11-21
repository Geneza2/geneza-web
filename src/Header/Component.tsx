import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'
import { HeaderBar } from './HeaderBar'
import type { Header as HeaderType } from '@/payload-types'
import { TypedLocale } from 'payload'

type HeaderProps = {
  locale: TypedLocale
}

export async function Header({ locale }: HeaderProps) {
  const headerData: HeaderType = await getCachedGlobal('header', 3, locale ?? 'en')()

  return (
    <header
      className="w-full px-3 py-3 md:px-6 lg:px-10 bg-white/70 backdrop-blur-md relative z-10 border-b border-[#9BC273]/30"
      id="main-header"
      role="banner"
      aria-label="Main navigation"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-[#9BC273]/5 via-[#17323E]/3 to-[#9BC273]/5"></div>
      <div className="relative z-10">
        <HeaderBar data={headerData} locale={locale} />
      </div>
    </header>
  )
}
