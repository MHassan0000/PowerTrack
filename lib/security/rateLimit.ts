/**
 * Simple in-memory rate limiter for API protection
 * Tracks request counts per user with automatic window reset
 * 
 * For production with multiple instances, consider using:
 * - Upstash Redis for distributed rate limiting
 * - Vercel Edge Config for global state
 */

interface RateLimitEntry {
    count: number
    resetTime: number
}

// Store request counts per user
const requestCounts = new Map<string, RateLimitEntry>()

/**
 * Check if user has exceeded rate limit
 * @param userId - User ID to check
 * @param maxRequests - Maximum requests allowed in window (default: 10)
 * @param windowMs - Time window in milliseconds (default: 60000 = 1 minute)
 * @returns true if request allowed, false if rate limited
 */
export function checkRateLimit(
    userId: string,
    maxRequests: number = 10,
    windowMs: number = 60000
): boolean {
    const now = Date.now()
    const userLimit = requestCounts.get(userId)

    // No previous requests or window expired - allow and reset
    if (!userLimit || now > userLimit.resetTime) {
        requestCounts.set(userId, {
            count: 1,
            resetTime: now + windowMs,
        })
        return true
    }

    // Limit exceeded - reject request
    if (userLimit.count >= maxRequests) {
        return false
    }

    // Within limit - increment and allow
    userLimit.count++
    return true
}

/**
 * Get remaining requests for a user (useful for headers)
 */
export function getRemainingRequests(
    userId: string,
    maxRequests: number = 10
): number {
    const userLimit = requestCounts.get(userId)
    if (!userLimit || Date.now() > userLimit.resetTime) {
        return maxRequests
    }
    return Math.max(0, maxRequests - userLimit.count)
}

/**
 * Cleanup old entries (run periodically to prevent memory leaks)
 */
export function cleanupRateLimits(): void {
    const now = Date.now()
    for (const [userId, entry] of requestCounts.entries()) {
        if (now > entry.resetTime) {
            requestCounts.delete(userId)
        }
    }
}

// Auto-cleanup every 5 minutes
if (typeof setInterval !== 'undefined') {
    setInterval(cleanupRateLimits, 5 * 60 * 1000)
}
