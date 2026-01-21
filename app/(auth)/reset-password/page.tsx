'use client'

import { updatePasswordAction } from '@/lib/actions/auth'
import { useState } from 'react'
import { motion } from 'framer-motion'

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
            className="glow-border bg-[rgb(var(--card))] backdrop-blur-xl rounded-2xl p-8 shadow-2xl"
        >
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold glow-text mb-2">Reset Password</h1>
                <p className="text-[rgb(var(--foreground-muted))]">
                    Enter your new password below
                </p>
            </div>

            <form action={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="password" className="block text-sm font-medium mb-2">
                        New Password
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
                        Confirm New Password
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
                    {loading ? 'Resetting...' : 'Reset Password'}
                </button>
            </form>
        </motion.div>
    )
}
