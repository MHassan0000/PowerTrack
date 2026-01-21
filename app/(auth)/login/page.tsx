'use client'

import { loginAction, magicLinkAction } from '@/lib/actions/auth'
import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function LoginPage() {
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [mode, setMode] = useState<'password' | 'magic'>('password')

    async function handlePasswordLogin(formData: FormData) {
        setLoading(true)
        setError(null)
        setSuccess(null)

        const result = await loginAction(formData)

        if (result?.error) {
            setError(result.error)
            setLoading(false)
        }
    }

    async function handleMagicLink(formData: FormData) {
        setLoading(true)
        setError(null)
        setSuccess(null)

        const result = await magicLinkAction(formData)

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
                <h1 className="text-3xl font-bold glow-text mb-2">Welcome Back</h1>
                <p className="text-[rgb(var(--foreground-muted))]">
                    Sign in to continue to PowerTrack
                </p>
            </div>

            {/* Mode Switcher */}
            <div className="flex gap-2 mb-6 p-1 bg-[rgb(var(--background-secondary))] rounded-lg">
                <button
                    type="button"
                    onClick={() => setMode('password')}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${mode === 'password'
                            ? 'bg-[rgb(var(--primary))] text-[rgb(var(--background))]'
                            : 'text-[rgb(var(--foreground-muted))] hover:text-[rgb(var(--foreground))]'
                        }`}
                >
                    Password
                </button>
                <button
                    type="button"
                    onClick={() => setMode('magic')}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${mode === 'magic'
                            ? 'bg-[rgb(var(--primary))] text-[rgb(var(--background))]'
                            : 'text-[rgb(var(--foreground-muted))] hover:text-[rgb(var(--foreground))]'
                        }`}
                >
                    Magic Link
                </button>
            </div>

            {/* Password Login Form */}
            {mode === 'password' && (
                <form action={handlePasswordLogin} className="space-y-6">
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
                            className="w-full px-4 py-3 bg-[rgb(var(--background-secondary))] border border-[rgb(var(--border))] rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))] transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <Link
                            href="/auth/forgot-password"
                            className="text-sm text-[rgb(var(--primary))] hover:underline"
                        >
                            Forgot password?
                        </Link>
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

                    {success && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-3 bg-green-500/10 border border-green-500/50 rounded-lg text-green-400 text-sm"
                        >
                            {success}
                        </motion.div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-[rgb(var(--primary))] text-[rgb(var(--background))] font-medium rounded-lg hover:bg-[rgb(var(--primary-hover))] transition-all shadow-lg shadow-[rgb(var(--primary))]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Signing in...' : 'Sign in'}
                    </button>
                </form>
            )}

            {/* Magic Link Form */}
            {mode === 'magic' && (
                <form action={handleMagicLink} className="space-y-6">
                    <div>
                        <label htmlFor="magic-email" className="block text-sm font-medium mb-2">
                            Email
                        </label>
                        <input
                            id="magic-email"
                            name="email"
                            type="email"
                            required
                            className="w-full px-4 py-3 bg-[rgb(var(--background-secondary))] border border-[rgb(var(--border))] rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))] transition-all"
                            placeholder="you@example.com"
                        />
                    </div>

                    <p className="text-sm text-[rgb(var(--foreground-muted))]">
                        We&apos;ll send you a magic link to sign in without a password.
                    </p>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm"
                        >
                            {error}
                        </motion.div>
                    )}

                    {success && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-3 bg-green-500/10 border border-green-500/50 rounded-lg text-green-400 text-sm"
                        >
                            {success}
                        </motion.div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-[rgb(var(--primary))] text-[rgb(var(--background))] font-medium rounded-lg hover:bg-[rgb(var(--primary-hover))] transition-all shadow-lg shadow-[rgb(var(--primary))]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Sending...' : 'Send Magic Link'}
                    </button>
                </form>
            )}

            <div className="mt-6 text-center text-sm">
                <span className="text-[rgb(var(--foreground-muted))]">
                    Don&apos;t have an account?{' '}
                </span>
                <Link
                    href="/auth/signup"
                    className="text-[rgb(var(--primary))] hover:underline font-medium"
                >
                    Sign up
                </Link>
            </div>
        </motion.div>
    )
}
