'use client'

import { User } from '@supabase/supabase-js'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserMenu } from './UserMenu'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

interface NavbarProps {
    user: User | null
}

const publicNav = [
    { name: 'Home', href: '/' },
    { name: 'Features', href: '/#features' },
    { name: 'About', href: '/#about' },
]

const dashboardNav = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Workouts', href: '/workouts' },
    { name: 'Progress', href: '/progress' },
    { name: 'Nutrition', href: '/nutrition' },
]

export function Navbar({ user }: NavbarProps) {
    const pathname = usePathname()
    const [scrolled, setScrolled] = useState(false)

    const navigation = user ? dashboardNav : publicNav

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? 'bg-[rgb(var(--background))]/80 backdrop-blur-xl border-b border-[rgb(var(--border))]'
                : 'bg-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href={user ? '/dashboard' : '/'} className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-linear-to-br from-[rgb(var(--primary))] to-[rgb(var(--primary-hover))] flex items-center justify-center font-bold text-sm">
                            PT
                        </div>
                        <span className="text-xl font-bold glow-text hidden sm:block">
                            PowerTrack
                        </span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center gap-8">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`text-sm font-medium transition-colors relative ${isActive
                                        ? 'text-[rgb(var(--primary))]'
                                        : 'text-[rgb(var(--foreground-secondary))] hover:text-[rgb(var(--primary))]'
                                        }`}
                                >
                                    {item.name}
                                    {isActive && (
                                        <motion.div
                                            layoutId="navbar-indicator"
                                            className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[rgb(var(--primary))]"
                                            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                        />
                                    )}
                                </Link>
                            )
                        })}
                    </div>

                    {/* User Menu */}
                    <UserMenu user={user} />
                </div>
            </div>
        </motion.nav>
    )
}
