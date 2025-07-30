import { withPayload } from '@payloadcms/next/withPayload'
import createNextIntlPlugin from 'next-intl/plugin'
import redirects from './redirects.js'

const withNextIntl = createNextIntlPlugin('src/i18n/requests.ts')

// Scheduled revalidation for goods cache every 10 minutes
const setupGoodsRevalidation = () => {
  if (process.env.NODE_ENV === 'production') {
    setInterval(
      async () => {
        try {
          const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
            ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
            : process.env.__NEXT_PRIVATE_ORIGIN || 'http://localhost:3000'

          const response = await fetch(`${baseUrl}/api/revalidate-goods`)
          if (response.ok) {
            console.log('Scheduled goods revalidation completed successfully')
          } else {
            console.error('Scheduled goods revalidation failed:', response.statusText)
          }
        } catch (error) {
          console.error('Error during scheduled goods revalidation:', error)
        }
      },
      10 * 60 * 1000,
    )
  }
}

setupGoodsRevalidation()

const NEXT_PUBLIC_SERVER_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : undefined || process.env.__NEXT_PRIVATE_ORIGIN || 'http://localhost:3000'

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      ...[NEXT_PUBLIC_SERVER_URL /* 'https://example.com' */].map((item) => {
        const url = new URL(item)

        return {
          hostname: url.hostname,
          protocol: url.protocol.replace(':', ''),
        }
      }),
    ],
    unoptimized: process.env.NODE_ENV === 'development',
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  reactStrictMode: true,
  redirects,
}

export default withNextIntl(withPayload(nextConfig, { devBundleServerPackages: false }))
