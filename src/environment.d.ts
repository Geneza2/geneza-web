declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PAYLOAD_SECRET: string
      PREVIEW_SECRET: string
      CRON_SECRET: string
      DATABASE_URI: string
      POSTGRES_URL: string
      BLOB_READ_WRITE_TOKEN: string
      NEXT_PUBLIC_SERVER_URL: string
      VERCEL_PROJECT_PRODUCTION_URL: string
      R2_BUCKET_NAME: string
      R2_ACCESS_KEY_ID: string
      R2_SECRET_ACCESS_KEY: string
      R2_ENDPOINT: string
      R2_PUBLIC_URL: string
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}
