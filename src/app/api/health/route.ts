import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function GET() {
  try {
    const startTime = Date.now()
    const payload = await getPayload({ config: configPromise })

    // Test database connection
    const pagesResult = await payload.find({
      collection: 'pages',
      limit: 1,
      overrideAccess: false,
    })

    const positionsResult = await payload.find({
      collection: 'openPositions',
      limit: 1,
      overrideAccess: false,
    })

    const productsResult = await payload.find({
      collection: 'products',
      limit: 1,
      overrideAccess: false,
    })

    const endTime = Date.now()

    return NextResponse.json({
      status: 'healthy',
      database: 'connected',
      queryTime: `${endTime - startTime}ms`,
      collections: {
        pages: pagesResult.totalDocs,
        openPositions: positionsResult.totalDocs,
        products: productsResult.totalDocs,
      },
      environment: process.env.NODE_ENV,
      hasConnectionString: !!process.env.POSTGRES_URL,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      {
        status: 'error',
        database: 'disconnected',
        error: errorMessage,
        environment: process.env.NODE_ENV,
        hasConnectionString: !!process.env.POSTGRES_URL,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
