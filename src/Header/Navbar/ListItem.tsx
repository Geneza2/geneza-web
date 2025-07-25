'use client'

import React from 'react'
import Link from 'next/link'
import { NavigationMenuLink } from '@/components/ui/navigation-menu'
type ListItemProps = React.ComponentPropsWithoutRef<'li'> & {
  title: string
  href: string
  children: React.ReactNode
}

export const ListItem: React.FC<ListItemProps> = ({ title, href, children, ...props }) => {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link href={href} className="block space-y-1">
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="text-sm leading-snug text-muted-foreground line-clamp-2">{children}</p>
        </Link>
      </NavigationMenuLink>
    </li>
  )
}
