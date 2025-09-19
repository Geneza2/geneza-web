export async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000,
): Promise<T> {
  let lastError: Error

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const startTime = Date.now()
      const result = await operation()
      const endTime = Date.now()

      if (process.env.NODE_ENV === 'development') {
        console.log(`Operation succeeded in ${endTime - startTime}ms on attempt ${attempt}`)
      }

      return result
    } catch (error) {
      lastError = error as Error

      // Log the error for debugging
      console.error(`Attempt ${attempt} failed:`, {
        message: lastError.message,
        name: lastError.name,
        stack: process.env.NODE_ENV === 'development' ? lastError.stack : undefined,
      })

      // Don't retry on certain types of errors
      if (error instanceof Error) {
        if (
          error.message.includes('404') ||
          error.message.includes('401') ||
          error.message.includes('403') ||
          error.message.includes('ENOTFOUND') ||
          error.message.includes('ECONNREFUSED')
        ) {
          console.error('Non-retryable error:', error.message)
          throw error
        }
      }

      if (attempt === maxRetries) {
        console.error(`Operation failed after ${maxRetries} attempts:`, {
          finalError: lastError.message,
          errorType: lastError.name,
        })
        throw lastError
      }

      const waitTime = delay * attempt
      console.warn(`Retrying in ${waitTime}ms... (attempt ${attempt}/${maxRetries})`)
      await new Promise((resolve) => setTimeout(resolve, waitTime))
    }
  }

  throw lastError!
}
