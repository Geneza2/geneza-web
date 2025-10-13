import type { CollectionSlug, PayloadRequest } from 'payload'
import { getPayload } from 'payload'

import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

import configPromise from '@payload-config'
import { getServerSideURL } from '@/utilities/getURL'

export async function GET(
  req: {
    cookies: {
      get: (name: string) => {
        value: string
      }
    }
  } & Request,
): Promise<Response> {
  try {
    const payload = await getPayload({ config: configPromise })

    const { searchParams } = new URL(req.url)

    const path = searchParams.get('path')
    const collection = searchParams.get('collection') as CollectionSlug
    const slug = searchParams.get('slug')
    const previewSecret = searchParams.get('previewSecret')

    if (!process.env.PREVIEW_SECRET) {
      return new Response('Preview not configured', { status: 500 })
    }

    if (previewSecret !== process.env.PREVIEW_SECRET) {
      return new Response('You are not allowed to preview this page', { status: 403 })
    }

    if (!path || !collection || !slug) {
      return new Response('Insufficient search params', { status: 404 })
    }

    if (!path.startsWith('/')) {
      return new Response('This endpoint can only be used for relative previews', { status: 500 })
    }

    let user

    try {
      user = await payload.auth({
        req: req as unknown as PayloadRequest,
        headers: req.headers,
      })
    } catch (error) {
      payload.logger.error({ err: error }, 'Error verifying token for live preview')
      return new Response('You are not allowed to preview this page', { status: 403 })
    }

    const draft = await draftMode()

    if (!user) {
      draft.disable()
      return new Response('You are not allowed to preview this page', { status: 403 })
    }

    // You can add additional checks here to see if the user is allowed to preview this page

    draft.enable()

    // Ensure the path is properly formatted
    const cleanPath = path.startsWith('/') ? path : `/${path}`

    try {
      redirect(cleanPath)
    } catch (_error) {
      // If redirect fails, return a response with the redirect URL
      return Response.redirect(new URL(cleanPath, getServerSideURL()), 307)
    }
  } catch (error) {
    return new Response('Internal server error', { status: 500 })
  }
}
