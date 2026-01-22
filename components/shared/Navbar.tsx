'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { UserMenu } from './UserMenu'
import type { User } from '@supabase/supabase-js'
import { Menu, X } from 'lucide-react'

interface NavbarProps {
    user: User | null
}

const NAV_ITEMS = {
    public: [
        { label: 'Features', href: '#features' },
        { label: 'About', href: '#about' },
        { label: 'Philosophy', href: '#philosophy' },
        { label: 'Contact', href: '#contact' },
    ],
    private: [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Workouts', href: '/workouts' },
        { label: 'Exercises', href: '/exercises' },
        { label: 'Progress', href: '/progress' },
    ]
}

export default function Navbar({ user }: NavbarProps) {
    const pathname = usePathname()
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const { scrollY } = useScroll()

    const backgroundColor = useTransform(
        scrollY,
        [0, 100],
        ['rgba(10, 10, 15, 0)', 'rgba(5, 5, 5, 0.95)'] // Updated to match new dark theme
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

    const navLinks = user ? NAV_ITEMS.private : NAV_ITEMS.public

    return (
        <>
            <motion.nav
                style={{ backgroundColor }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-white/0 ${isScrolled ? 'backdrop-blur-xl shadow-lg border-white/5' : ''
                    }`}
            >
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo */}
                        <Link href={user ? '/dashboard' : '/'} className="flex items-center gap-2 relative z-50">
                            <motion.span
                                className="text-2xl font-black italic tracking-tighter glow-text py-2 pr-2"
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: 'spring', stiffness: 400 }}
                            >
                                POWER<span className="text-[rgb(var(--primary))]">TRACK</span>
                            </motion.span>
                        </Link>

                        {/* Desktop Nav Links */}
                        <div className="hidden md:flex items-center gap-8">
                            {navLinks.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`text-sm font-bold uppercase tracking-wider transition-colors ${pathname === item.href
                                        ? 'text-[rgb(var(--primary))]'
                                        : 'text-[rgb(var(--foreground-secondary))] hover:text-[rgb(var(--primary))]'
                                        }`}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>

                        {/* Auth Buttons / User Menu (Desktop) */}
                        <div className="hidden md:flex items-center gap-4">
                            {user ? (
                                <UserMenu user={user} />
                            ) : (
                                <div className="flex items-center gap-4">
                                    <Link
                                        href="/login"
                                        className="text-sm font-bold uppercase tracking-wider text-[rgb(var(--foreground))] hover:text-[rgb(var(--primary))] transition-colors"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href="/signup"
                                        className="px-6 py-2 text-sm font-bold uppercase tracking-wider bg-[rgb(var(--primary))] text-black rounded-sm hover:bg-[rgb(var(--primary-hover))] transition-all shadow-[0_0_20px_rgba(204,255,0,0.3)] hover:shadow-[0_0_30px_rgba(204,255,0,0.5)]"
                                    >
                                        Get Started
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Toggle */}
                        <button
                            className="md:hidden relative z-50 text-white"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? (
                                <X className="w-8 h-8" />
                            ) : (
                                <Menu className="w-8 h-8" />
                            )}
                        </button>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-40 bg-[rgb(var(--background))]/95 backdrop-blur-3xl pt-24 px-4 md:hidden flex flex-col items-center gap-8"
                    >
                        <div className="flex flex-col items-center gap-6 w-full">
                            {navLinks.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`text-2xl font-black uppercase italic tracking-tighter ${pathname === item.href
                                        ? 'text-[rgb(var(--primary))]'
                                        : 'text-white hover:text-[rgb(var(--primary))]'
                                        }`}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>

                        <div className="w-full h-[1px] bg-[rgb(var(--border))]" />

                        <div className="flex flex-col items-center gap-6 w-full">
                            {user ? (
                                <UserMenu user={user} />
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="text-xl font-bold uppercase tracking-wider text-[rgb(var(--foreground))] hover:text-[rgb(var(--primary))]"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href="/signup"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="w-full max-w-xs py-4 text-center text-lg font-bold uppercase tracking-wider bg-[rgb(var(--primary))] text-black rounded-sm shadow-[0_0_20px_rgba(204,255,0,0.3)]"
                                    >
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
