

export function logError(context: string, error: unknown) {
    // In production, send to error tracking service (e.g., Sentry)
    if (process.env.NODE_ENV === 'production') {
       
    } else {
        // Development: log to console
        console.error(`[${context}]`, error)
    }
}


export function getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
        return error.message
    }
    if (typeof error === 'string') {
        return error
    }
    return 'An unexpected error occurred'
}
