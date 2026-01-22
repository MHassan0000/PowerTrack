'use client'

import { updatePasswordAction } from '@/lib/actions/auth'
import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function ResetPasswordPage() {
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        setError(null)

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

        const result = await updatePasswordAction(formData)

        if (result?.error) {
            setError(result.error)
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
                <h1 className="text-2xl font-bold text-white mb-2">Reset Password</h1>
                <p className="text-zinc-400">
                    Enter your new password below
                </p>
            </div>

            <form action={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="password" className="block text-sm font-bold text-zinc-400 mb-2">
                        New Password
                    </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        minLength={6}
                        className="w-full px-4 py-3 bg-[#27272A] border border-white/5 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#10B981] transition-all placeholder:text-zinc-600"
                        placeholder="••••••••"
                    />
                    <p className="text-xs text-zinc-500 mt-1 font-medium">
                        At least 6 characters
                    </p>
                </div>

                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-bold text-zinc-400 mb-2">
                        Confirm New Password
                    </label>
                    <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        required
                        minLength={6}
                        className="w-full px-4 py-3 bg-[#27272A] border border-white/5 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#10B981] transition-all placeholder:text-zinc-600"
                        placeholder="••••••••"
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
                    {loading ? 'Resetting...' : 'Reset Password'}
                </button>
            </form>
        </motion.div>
    )
}
