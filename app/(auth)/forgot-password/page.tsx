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
            className="w-full max-w-md bg-[#18181B] border border-white/5 rounded-2xl p-8 shadow-2xl"
        >
            <div className="text-center mb-8">
                <Link href="/" className="inline-block mb-6">
                    <span className="text-2xl font-black italic tracking-tighter text-white">
                        POWER<span className="text-[#10B981]">TRACK</span>
                    </span>
                </Link>
                <h1 className="text-2xl font-bold text-white mb-2">Forgot Password?</h1>
                <p className="text-zinc-400">
                    We&apos;ll send you a link to reset your password
                </p>
            </div>

            {success ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-4"
                >
                    <div className="p-6 bg-[#10B981]/10 border border-[#10B981]/20 rounded-xl text-center">
                        <div className="text-4xl mb-4">📧</div>
                        <p className="text-[#10B981] font-bold text-lg mb-2">{success}</p>
                        <p className="text-sm text-zinc-400 leading-relaxed">
                            Check your email and click the link to reset your password.
                        </p>
                    </div>

                    <Link
                        href="/login"
                        className="block w-full py-4 text-center bg-[#10B981] text-black font-bold text-lg rounded-xl hover:bg-[#059669] transition-all uppercase tracking-wide"
                    >
                        Back to Login
                    </Link>
                </motion.div>
            ) : (
                <form action={handleSubmit} className="space-y-6">
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

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm font-medium"
                        >
                            {error}
                        </motion.div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-[#10B981] text-black font-bold text-lg rounded-xl hover:bg-[#059669] transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide"
                    >
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>

                    <Link
                        href="/login"
                        className="block text-center text-sm text-[#10B981] hover:text-[#059669] font-bold transition-colors"
                    >
                        ← Back to Login
                    </Link>
                </form>
            )}
        </motion.div>
    )
}
