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

      return result
    } catch (error) {
      lastError = error as Error

      // Don't retry on certain types of errors
      if (error instanceof Error) {
        if (
          error.message.includes('404') ||
          error.message.includes('401') ||
          error.message.includes('403') ||
          error.message.includes('ENOTFOUND') ||
          error.message.includes('ECONNREFUSED')
        ) {
          throw error
        }
      }

      if (attempt === maxRetries) {
        throw lastError
      }

      const waitTime = delay * attempt
      await new Promise((resolve) => setTimeout(resolve, waitTime))
    }
  }

  throw lastError!
}
