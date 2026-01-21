import { createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const next = requestUrl.searchParams.get('next') ?? '/dashboard'
    const origin = requestUrl.origin

    if (!code) {
        return NextResponse.redirect(`${origin}/login?error=no_code`)
    }

    const cookieStore: { name: string; value: string; options: any }[] = []

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookies) {
                    cookies.forEach((cookie) => cookieStore.push(cookie))
                },
            },
        }
    )

    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error || !data.session) {
        return NextResponse.redirect(`${origin}/login?error=oauth_failed`)
    }

    await supabase.auth.setSession({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
    })

    const response = NextResponse.redirect(`${origin}${next}`)

    cookieStore.forEach(({ name, value, options }) => {
        response.cookies.set(name, value, options)
    })

    return response
}
