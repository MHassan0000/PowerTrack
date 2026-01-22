import { createClient } from '@/lib/supabase/server'
import { ProfileCard } from '@/components/shared/ProfileCard'
import { getDashboardGoals } from '@/lib/actions/goals'
import { GoalCard } from '@/components/goals/GoalCard'
import Link from 'next/link'
import { Target, Activity, Flame, Timer } from 'lucide-react'

export default async function DashboardContent() {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return null
    }

    // Fetch user profile and goals
    const [profileResult, goalsResult] = await Promise.all([
        supabase.from('users').select('*').eq('id', user.id).single(),
        getDashboardGoals(),
    ])

    const profile = profileResult.data
    const goals = goalsResult.data || []
    const topGoals = goals.slice(0, 3)

    return (
        <div className="space-y-8 text-white">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight text-white mb-2">
                        Good evening, {profile?.full_name?.split(' ')[0] || 'Athlete'}
                    </h1>
                    <p className="text-zinc-400">
                        Friday, October 27th
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="bg-[#10B981] hover:bg-[#059669] text-black font-bold px-6 py-2.5 rounded-lg transition-colors flex items-center gap-2">
                        <span>+</span> Quick Log
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Daily Goal Card - Left Column */}
                <div className="bg-[#18181B] rounded-2xl p-6 border border-white/5 relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-6">
                        <h3 className="text-zinc-400 font-medium">Daily Goal</h3>
                        <div className="bg-[#10B981]/10 text-[#10B981] text-xs font-bold px-3 py-1 rounded-full">
                            +12% vs yesterday
                        </div>
                    </div>
                    
                    <div className="relative z-10 flex flex-col items-center py-8">
                        <div className="w-48 h-48 rounded-full border-8 border-[#10B981] flex items-col justify-center items-center relative">
                            <div className="text-center">
                                <span className="text-4xl font-bold block text-white">2,150</span>
                                <span className="text-zinc-500 text-xs uppercase tracking-wider font-bold">Points</span>
                            </div>
                        </div>
                    </div>

                    <div className="text-center mt-4">
                        <p className="text-zinc-400 text-sm mb-6">
                            You're crushing it today. Just 350 more points to hit your daily target.
                        </p>
                        <button className="w-full bg-[#27272A] hover:bg-[#3F3F46] text-white font-medium py-3 rounded-xl transition-colors">
                            View Breakdown
                        </button>
                    </div>
                </div>

                {/* Performance Trends - Right Column (Span 2) */}
                <div className="lg:col-span-2 bg-[#18181B] rounded-2xl p-6 border border-white/5 flex flex-col h-105">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h3 className="text-zinc-400 font-medium mb-1">Performance Trends</h3>
                            <h2 className="text-2xl font-bold text-white">Volume Lifted</h2>
                        </div>
                        <div className="flex gap-2">
                            {['1W', '1M', '3M', '1Y'].map((period) => (
                                <button
                                    key={period}
                                    className={`px-3 py-1 rounded-lg text-sm font-medium ${period === '1W' ? 'bg-[#27272A] text-white' : 'text-zinc-500 hover:text-white'}`}
                                >
                                    {period}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Placeholder Graph Area */}
                    <div className="flex-1 w-full bg-linear-to-t from-[#10B981]/10 to-transparent relative rounded-xl border-dashed border border-white/5 flex items-end overflow-hidden">
                        <svg className="w-full h-full absolute bottom-0" viewBox="0 0 100 50" preserveAspectRatio="none">
                            <path d="M0 50 C 20 40, 40 45, 60 20 S 80 10, 100 15 V 50 H 0 Z" fill="url(#gradient)" />
                            <defs>
                                <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                                    <stop offset="0%" stopColor="#10B981" stopOpacity="0.4" />
                                    <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            <path d="M0 50 C 20 40, 40 45, 60 20 S 80 10, 100 15" fill="none" stroke="#10B981" strokeWidth="0.5" />
                        </svg>
                    </div>
                    
                    <div className="flex justify-between text-zinc-500 text-xs font-medium uppercase mt-4 px-2">
                        <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                    </div>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#18181B] rounded-2xl p-6 border border-white/5 flex items-center justify-between group hover:border-[#10B981]/30 transition-colors">
                    <div>
                        <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500 mb-4">
                            <Flame className="w-5 h-5" />
                        </div>
                        <p className="text-zinc-400 font-medium mb-1">Calories Burned</p>
                        <h3 className="text-3xl font-bold text-white">840 <span className="text-base font-normal text-zinc-500">kcal</span></h3>
                    </div>
                    <div className="w-12 h-12 rounded-full border-4 border-[#10B981] border-t-transparent animate-spin-slow" />
                </div>

                <div className="bg-[#18181B] rounded-2xl p-6 border border-white/5 flex items-center justify-between group hover:border-[#10B981]/30 transition-colors">
                    <div>
                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500 mb-4">
                            <Timer className="w-5 h-5" />
                        </div>
                        <p className="text-zinc-400 font-medium mb-1">Active Duration</p>
                        <h3 className="text-3xl font-bold text-white">1h 20m <span className="text-base font-normal text-zinc-500">total</span></h3>
                    </div>
                    <div className="w-12 h-12 rounded-full border-4 border-[#10B981] border-r-transparent animate-spin-slow" />
                </div>

                <div className="bg-[#18181B] rounded-2xl p-6 border border-white/5 flex items-center justify-between group hover:border-[#10B981]/30 transition-colors">
                    <div>
                        <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 mb-4">
                            <Activity className="w-5 h-5" />
                        </div>
                        <p className="text-zinc-400 font-medium mb-1">Avg Heart Rate</p>
                        <h3 className="text-3xl font-bold text-white">120 <span className="text-base font-normal text-zinc-500">bpm</span></h3>
                    </div>
                    <Activity className="w-12 h-8 text-red-500/50" />
                </div>
            </div>

            {/* Active Goals Section */}
            <div>
                 <div className="flex items-center gap-3 mb-6">
                    <div className="w-2 h-2 rounded-full bg-[#10B981]" />
                    <h3 className="text-zinc-400 font-bold text-xs uppercase tracking-widest">Active Goals</h3>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {topGoals.map((goal: any, index: number) => (
                        <GoalCard
                            key={goal.id}
                            goal={goal}
                            index={index}
                        />
                    ))}
                 </div>
            </div>
        </div>
    )
}
