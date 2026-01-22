'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { loginAction, magicLinkAction, signInWithGoogle } from '@/lib/actions/auth'
import Link from 'next/link'
import { GoogleSignInButton, AuthDivider } from '@/components/auth/GoogleButton'

export default function LoginPage() {
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [mode, setMode] = useState<'password' | 'magic'>('password')
    const [success, setSuccess] = useState<string | null>(null)

    async function handleGoogleSignIn() {
        setLoading(true)
        setError(null)

        const result = await signInWithGoogle()

        if (result.error) {
            setError(result.error)
            setLoading(false)
        } else if (result.data?.url) {
            window.location.href = result.data.url
        }
    }

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
        <div className="min-h-screen flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md bg-[#18181B] border border-white/5 rounded-2xl p-8 shadow-2xl"
            >
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block mb-6">
                        <span className="text-2xl font-black italic tracking-tighter text-white">
                            POWER<span className="text-[#10B981]">TRACK</span>
                        </span>
                    </Link>
                    <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
                    <p className="text-zinc-400">
                        Sign in to continue to PowerTrack
                    </p>
                </div>

                {/* Google Sign In First */}
                <GoogleSignInButton
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    loading={loading}
                />

                <AuthDivider />

                {/* Mode Switcher */}
                <div className="flex gap-2 mb-6 p-1 bg-[#27272A] rounded-xl">
                    <button
                        type="button"
                        onClick={() => setMode('password')}
                        className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-bold transition-all ${mode === 'password'
                                ? 'bg-[#10B981] text-black shadow-lg'
                                : 'text-zinc-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        Password
                    </button>
                    <button
                        type="button"
                        onClick={() => setMode('magic')}
                        className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-bold transition-all ${mode === 'magic'
                                ? 'bg-[#10B981] text-black shadow-lg'
                                : 'text-zinc-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        Magic Link
                    </button>
                </div>

                {/* Password Login Form */}
                {mode === 'password' && (
                    <form action={handlePasswordLogin} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-bold text-zinc-400 mb-2">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="w-full px-4 py-3 bg-[#27272A] border border-white/5 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#10B981] transition-all placeholder:text-zinc-600"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-bold text-zinc-400 mb-2">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="w-full px-4 py-3 bg-[#27272A] border border-white/5 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#10B981] transition-all placeholder:text-zinc-600"
                                placeholder="••••••••"
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <Link
                                href="/forgot-password"
                                className="text-sm text-[#10B981] hover:text-[#059669] font-medium transition-colors"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm font-medium"
                            >
                                {error}
                            </motion.div>
                        )}

                        {success && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-4 bg-green-500/10 border border-green-500/50 rounded-xl text-green-400 text-sm font-medium"
                            >
                                {success}
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-[#10B981] text-black font-bold text-lg rounded-xl hover:bg-[#059669] transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide"
                        >
                            {loading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </form>
                )}

                {/* Magic Link Form */}
                {mode === 'magic' && (
                    <form action={handleMagicLink} className="space-y-6">
                        <div>
                            <label htmlFor="magic-email" className="block text-sm font-bold text-zinc-400 mb-2">
                                Email
                            </label>
                            <input
                                id="magic-email"
                                name="email"
                                type="email"
                                required
                                className="w-full px-4 py-3 bg-[#27272A] border border-white/5 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#10B981] transition-all placeholder:text-zinc-600"
                                placeholder="you@example.com"
                            />
                        </div>

                        <p className="text-sm text-zinc-400">
                            We&apos;ll send you a magic link to sign in without a password.
                        </p>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm font-medium"
                            >
                                {error}
                            </motion.div>
                        )}

                        {success && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-4 bg-green-500/10 border border-green-500/50 rounded-xl text-green-400 text-sm font-medium"
                            >
                                {success}
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-[#10B981] text-black font-bold text-lg rounded-xl hover:bg-[#059669] transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide"
                        >
                            {loading ? 'Sending...' : 'Send Magic Link'}
                        </button>
                    </form>
                )}

                {/* Sign Up Link */}
                <p className="mt-8 text-center text-sm text-zinc-400">
                    Don&apos;t have an account?{' '}
                    <Link
                        href="/signup"
                        className="text-[#10B981] hover:text-[#059669] font-bold transition-colors"
                    >
                        Sign up
                    </Link>
                </p>
            </motion.div>
        </div>
    )
}
