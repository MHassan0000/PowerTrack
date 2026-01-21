/**
 * Error logging utility for production
 * Replace console.error with proper error tracking service
 */

export function logError(context: string, error: unknown) {
    // In production, send to error tracking service (e.g., Sentry)
    if (process.env.NODE_ENV === 'production') {
        // TODO: Implement Sentry or other error tracking
        // Sentry.captureException(error, { tags: { context } })
    } else {
        // Development: log to console
        console.error(`[${context}]`, error)
    }
}

/**
 * Safely get error message from unknown error
 */
export function getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
        return error.message
    }
    if (typeof error === 'string') {
        return error
    }
    return 'An unexpected error occurred'
}
