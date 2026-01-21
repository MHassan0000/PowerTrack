'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { signOutAction } from '@/lib/actions/auth'
import type { User } from '@supabase/supabase-js'

interface UserMenuProps {
    user: User | null
}

export function UserMenu({ user }: UserMenuProps) {
    const [isOpen, setIsOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)

    // If no user, show auth buttons
    if (!user) {
        return (
            <div className="flex items-center gap-3">
                <Link
                    href="/login"
                    className="px-4 py-2 text-sm font-medium text-[rgb(var(--foreground-secondary))] hover:text-[rgb(var(--primary))] transition-colors"
                >
                    Log in
                </Link>
                <Link
                    href="/signup"
                    className="px-6 py-2 text-sm font-medium bg-[rgb(var(--primary))] text-[rgb(var(--background))] rounded-lg hover:bg-[rgb(var(--primary-hover))] transition-all shadow-lg shadow-[rgb(var(--primary))]/20"
                >
                    Get Started
                </Link>
            </div>
        )
    }

    // Get initials from user metadata or email
    const getInitials = () => {
        const name = user.user_metadata?.full_name || user.email
        if (!name) return '??'

        const parts = name.split(' ')
        if (parts.length >= 2) {
            return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
        }
        return name.substring(0, 2).toUpperCase()
    }

    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isOpen])

    async function handleSignOut() {
        await signOutAction()
    }

    return (
        <div className="relative" ref={menuRef}>
            {/* User Avatar Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[rgb(var(--card-hover))] transition-colors"
            >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[rgb(var(--primary))] to-[rgb(var(--primary-hover))] flex items-center justify-center text-sm font-medium">
                    {getInitials()}
                </div>
                <div className="hidden md:flex flex-col items-start">
                    <span className="text-sm font-medium">
                        {user.user_metadata?.full_name || 'User'}
                    </span>
                    <span className="text-xs text-[rgb(var(--foreground-muted))]">
                        {user.email}
                    </span>
                </div>
                <svg
                    className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-56 rounded-lg glow-border bg-[rgb(var(--card))] backdrop-blur-xl shadow-xl overflow-hidden"
                    >
                        <div className="p-3 border-b border-[rgb(var(--border))]">
                            <p className="text-sm font-medium truncate">{user.email}</p>
                            <p className="text-xs text-[rgb(var(--foreground-muted))] mt-1">
                                {user.user_metadata?.full_name || 'PowerTrack User'}
                            </p>
                        </div>

                        <div className="p-2">
                            <Link
                                href="/dashboard"
                                onClick={() => setIsOpen(false)}
                                className="block px-3 py-2 text-sm rounded-md hover:bg-[rgb(var(--card-hover))] transition-colors"
                            >
                                📊 Dashboard
                            </Link>
                            <Link
                                href="/exercises"
                                onClick={() => setIsOpen(false)}
                                className="block px-3 py-2 text-sm rounded-md hover:bg-[rgb(var(--card-hover))] transition-colors"
                            >
                                💪 Exercises
                            </Link>
                            <Link
                                href="/workouts"
                                onClick={() => setIsOpen(false)}
                                className="block px-3 py-2 text-sm rounded-md hover:bg-[rgb(var(--card-hover))] transition-colors"
                            >
                                🏋️ Workouts
                            </Link>
                            <Link
                                href="/settings"
                                onClick={() => setIsOpen(false)}
                                className="block px-3 py-2 text-sm rounded-md hover:bg-[rgb(var(--card-hover))] transition-colors"
                            >
                                ⚙️ Settings
                            </Link>
                        </div>

                        <div className="p-2 border-t border-[rgb(var(--border))]">
                            <button
                                onClick={handleSignOut}
                                className="w-full px-3 py-2 text-sm text-left text-red-400 rounded-md hover:bg-red-500/10 transition-colors"
                            >
                                🚪 Sign Out
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
