'use client'

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
  const containerRef = React.useRef<HTMLDivElement | null>(null)
  const leftRef = React.useRef<HTMLDivElement | null>(null)
  const centerRef = React.useRef<HTMLDivElement | null>(null)
  const rightRef = React.useRef<HTMLDivElement | null>(null)
  const [useMobile, setUseMobile] = React.useState(false)

  React.useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const calc = () => {
      const cw = el.clientWidth
      const lw = leftRef.current?.getBoundingClientRect().width || 0
      const rw = rightRef.current?.getBoundingClientRect().width || 0
      const gap = 16 // approximate grid gap
      const needed = lw + rw + gap * 2 + 320 // reserve ~320px for center menu minimal width
      // Also detect wrapping by comparing scrollHeight to clientHeight
      const wrapped = el.scrollHeight > el.clientHeight + 4
      setUseMobile(needed > cw || wrapped)
    }

    calc()
    const ro = new ResizeObserver(() => calc())
    ro.observe(el)
    window.addEventListener('resize', calc)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', calc)
    }
  }, [])

  if (useMobile) {
    return (
      <div className="flex items-center justify-between w-full" ref={containerRef}>
        <Link className="flex items-center" href={`/${locale || 'en'}`}>
          <Logo />
        </Link>
        <MobileMenu data={data} locale={locale} />
      </div>
    )
  }

  return (
    <div
      className="grid grid-cols-[minmax(200px,260px)_1fr_minmax(200px,300px)] items-center w-full gap-2 md:gap-3 lg:gap-5"
      ref={containerRef}
    >
      <div className="flex items-center min-w-0" ref={leftRef}>
        <Link className="flex items-center" href={`/${locale || 'en'}`}>
          <Logo />
        </Link>
      </div>
      <div className="flex flex-1 justify-center items-center min-w-0 px-1 md:px-2" ref={centerRef}>
        <HeaderNav data={data} locale={locale} />
      </div>
      <div className="flex items-center justify-end gap-2 md:gap-3 lg:gap-4 min-w-0" ref={rightRef}>
        <div className="w-full max-w-[200px] md:max-w-[240px] lg:max-w-[300px]">
          <NavbarSearch locale={locale} />
        </div>
        <div className="flex-shrink-0">
          <LanguageSwitcher />
        </div>
      </div>
    </div>
  )
}
