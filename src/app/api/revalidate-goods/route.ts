import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'

export async function GET(request: NextRequest) {
  try {
    // Revalidate the goods page
    revalidatePath('/goods')
    revalidateTag('goods-sitemap')

    console.log('Goods cache revalidated at:', new Date().toISOString())

    return NextResponse.json({
      success: true,
      message: 'Goods cache revalidated',
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error revalidating goods cache:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to revalidate goods cache',
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
