import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const origin = requestUrl.origin

    if (code) {
        const supabase = await createClient()

        // Exchange the code for a session
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (error) {
            console.error('Auth callback error:', error)
            // Redirect to login with error
            return NextResponse.redirect(new URL('/login?error=auth_failed', origin))
        }

        // Successful authentication - redirect to dashboard
        return NextResponse.redirect(new URL('/dashboard', origin))
    }

    // No code present, redirect to login
    return NextResponse.redirect(new URL('/login?error=no_code', origin))
}
