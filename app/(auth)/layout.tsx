import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    // Redirect to dashboard if user is already logged in
    if (user) {
        redirect('/dashboard')
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                {children}
            </div>
        </div>
    )
}
