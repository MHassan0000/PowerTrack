'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
    LayoutDashboard, 
    Dumbbell, 
    Zap, 
    TrendingUp, 
    Utensils, 
    Settings, 
    Menu, 
    X,
    LogOut,
    User
} from 'lucide-react'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const NAV_ITEMS = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Workouts', href: '/workouts', icon: Dumbbell },
    { label: 'Exercises', href: '/exercises', icon: Zap },
    { label: 'Progress', href: '/progress', icon: TrendingUp },
    { label: 'Nutrition', href: '/nutrition', icon: Utensils },
    { label: 'Settings', href: '/settings', icon: Settings },
]

export function Sidebar({ user }: { user: any }) {
    const pathname = usePathname()
    const router = useRouter()
    const [isMobileOpen, setIsMobileOpen] = useState(false)
    const supabase = createClient()

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push('/')
        router.refresh()
    }

    const initials = user?.email?.[0].toUpperCase() || 'U'

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-[#18181B] border-r border-white/5">
            {/* Logo */}
            <div className="p-6 border-b border-white/5">
                <Link href="/" onClick={() => setIsMobileOpen(false)} className="flex items-center gap-2">
                    <span className="text-2xl font-black italic tracking-tighter text-white">
                        POWER<span className="text-[#10B981]">TRACK</span>
                    </span>
                </Link>
            </div>

            {/* Nav Items */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
                    const Icon = item.icon
                    
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsMobileOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${
                                isActive 
                                    ? 'bg-[#10B981]/10 text-[#10B981]' 
                                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute left-0 w-1 h-6 bg-[#10B981] rounded-r-full"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                />
                            )}
                            <Icon className={`w-5 h-5 ${isActive ? 'text-[#10B981]' : 'text-zinc-500 group-hover:text-white'}`} />
                            <span className="font-medium text-sm">{item.label}</span>
                        </Link>
                    )
                })}
            </nav>

            {/* User Profile */}
            <div className="p-4 border-t border-white/5">
                <div className="bg-[#27272A] rounded-xl p-4 flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#10B981]/20 flex items-center justify-center text-[#10B981] font-bold border border-[#10B981]/30">
                            {initials}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold text-white truncate max-w-30">
                                {user?.user_metadata?.full_name || user?.email?.split('@')[0]}
                            </p>
                        
                        </div>
                    </div>
                    <button 
                        onClick={handleSignOut}
                        className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Sign Out"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    )

    return (
        <>
            {/* Desktop Sidebar */}
            <div className="hidden lg:block fixed top-0 left-0 bottom-0 w-72 z-40">
                <SidebarContent />
            </div>

            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#18181B]/90 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-4 z-40">
                <Link href="/dashboard">
                     <span className="text-xl font-black italic tracking-tighter text-white">
                        APEX<span className="text-[#10B981]">FITNESS</span>
                    </span>
                </Link>
                <button 
                    onClick={() => setIsMobileOpen(true)}
                    className="p-2 text-white bg-white/5 rounded-lg border border-white/10"
                >
                    <Menu className="w-6 h-6" />
                </button>
            </div>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isMobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileOpen(false)}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 lg:hidden"
                        />
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 left-0 bottom-0 w-[85%] max-w-[320px] z-50 lg:hidden shadow-2xl"
                        >
                            <SidebarContent />
                            <button 
                                onClick={() => setIsMobileOpen(false)}
                                className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}
