// import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'
import type { Footer as FooterType } from '@/payload-types'
import { getLinkHref } from '@/utilities/getLinkHref'
import { Logo } from '@/components/Logo/Logo'
import { TypedLocale } from 'payload'
import { Facebook, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import SerbiaMap from '@/components/SerbiaMap'

type FooterProps = {
  locale: TypedLocale
}

export async function Footer({ locale }: FooterProps) {
  const currentLocale = locale ?? 'en'

  try {
    const payload = await getPayload({ config: configPromise })
    const footerData: FooterType = await payload.findGlobal({
      slug: 'footer',
      depth: 2,
      locale: currentLocale,
    })
    const footer = footerData

    const branding = footer?.branding || {}
    const contactInfo = footer?.contactInfo || {}
    const copyright = footer?.copyright || '©2025 Geneza. All rights reserved.'
    const navItems = footer?.navItems || []
    const sitemapSections = footer?.sitemapSections || []

    return (
      <footer className="bg-gray-50 text-gray-800 border-t-4 border-[#9BC273] w-full overflow-hidden">
        <div className="w-full max-w-none px-4 sm:px-6 lg:px-12 py-8 sm:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
            <div className="lg:col-span-3 space-y-6 sm:space-y-8">
              <Link href={`/${currentLocale}`} className="inline-block">
                <Logo />
              </Link>

              <p className="text-base sm:text-lg text-gray-700 leading-relaxed max-w-xs font-medium">
                {branding.missionStatement ||
                  (currentLocale === 'rs'
                    ? 'Naša vizija je da pružimo praktičnost i pomognemo u povećanju vašeg poslovnog prometa.'
                    : 'Our vision is to provide convenience and help increase your sales business.')}
              </p>

              <div className="flex space-x-4">
                {(!branding.socialMedia || Object.keys(branding.socialMedia).length === 0) && (
                  <p className="text-sm text-gray-500 italic">
                    {currentLocale === 'rs'
                      ? 'Dodajte društvene mreže u admin panelu'
                      : 'Add social media links in admin panel'}
                  </p>
                )}
                {branding.socialMedia?.facebook && (
                  <Button
                    variant="outline"
                    size="icon"
                    asChild
                    className="w-11 h-11 rounded-full border-gray-300 text-gray-600 hover:bg-[#9BC273] hover:text-white hover:border-[#9BC273] transition-all duration-300 hover:scale-110"
                  >
                    <a
                      href={branding.socialMedia.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Facebook"
                    >
                      <Facebook className="w-6 h-6" />
                    </a>
                  </Button>
                )}
                {branding.socialMedia?.instagram && (
                  <Button
                    variant="outline"
                    size="icon"
                    asChild
                    className="w-11 h-11 rounded-full border-gray-300 text-gray-600 hover:bg-[#9BC273] hover:text-white hover:border-[#9BC273] transition-all duration-300 hover:scale-110"
                  >
                    <a
                      href={branding.socialMedia.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram"
                    >
                      <Instagram className="w-6 h-6" />
                    </a>
                  </Button>
                )}
                {branding.socialMedia?.linkedin && (
                  <Button
                    variant="outline"
                    size="icon"
                    asChild
                    className="w-11 h-11 rounded-full border-gray-300 text-gray-600 hover:bg-[#9BC273] hover:text-white hover:border-[#9BC273] transition-all duration-300 hover:scale-110"
                  >
                    <a
                      href={branding.socialMedia.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LinkedIn"
                    >
                      <Linkedin className="w-6 h-6" />
                    </a>
                  </Button>
                )}
                {branding.socialMedia?.tiktok && (
                  <Button
                    variant="outline"
                    size="icon"
                    asChild
                    className="w-11 h-11 rounded-full border-gray-300 text-gray-600 hover:bg-[#9BC273] hover:text-white hover:border-[#9BC273] transition-all duration-300 hover:scale-110"
                  >
                    <a
                      href={branding.socialMedia.tiktok}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="TikTok"
                    >
                      <svg
                        className="w-6 h-6"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.35V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-.88-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                      </svg>
                    </a>
                  </Button>
                )}
              </div>
            </div>

            <div className="lg:col-span-9">
              {sitemapSections && sitemapSections.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {sitemapSections.map((section: any, index: number) => (
                    <div key={index} className="space-y-4">
                      <h3 className="font-bold text-xl text-green-800 pb-3">{section.title}</h3>
                      <ul className="space-y-3">
                        {section.links?.map((linkItem: any, linkIndex: number) => {
                          const href = getLinkHref({ link: linkItem.link }, currentLocale)
                          return (
                            <li key={linkIndex}>
                              <Link
                                href={href}
                                className="text-gray-600 hover:text-green-700 transition-all duration-300 hover:translate-x-1 inline-block"
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
                  <p className="text-gray-600">
                    {currentLocale === 'rs'
                      ? 'Molimo konfigurišite sekcije u admin panelu.'
                      : 'Please configure sitemap sections in the admin panel.'}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    {currentLocale === 'rs'
                      ? 'Idite na Admin → Globals → Footer → Sitemap Sections'
                      : 'Go to Admin → Globals → Footer → Sitemap Sections'}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-gray-200 my-6 sm:my-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8">
            <div className="flex items-center space-x-3 sm:space-x-4 group justify-center md:justify-start">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#9BC273] rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300 flex-shrink-0">
                <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-gray-800 text-base sm:text-lg">
                  {currentLocale === 'rs' ? 'E-mail' : 'Email'}
                </p>
                <a
                  href={`mailto:${contactInfo.email || 'geneza@geneza.com'}`}
                  className="text-gray-600 hover:text-[#9BC273] transition-colors font-medium text-sm sm:text-base break-words hover:underline"
                >
                  {contactInfo.email || 'geneza@geneza.com'}
                </a>
              </div>
            </div>

            <div className="flex items-center space-x-3 sm:space-x-4 group justify-center md:justify-start">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#9BC273] rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300 flex-shrink-0">
                <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-gray-800 text-base sm:text-lg">
                  {currentLocale === 'rs' ? 'Telefon' : 'Phone'}
                </p>
                <a
                  href={`tel:${contactInfo.phone || '+381 24 4874 987'}`}
                  className="text-gray-600 hover:text-[#9BC273] transition-colors font-medium text-sm sm:text-base break-words hover:underline"
                >
                  {contactInfo.phone || '+381 24 4874 987'}
                </a>
              </div>
            </div>

            <div className="flex items-center space-x-3 sm:space-x-4 group justify-center md:justify-start">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#9BC273] rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300 flex-shrink-0">
                <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-gray-800 text-base sm:text-lg">
                  {currentLocale === 'rs' ? 'Adresa' : 'Address'}
                </p>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(contactInfo.address || '24420 Kanjiža, Srbija Put Narodnih heroja 17')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-[#9BC273] transition-colors font-medium text-sm sm:text-base break-words hover:underline"
                >
                  {contactInfo.address || '24420 Kanjiža, Srbija Put Narodnih heroja 17'}
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200" />
          <SerbiaMap />

          <div className="border-t border-gray-200 mb-4 sm:mb-6" />
          <div className="text-center">
            <p className="text-gray-600 text-sm sm:text-base lg:text-lg">{copyright}</p>
          </div>
        </div>
      </footer>
    )
  } catch (error) {
    // Fallback footer with default content
    return (
      <footer className="bg-gray-50 text-gray-800 border-t-4 border-[#9BC273] w-full overflow-hidden">
        <div className="w-full max-w-none px-4 sm:px-6 lg:px-12 py-8 sm:py-12">
          <div className="text-center">
            <p className="text-gray-600 text-sm sm:text-base">
              {currentLocale === 'rs' ? 'Footer se učitava...' : 'Loading footer...'}
            </p>
          </div>
        </div>
      </footer>
    )
  }
}
