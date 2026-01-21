'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useEffect, useState } from 'react'
import { UserMenu } from './UserMenu'
import type { User } from '@supabase/supabase-js'

interface NavbarProps {
    user: User | null
}

export default function Navbar({ user }: NavbarProps) {
    const pathname = usePathname()
    const [isScrolled, setIsScrolled] = useState(false)
    const { scrollY } = useScroll()

    const backgroundColor = useTransform(
        scrollY,
        [0, 100],
        ['rgba(10, 10, 15, 0)', 'rgba(10, 10, 15, 0.95)']
    )

    useEffect(() => {
        const updateScroll = () => {
            setIsScrolled(window.scrollY > 10)
        }
        window.addEventListener('scroll', updateScroll)
        return () => window.removeEventListener('scroll', updateScroll)
    }, [])

    // Don't show navbar on auth pages
    if (pathname?.startsWith('/login') || pathname?.startsWith('/signup') || pathname?.startsWith('/forgot-password') || pathname?.startsWith('/reset-password')) {
        return null
    }

    return (
        <motion.nav
            style={{ backgroundColor }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'backdrop-blur-xl shadow-lg' : ''
                }`}
        >
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href={user ? '/dashboard' : '/'} className="flex items-center gap-2">
                        <motion.span
                            className="text-2xl font-bold glow-text"
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: 'spring', stiffness: 400 }}
                        >
                            PowerTrack
                        </motion.span>
                    </Link>

                    {/* Nav Links */}
                    <div className="hidden md:flex items-center gap-8">
                        {user ? (
                            // Authenticated navigation
                            <>
                                <Link
                                    href="/dashboard"
                                    className={`text-sm font-medium transition-colors ${pathname === '/dashboard'
                                        ? 'text-[rgb(var(--primary))]'
                                        : 'text-[rgb(var(--foreground-secondary))] hover:text-[rgb(var(--primary))]'
                                        }`}
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href="/workouts"
                                    className={`text-sm font-medium transition-colors ${pathname?.startsWith('/workouts')
                                        ? 'text-[rgb(var(--primary))]'
                                        : 'text-[rgb(var(--foreground-secondary))] hover:text-[rgb(var(--primary))]'
                                        }`}
                                >
                                    Workouts
                                </Link>
                                <Link
                                    href="/exercises"
                                    className={`text-sm font-medium transition-colors ${pathname?.startsWith('/exercises')
                                        ? 'text-[rgb(var(--primary))]'
                                        : 'text-[rgb(var(--foreground-secondary))] hover:text-[rgb(var(--primary))]'
                                        }`}
                                >
                                    Exercises
                                </Link>
                                <Link
                                    href="/progress"
                                    className={`text-sm font-medium transition-colors ${pathname === '/progress'
                                        ? 'text-[rgb(var(--primary))]'
                                        : 'text-[rgb(var(--foreground-secondary))] hover:text-[rgb(var(--primary))]'
                                        }`}
                                >
                                    Progress
                                </Link>
                            </>
                        ) : (
                            // Public navigation
                            <>
                                <a href="#features" className="text-sm font-medium text-[rgb(var(--foreground-secondary))] hover:text-[rgb(var(--primary))] transition-colors">
                                    Features
                                </a>
                                <a href="#how-it-works" className="text-sm font-medium text-[rgb(var(--foreground-secondary))] hover:text-[rgb(var(--primary))] transition-colors">
                                    How It Works
                                </a>
                            </>
                        )}
                    </div>

                    {/* Auth Buttons */}
                    {user ? (
                        <UserMenu user={user} />
                    ) : (
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
                    )}
                </div>
            </div>
        </motion.nav>
    )
}
