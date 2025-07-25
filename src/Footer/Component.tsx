// Footer.tsx
import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'
import type { Footer as FooterType } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'
import { TypedLocale } from 'payload'

type FooterProps = {
  locale: TypedLocale
}

export async function Footer({ locale }: FooterProps) {
  const footerData: FooterType = (await getCachedGlobal('footer', 1)()) || {}
  const navItems = footerData?.navItems || []

  return (
    <footer className="mt-auto border-t border-border bg-white text-black">
      <div className="container py-8 gap-8 flex flex-col md:flex-row md:justify-between">
        <Link className="flex items-center" href={`/${locale || 'en'}`}>
          <Logo />
        </Link>

        <div className="flex flex-col-reverse items-start md:flex-row gap-4 md:items-center">
          <nav className="flex flex-col md:flex-row gap-4">
            {navItems.map(({ link }, i) => (
              <CMSLink className="text-white" key={i} {...link} locale={locale || 'en'} />
            ))}
          </nav>
        </div>
      </div>
    </footer>
  )
}
