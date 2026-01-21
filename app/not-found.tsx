import Link from 'next/link'
import { Home } from 'lucide-react'

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-[rgb(var(--card))] rounded-2xl p-8 glow-border text-center">
                <div className="text-6xl font-bold text-[rgb(var(--primary))] mb-4">404</div>

                <h2 className="text-2xl font-bold mb-2">Page Not Found</h2>

                <p className="text-[rgb(var(--foreground-muted))] mb-6">
                    The page you're looking for doesn't exist or has been moved.
                </p>

                <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[rgb(var(--primary))] text-[rgb(var(--background))] rounded-lg hover:bg-[rgb(var(--primary-hover))] transition-colors font-medium"
                >
                    <Home className="w-5 h-5" />
                    Go to Dashboard
                </Link>
            </div>
        </div>
    )
}
