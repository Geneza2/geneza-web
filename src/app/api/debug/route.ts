import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const envCheck = {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL: process.env.VERCEL,
      VERCEL_ENV: process.env.VERCEL_ENV,
      VERCEL_URL: process.env.VERCEL_URL,
      VERCEL_PROJECT_PRODUCTION_URL: process.env.VERCEL_PROJECT_PRODUCTION_URL,
      POSTGRES_URL: !!process.env.POSTGRES_URL,
      BLOB_READ_WRITE_TOKEN: !!process.env.BLOB_READ_WRITE_TOKEN,
      PAYLOAD_SECRET: !!process.env.PAYLOAD_SECRET,
      PREVIEW_SECRET: !!process.env.PREVIEW_SECRET,
      CRON_SECRET: !!process.env.CRON_SECRET,
      NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL,
    }

    // Test database connection
    let dbStatus = 'unknown'
    try {
      const { getPayload } = await import('payload')
      const configPromise = await import('@payload-config')
      const payload = await getPayload({ config: configPromise.default })
      if (payload?.db?.connect) {
        await payload.db.connect()
        dbStatus = 'connected'
      } else {
        dbStatus = 'no_connection_method'
      }
    } catch (dbError) {
      dbStatus = `error: ${dbError instanceof Error ? dbError.message : 'Unknown error'}`
    }

    return NextResponse.json({
      status: 'ok',
      environment: envCheck,
      database: dbStatus,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
