export async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000,
): Promise<T> {
  let lastError: Error

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error as Error

      // Don't retry on certain types of errors
      if (error instanceof Error) {
        if (
          error.message.includes('404') ||
          error.message.includes('401') ||
          error.message.includes('403')
        ) {
          throw error
        }
      }

      if (attempt === maxRetries) {
        console.error(`Operation failed after ${maxRetries} attempts:`, lastError)
        throw lastError
      }

      console.warn(`Operation failed on attempt ${attempt}, retrying in ${delay}ms...`, error)
      await new Promise((resolve) => setTimeout(resolve, delay * attempt))
    }
  }

  throw lastError!
}
