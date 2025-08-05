'use client'

import { ListItem } from './ListItem'
import type { Header as HeaderType } from '@/payload-types'
import { getImageUrl } from '@/utilities/getImageUrl'
import { getLinkHref } from '@/utilities/getLinkHref'
import Link from 'next/link'
import Image from 'next/image'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import { TypedLocale } from 'payload'

type HeaderNavProps = {
  data: HeaderType
  locale: TypedLocale
}

export const HeaderNav: React.FC<HeaderNavProps> = ({ data, locale }) => {
  const navItems = data?.navItems || []

  return (
    <NavigationMenu>
      <NavigationMenuList className="justify-center w-full">
        {navItems.map((item) => (
          <NavigationMenuItem key={item.id}>
            <NavigationMenuTrigger className="bg-transparent hover:bg-white/20 text-black hover:text-black border-none shadow-none">
              <Link
                href={getLinkHref(item, locale)}
                className="text-black hover:text-black transition-colors"
              >
                {item.link.label}
              </Link>
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-2 grid-cols-3 grid-rows-3 w-[800px]">
                <li className="row-span-3 col-span-1">
                  <NavigationMenuLink
                    className="from-muted/50 to-muted flex flex-col justify-end rounded-md bg-linear-to-b no-underline outline-hidden select-none focus:shadow-md"
                    asChild
                  >
                    <div className="relative w-60 h-60 flex items-center justify-center overflow-hidden">
                      <Image
                        src={getImageUrl(item.image)}
                        alt={item.link.label}
                        fill
                        className="rounded-xl object-cover"
                      />
                    </div>
                  </NavigationMenuLink>
                </li>
                {item.subcategories?.map((sub, index) => {
                  const href =
                    typeof sub.link === 'string'
                      ? sub.link
                      : sub.link
                        ? getLinkHref({ link: sub.link }, locale)
                        : '#'

                  return (
                    <ListItem key={index} title={sub.label} href={href}>
                      {sub.description}
                    </ListItem>
                  )
                })}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  )
}
