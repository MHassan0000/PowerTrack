'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { loginSchema, signupSchema, resetPasswordSchema, newPasswordSchema } from '@/lib/validations/auth'

/**
 * Sign in with email and password
 */
export async function loginAction(formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const validation = loginSchema.safeParse({ email, password })
    if (!validation.success) {
        const errors = validation.error.flatten().fieldErrors
        return { error: errors.email?.[0] || errors.password?.[0] || 'Invalid input' }
    }

    const supabase = await createClient()
    const { error } = await supabase.auth.signInWithPassword({
        email: validation.data.email,
        password: validation.data.password
    })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard')
}

/**
 * Sign up with email and password
 */
export async function signupAction(formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const full_name = formData.get('fullName') as string

    const validation = signupSchema.safeParse({ email, password, full_name })
    if (!validation.success) {
        const errors = validation.error.flatten().fieldErrors
        return { error: errors.email?.[0] || errors.password?.[0] || errors.full_name?.[0] || 'Invalid input' }
    }

    const supabase = await createClient()
    const origin = (await headers()).get('origin')

    const { error } = await supabase.auth.signUp({
        email: validation.data.email,
        password: validation.data.password,
        options: {
            data: { full_name: validation.data.full_name },
            emailRedirectTo: `${origin}/auth/callback`
        }
    })

    if (error) {
        return { error: error.message }
    }

    return {
        success: true,
        message: 'Check your email to confirm your account!'
    }
}

/**
 * Send magic link for passwordless login
 */
export async function magicLinkAction(formData: FormData) {
    const email = formData.get('email') as string

    const validation = resetPasswordSchema.safeParse({ email })
    if (!validation.success) {
        return { error: validation.error.flatten().fieldErrors.email?.[0] || 'Invalid email' }
    }

    const supabase = await createClient()
    const origin = (await headers()).get('origin')

    const { error } = await supabase.auth.signInWithOtp({
        email: validation.data.email,
        options: { emailRedirectTo: `${origin}/auth/callback` }
    })

    if (error) {
        return { error: error.message }
    }

    return {
        success: true,
        message: 'Check your email for the magic link!',
    }
}

/**
 * Send password reset email
 */
export async function resetPasswordAction(formData: FormData) {
    const supabase = await createClient()
    const origin = (await headers()).get('origin')

    const email = formData.get('email') as string

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/reset-password`,
    })

    if (error) {
        return { error: error.message }
    }

    return {
        success: true,
        message: 'Check your email for the password reset link!',
    }
}

/**
 * Update password (after reset)
 */
export async function updatePasswordAction(formData: FormData) {
    const supabase = await createClient()

    const password = formData.get('password') as string

    const { error } = await supabase.auth.updateUser({
        password,
    })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard')
}

/**
 * Sign out
 */
export async function signOutAction() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    revalidatePath('/', 'layout')
    redirect('/')
}

/**
 * Resend email confirmation
 */
export async function resendConfirmationAction(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string

    const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
    })

    if (error) {
        return { error: error.message }
    }

    return {
        success: true,
        message: 'Confirmation email sent!',
    }
}

/**
 * Sign in with Google OAuth
 */
export async function signInWithGoogle() {
    const supabase = await createClient()
    const origin = (await headers()).get('origin') || 'http://localhost:3000'

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${origin}/auth/callback`,
        },
    })

    if (error) {
        return { error: error.message }
    }

    return { data, error: null }
}

