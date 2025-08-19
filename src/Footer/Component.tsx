import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'
import type { Footer as FooterType } from '@/payload-types'
import { getLinkHref } from '@/utilities/getLinkHref'
import { Logo } from '@/components/Logo/Logo'
import { TypedLocale } from 'payload'
import { Facebook, Instagram, Linkedin, MessageCircle, Mail, Phone, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'

type FooterProps = {
  locale: TypedLocale
}

export async function Footer({ locale }: FooterProps) {
  const currentLocale = locale ?? 'en'
  const footerData: FooterType = (await getCachedGlobal('footer', 0, currentLocale)()) || {}
  const footer = footerData

  const branding = footer?.branding || {}
  const contactInfo = footer?.contactInfo || {}
  const copyright = footer?.copyright || '©2025 Geneza. All rights reserved.'
  const navItems = footer?.navItems || []
  const sitemapSections = footer?.sitemapSections || []

  return (
    <footer className="bg-gray-100">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-3 space-y-6">
            <Link href={`/${currentLocale}`} className="inline-block">
              <Logo />
            </Link>

            <p className="text-sm text-muted-foreground max-w-xs">
              {branding.missionStatement ||
                'Our vision is to provide convenience and help increase your sales business.'}
            </p>

            <div className="flex space-x-3">
              {branding.socialMedia?.facebook && (
                <Button variant="outline" size="icon" asChild className="w-10 h-10 rounded-full">
                  <a
                    href={branding.socialMedia.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                </Button>
              )}
              {branding.socialMedia?.instagram && (
                <Button variant="outline" size="icon" asChild className="w-10 h-10 rounded-full">
                  <a
                    href={branding.socialMedia.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                </Button>
              )}
              {branding.socialMedia?.linkedin && (
                <Button variant="outline" size="icon" asChild className="w-10 h-10 rounded-full">
                  <a
                    href={branding.socialMedia.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                </Button>
              )}
              {branding.socialMedia?.tiktok && (
                <Button variant="outline" size="icon" asChild className="w-10 h-10 rounded-full">
                  <a
                    href={branding.socialMedia.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="TikTok"
                  >
                    <MessageCircle className="w-5 h-5" />
                  </a>
                </Button>
              )}
            </div>
          </div>

          <div className="lg:col-span-9">
            {sitemapSections && sitemapSections.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {sitemapSections.map((section: any, index: number) => (
                  <div key={index} className="space-y-4">
                    <h3 className="font-semibold text-lg border-b pb-2">{section.title}</h3>
                    <ul className="space-y-3">
                      {section.links?.map((linkItem: any, linkIndex: number) => {
                        const href = getLinkHref({ link: linkItem.link }, currentLocale)
                        return (
                          <li key={linkIndex}>
                            <Link
                              href={href}
                              className="text-sm text-muted-foreground hover:text-foreground transition-colors hover:underline"
                            >
                              {linkItem.link.label}
                            </Link>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">
                  {sitemapSections === undefined
                    ? 'Loading sitemap sections...'
                    : 'Please configure sitemap sections in the admin panel.'}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-gray-300 my-8" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <Mail className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium">Email</p>
              <p className="text-sm text-muted-foreground">
                {contactInfo.email || 'geneza@geneza.com'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <Phone className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium">Phone</p>
              <p className="text-sm text-muted-foreground">
                {contactInfo.phone || '+381 24 4874 987'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <MapPin className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium">Address</p>
              <p className="text-sm text-muted-foreground">
                {contactInfo.address || '24420 Kanjiža, Srbija Put Narodnih heroja 17'}
              </p>
            </div>
          </div>
        </div>

        {navItems && navItems.length > 0 && (
          <>
            <div className="border-t border-gray-300 mb-6" />
            <div className="flex flex-wrap justify-center gap-6 mb-6">
              {navItems.map((navItem: any, index: number) => {
                const href = getLinkHref({ link: navItem.link }, currentLocale)
                return (
                  <Link
                    key={index}
                    href={href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors hover:underline"
                  >
                    {navItem.link?.label || 'Unnamed link'}
                  </Link>
                )
              })}
            </div>
          </>
        )}

        <div className="border-t border-gray-300 mb-6" />
        <div className="text-center">
          <p className="text-sm text-muted-foreground">{copyright}</p>
        </div>
      </div>
    </footer>
  )
}
