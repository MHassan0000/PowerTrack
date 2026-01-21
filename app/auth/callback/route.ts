import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

/**
 * Auth callback handler for email confirmations and magic links
 * This route is called after user clicks email confirmation or magic link
 */
export async function GET(request: Request) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const next = requestUrl.searchParams.get('next') ?? '/dashboard'

    if (code) {
        const cookieStore = await cookies()
        const supabase = await createClient()

        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error) {
            // Redirect to the specified next URL or dashboard
            return NextResponse.redirect(new URL(next, request.url))
        }
    }

    // If there's an error or no code, redirect to login with error
    return NextResponse.redirect(new URL('/login?error=auth_callback_error', request.url))
}
