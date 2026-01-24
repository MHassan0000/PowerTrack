export interface ValidationResult {
    valid: boolean
    error?: string
}

/**
 * Validate chat message content
 * Checks for empty messages, length limits, and suspicious patterns
 */
export function validateChatMessage(content: unknown): ValidationResult {
    // Type check
    if (typeof content !== 'string') {
        return { valid: false, error: 'Message must be a string' }
    }

    // Trim whitespace
    const trimmed = content.trim()

    // Check if empty
    if (trimmed.length === 0) {
        return { valid: false, error: 'Message cannot be empty' }
    }

    // Check minimum length (prevent spam)
    if (trimmed.length < 1) {
        return { valid: false, error: 'Message too short' }
    }

    // Check maximum length (prevent abuse and high costs)
    if (trimmed.length > 4000) {
        return { valid: false, error: 'Message too long (maximum 4000 characters)' }
    }

    // Check for potentially malicious patterns
    // Prevent script injection attempts
    const suspiciousPatterns = [
        /<script[^>]*>.*?<\/script>/gi,
        /javascript:/gi,
        /on\w+\s*=/gi, // onerror=, onclick=, etc.
        /<iframe/gi,
    ]

    for (const pattern of suspiciousPatterns) {
        if (pattern.test(trimmed)) {
            return { valid: false, error: 'Invalid message content detected' }
        }
    }

    return { valid: true }
}


export function validateMessageArray(messages: unknown): ValidationResult {
    // Check if array
    if (!Array.isArray(messages)) {
        return { valid: false, error: 'Messages must be an array' }
    }

    // Check if empty
    if (messages.length === 0) {
        return { valid: false, error: 'At least one message is required' }
    }

    // Check maximum number of messages (prevent excessive context)
    if (messages.length > 50) {
        return { valid: false, error: 'Too many messages (maximum 50)' }
    }

    // Validate each message
    for (let i = 0; i < messages.length; i++) {
        const msg = messages[i]

        // Check message structure
        if (!msg || typeof msg !== 'object') {
            return { valid: false, error: `Invalid message format at position ${i}` }
        }

        // Check required fields
        if (!msg.role || !msg.content) {
            return { valid: false, error: `Message at position ${i} missing required fields` }
        }

        // Validate role
        if (!['user', 'assistant', 'system'].includes(msg.role)) {
            return { valid: false, error: `Invalid role at position ${i}` }
        }

        // Validate content
        const contentValidation = validateChatMessage(msg.content)
        if (!contentValidation.valid) {
            return {
                valid: false,
                error: `Message at position ${i}: ${contentValidation.error}`,
            }
        }
    }

    return { valid: true }
}

export function validateRole(role: unknown): ValidationResult {
    if (typeof role !== 'string') {
        return { valid: false, error: 'Role must be a string' }
    }

    if (!['user', 'assistant'].includes(role)) {
        return { valid: false, error: 'Invalid role (must be "user" or "assistant")' }
    }

    return { valid: true }
}


export function sanitizeString(input: string): string {
    return input
        .replace(/[<>]/g, '') // Remove angle brackets
        .replace(/javascript:/gi, '') // Remove javascript: protocol
        .trim()
}
