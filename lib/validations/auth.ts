import { z } from 'zod'

/**
 * Login validation schema
 */
export const loginSchema = z.object({
    email: z.string()
        .min(1, 'Email is required')
        .email('Invalid email address'),
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
})

/**
 * Signup validation schema
 */
export const signupSchema = z.object({
    email: z.string()
        .min(1, 'Email is required')
        .email('Invalid email address'),
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
    full_name: z.string()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name must be less than 100 characters')
})

/**
 * Password reset validation schema
 */
export const resetPasswordSchema = z.object({
    email: z.string()
        .min(1, 'Email is required')
        .email('Invalid email address')
})

/**
 * New password validation schema
 */
export const newPasswordSchema = z.object({
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
})

// Export types
export type LoginInput = z.infer<typeof loginSchema>
export type SignupInput = z.infer<typeof signupSchema>
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
export type NewPasswordInput = z.infer<typeof newPasswordSchema>
