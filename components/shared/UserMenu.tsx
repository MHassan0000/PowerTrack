'use client'

import { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface UserMenuProps {
    user: User | null
}

export function UserMenu({ user }: UserMenuProps) {
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)

    const handleSignOut = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        router.push('/auth/login')
        router.refresh()
    }

    if (!user) {
        return (
            <div className="flex items-center gap-3">
                <a
                    href="/login"
                    className="px-4 py-2 text-sm font-medium text-[rgb(var(--foreground-secondary))] hover:text-[rgb(var(--primary))] transition-colors"
                >
                    Log in
                </a>
                <a
                    href="/signup"
                    className="px-6 py-2 text-sm font-medium bg-[rgb(var(--primary))] text-[rgb(var(--background))] rounded-lg hover:bg-[rgb(var(--primary-hover))] transition-all shadow-lg shadow-[rgb(var(--primary))]/20"
                >
                    Get Started
                </a>
            </div>
        )
    }

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-[rgb(var(--card))] transition-colors"
            >
                <div className="w-8 h-8 rounded-full bg-linear-to-br from-[rgb(var(--primary))] to-[rgb(var(--primary-hover))] flex items-center justify-center text-sm font-bold">
                    {user.email?.[0].toUpperCase()}
                </div>
                <span className="text-sm font-medium hidden md:block">
                    {user.email}
                </span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-10"
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute right-0 mt-2 w-56 z-20 glow-border bg-[rgb(var(--card))] backdrop-blur-xl rounded-lg shadow-xl overflow-hidden"
                        >
                            <div className="p-4 border-b border-[rgb(var(--border))]">
                                <p className="text-sm font-medium truncate">{user.email}</p>
                                <p className="text-xs text-[rgb(var(--foreground-muted))] mt-1">
                                    Manage your account
                                </p>
                            </div>
                            <div className="p-2">
                                <a
                                    href="/dashboard"
                                    className="block px-4 py-2 text-sm rounded-md hover:bg-[rgb(var(--card-hover))] transition-colors"
                                >
                                    Dashboard
                                </a>
                                <a
                                    href="/settings"
                                    className="block px-4 py-2 text-sm rounded-md hover:bg-[rgb(var(--card-hover))] transition-colors"
                                >
                                    Settings
                                </a>
                                <button
                                    onClick={handleSignOut}
                                    className="w-full text-left px-4 py-2 text-sm text-red-400 rounded-md hover:bg-[rgb(var(--card-hover))] transition-colors"
                                >
                                    Sign out
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}
