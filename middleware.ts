import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Security middleware for all API routes and pages
 * Adds security headers and prevents access to sensitive files
 */
export function middleware(request: NextRequest) {
    const response = NextResponse.next()

    // Security Headers
    // Prevent MIME type sniffing
    response.headers.set('X-Content-Type-Options', 'nosniff')
    
    // Prevent clickjacking attacks
    response.headers.set('X-Frame-Options', 'DENY')
    
    // Enable XSS protection (legacy browsers)
    response.headers.set('X-XSS-Protection', '1; mode=block')
    
    // Control referrer information
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    
    // Prevent DNS rebinding attacks
    response.headers.set('X-DNS-Prefetch-Control', 'off')

    // Block access to environment files
    if (request.nextUrl.pathname.includes('.env')) {
        return new NextResponse('Not Found', { status: 404 })
    }

    // Block access to sensitive directories
    const blockedPaths = ['/node_modules', '/.git', '/.next/cache']
    for (const path of blockedPaths) {
        if (request.nextUrl.pathname.startsWith(path)) {
            return new NextResponse('Not Found', { status: 404 })
        }
    }

    return response
}

// Apply middleware to all routes except static files
export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder files
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
