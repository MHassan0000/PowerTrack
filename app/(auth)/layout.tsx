import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // Redirect logged-in users to dashboard
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
        redirect('/dashboard')
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[#0F0F10] relative">
            <Link
                href="/"
                className="absolute top-8 left-8 flex items-center gap-2 text-zinc-400 hover:text-white transition-colors font-medium"
            >
                <ArrowLeft className="w-5 h-5" />
                Back to Home
            </Link>
            <div className="w-full max-w-md">
                {children}
            </div>
        </div>
    )
}
