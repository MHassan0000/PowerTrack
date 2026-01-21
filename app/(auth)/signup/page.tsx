'use client'

import { signupAction } from '@/lib/actions/auth'
import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function SignupPage() {
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        setError(null)
        setSuccess(null)

        // Validate password confirmation
        const password = formData.get('password') as string
        const confirmPassword = formData.get('confirmPassword') as string

        if (password !== confirmPassword) {
            setError('Passwords do not match')
            setLoading(false)
            return
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters')
            setLoading(false)
            return
        }

        const result = await signupAction(formData)

        if (result?.error) {
            setError(result.error)
            setLoading(false)
        } else if (result?.success) {
            setSuccess(result.message)
            setLoading(false)
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glow-border bg-[rgb(var(--card))] backdrop-blur-xl rounded-2xl p-8 shadow-2xl"
        >
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold glow-text mb-2">Get Started</h1>
                <p className="text-[rgb(var(--foreground-muted))]">
                    Create your PowerTrack account
                </p>
            </div>

            {success ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-4"
                >
                    <div className="p-4 bg-green-500/10 border border-green-500/50 rounded-lg text-center">
                        <div className="text-4xl mb-2">✅</div>
                        <p className="text-green-400 font-medium mb-2">{success}</p>
                        <p className="text-sm text-[rgb(var(--foreground-muted))]">
                            Click the link in your email to verify your account and get started.
                        </p>
                    </div>

                    <Link
                        href="/auth/login"
                        className="block w-full py-3 text-center bg-[rgb(var(--primary))] text-[rgb(var(--background))] font-medium rounded-lg hover:bg-[rgb(var(--primary-hover))] transition-all shadow-lg shadow-[rgb(var(--primary))]/20"
                    >
                        Go to Login
                    </Link>
                </motion.div>
            ) : (
                <form action={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="fullName" className="block text-sm font-medium mb-2">
                            Full Name
                        </label>
                        <input
                            id="fullName"
                            name="fullName"
                            type="text"
                            className="w-full px-4 py-3 bg-[rgb(var(--background-secondary))] border border-[rgb(var(--border))] rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))] transition-all"
                            placeholder="John Doe"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-2">
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            className="w-full px-4 py-3 bg-[rgb(var(--background-secondary))] border border-[rgb(var(--border))] rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))] transition-all"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium mb-2">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            minLength={6}
                            className="w-full px-4 py-3 bg-[rgb(var(--background-secondary))] border border-[rgb(var(--border))] rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))] transition-all"
                            placeholder="••••••••"
                        />
                        <p className="text-xs text-[rgb(var(--foreground-muted))] mt-1">
                            At least 6 characters
                        </p>
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                            Confirm Password
                        </label>
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            required
                            minLength={6}
                            className="w-full px-4 py-3 bg-[rgb(var(--background-secondary))] border border-[rgb(var(--border))] rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))] transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm"
                        >
                            {error}
                        </motion.div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-[rgb(var(--primary))] text-[rgb(var(--background))] font-medium rounded-lg hover:bg-[rgb(var(--primary-hover))] transition-all shadow-lg shadow-[rgb(var(--primary))]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Creating account...' : 'Create account'}
                    </button>
                </form>
            )}

            {!success && (
                <div className="mt-6 text-center text-sm">
                    <span className="text-[rgb(var(--foreground-muted))]">
                        Already have an account?{' '}
                    </span>
                    <Link
                        href="/auth/login"
                        className="text-[rgb(var(--primary))] hover:underline font-medium"
                    >
                        Sign in
                    </Link>
                </div>
            )}
        </motion.div>
    )
}
