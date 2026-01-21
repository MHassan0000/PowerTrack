'use client'

import { useEffect } from 'react'
import { AlertCircle } from 'lucide-react'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log error to error tracking service (e.g., Sentry)
        console.error('Error boundary caught:', error)
    }, [error])

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-[rgb(var(--card))] rounded-2xl p-8 glow-border text-center">
                <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
                    <AlertCircle className="w-8 h-8 text-red-500" />
                </div>

                <h2 className="text-2xl font-bold mb-2">Something went wrong!</h2>

                <p className="text-[rgb(var(--foreground-muted))] mb-6">
                    We encountered an unexpected error. Please try again.
                </p>

                <div className="flex gap-3">
                    <button
                        onClick={() => window.location.href = '/dashboard'}
                        className="flex-1 px-4 py-3 border border-[rgb(var(--border))] rounded-lg hover:bg-[rgb(var(--card-hover))] transition-colors font-medium"
                    >
                        Go to Dashboard
                    </button>
                    <button
                        onClick={reset}
                        className="flex-1 px-4 py-3 bg-[rgb(var(--primary))] text-[rgb(var(--background))] rounded-lg hover:bg-[rgb(var(--primary-hover))] transition-colors font-medium"
                    >
                        Try Again
                    </button>
                </div>

                {process.env.NODE_ENV === 'development' && (
                    <details className="mt-6 text-left">
                        <summary className="text-sm text-[rgb(var(--foreground-muted))] cursor-pointer">
                            Error Details (Development Only)
                        </summary>
                        <pre className="mt-2 p-4 bg-[rgb(var(--background-secondary))] rounded-lg text-xs overflow-auto">
                            {error.message}
                        </pre>
                    </details>
                )}
            </div>
        </div>
    )
}
