'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export function RedirectToAuth() {
    const router = useRouter()
    const searchParams = useSearchParams()

    useEffect(() => {
        const code = searchParams.get('code')

        // If there's an OAuth code in the URL, redirect to callback handler
        if (code) {
            // Clean URL and let server-side handle the exchange
            router.replace('/')
        }
    }, [searchParams, router])

    return null
}
