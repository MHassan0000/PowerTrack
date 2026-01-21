'use client'

import { resetPasswordAction } from '@/lib/actions/auth'
import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function ForgotPasswordPage() {
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        setError(null)
        setSuccess(null)

        const result = await resetPasswordAction(formData)

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
                <h1 className="text-3xl font-bold glow-text mb-2">Forgot Password?</h1>
                <p className="text-[rgb(var(--foreground-muted))]">
                    We&apos;ll send you a link to reset your password
                </p>
            </div>

            {success ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-4"
                >
                    <div className="p-4 bg-green-500/10 border border-green-500/50 rounded-lg text-center">
                        <div className="text-4xl mb-2">📧</div>
                        <p className="text-green-400 font-medium mb-2">{success}</p>
                        <p className="text-sm text-[rgb(var(--foreground-muted))]">
                            Check your email and click the link to reset your password.
                        </p>
                    </div>

                    <Link
                        href="/auth/login"
                        className="block w-full py-3 text-center bg-[rgb(var(--primary))] text-[rgb(var(--background))] font-medium rounded-lg hover:bg-[rgb(var(--primary-hover))] transition-all shadow-lg shadow-[rgb(var(--primary))]/20"
                    >
                        Back to Login
                    </Link>
                </motion.div>
            ) : (
                <form action={handleSubmit} className="space-y-6">
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
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>

                    <Link
                        href="/auth/login"
                        className="block text-center text-sm text-[rgb(var(--primary))] hover:underline"
                    >
                        ← Back to Login
                    </Link>
                </form>
            )}
        </motion.div>
    )
}
