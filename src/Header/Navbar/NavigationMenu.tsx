'use client'

import { ListItem } from './ListItem'
import type { Header as HeaderType, Media } from '@/payload-types'
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
      <NavigationMenuList className="justify-center w-full gap-2 md:gap-3 lg:gap-4 flex-wrap">
        {navItems.map((item) => {
          const hasSubcategories = item.subcategories && item.subcategories.length > 0

          return (
            <NavigationMenuItem key={item.id}>
              {hasSubcategories ? (
                <>
                  <NavigationMenuTrigger className="bg-transparent hover:bg-white/20 text-black hover:text-black border-none shadow-none px-3">
                    <Link
                      href={getLinkHref(item, locale)}
                      className="flex items-center justify-center"
                    >
                      <span className="text-black hover:text-black transition-colors text-center">
                        {item.link.label}
                      </span>
                    </Link>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-2 grid-cols-2 md:grid-cols-3 grid-rows-3 w-[90vw] max-w-[800px]">
                      <li className="row-span-3 col-span-1">
                        <NavigationMenuLink
                          className="from-muted/50 to-muted flex flex-col justify-end rounded-md bg-linear-to-b no-underline outline-hidden select-none focus:shadow-md"
                          asChild
                        >
                          <div className="relative w-48 h-48 md:w-60 md:h-60 flex items-center justify-center overflow-hidden">
                            {(() => {
                              const imageUrl = getImageUrl(item.image)
                              return imageUrl && imageUrl !== '/noimg.svg' ? (
                                <Image
                                  src={imageUrl}
                                  alt={(item.image as Media)?.alt || item.link.label}
                                  fill
                                  className="rounded-xl object-cover"
                                />
                              ) : null
                            })()}
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
                </>
              ) : (
                <NavigationMenuLink
                  className="bg-transparent hover:bg-white/20 text-black hover:text-black border-none shadow-none px-3 py-2 rounded-md transition-colors font-medium"
                  asChild
                >
                  <Link
                    href={getLinkHref(item, locale)}
                    className="flex items-center justify-center"
                  >
                    <span className="text-black hover:text-black transition-colors text-center">
                      {item.link.label}
                    </span>
                  </Link>
                </NavigationMenuLink>
              )}
            </NavigationMenuItem>
          )
        })}
      </NavigationMenuList>
    </NavigationMenu>
  )
}
