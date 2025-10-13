import type { Metadata } from 'next'
import React from 'react'
import { cn } from '@/utilities/ui'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import { AdminBar } from '@/components/AdminBar'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { NextIntlClientProvider } from 'next-intl'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { ServiceWorker } from '@/components/ServiceWorker'
import './globals.css'
import { TypedLocale } from 'payload'
import { draftMode } from 'next/headers'

type Args = {
  children: React.ReactNode
  params: Promise<{
    locale: TypedLocale
  }>
}

export default async function RootLayout({ children, params }: Args) {
  try {
    const resolvedParams = await params
    const { locale } = resolvedParams
    const { isEnabled } = await draftMode()

    return (
      <html
        className={cn(GeistSans.variable, GeistMono.variable)}
        lang={locale}
        suppressHydrationWarning
      >
        <head>
          <link href="/favicon.ico" rel="icon" sizes="32x32" />
          <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
          <link href="/manifest.json" rel="manifest" />
          <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
          <meta name="theme-color" content="#9BC273" />
          <meta name="color-scheme" content="light" />
          <meta name="robots" content="index, follow" />
          <meta name="googlebot" content="index, follow" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <meta name="apple-mobile-web-app-title" content="Geneza" />
          <link rel="apple-touch-icon" href="/favicon.svg" />
        </head>
        <body suppressHydrationWarning>
          <ServiceWorker />
          <NextIntlClientProvider>
            <div className="relative z-50">
              <AdminBar adminBarProps={{ preview: isEnabled }} />
              <Header locale={locale} />
            </div>
            <LivePreviewListener />
            <main>{children}</main>
            <Footer locale={locale} />
          </NextIntlClientProvider>
        </body>
      </html>
    )
  } catch (error) {
    console.error('Critical error in layout:', error)
    return (
      <html lang="en">
        <head>
          <title>Geneza - Error</title>
          <link href="/favicon.ico" rel="icon" sizes="32x32" />
        </head>
        <body>
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
              <p className="text-gray-600">Please try refreshing the page.</p>
            </div>
          </div>
        </body>
      </html>
    )
  }
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'https://localhost:3000'),
  openGraph: mergeOpenGraph(),
  twitter: {
    creator: 'geneza',
  },
}
