import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  try {
    const payload = await getPayload({ config: configPromise })
    const resolvedParams = await params
    const path = resolvedParams.path.join('/')

    // Find the media document by filename
    const result = await payload.find({
      collection: 'media',
      where: {
        or: [{ filename: { equals: path } }, { url: { contains: path } }],
      },
      limit: 1,
    })

    if (!result.docs[0]) {
      return new NextResponse('File not found', { status: 404 })
    }

    const media = result.docs[0]

    // If using Vercel Blob Storage, redirect to the blob URL
    if (media.url && media.url.startsWith('https://')) {
      return NextResponse.redirect(media.url)
    }

    // Fallback to a placeholder image or error
    return new NextResponse('Media not accessible', { status: 400 })
  } catch (error) {
    console.error('Error serving media file:', error)
    return new NextResponse('Internal server error', { status: 500 })
  }
}
