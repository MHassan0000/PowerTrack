import { createClient } from '@/lib/supabase/server'
import { getDashboardGoals } from '@/lib/actions/goals'
import { getDashboardStats, getFormattedDate, getGreeting } from '@/lib/actions/dashboard'
import { getWorkoutHistory } from '@/lib/actions/workout-sessions'
import { GoalCard } from '@/components/goals/GoalCard'
import Link from 'next/link'
import { Target, Activity, Flame, Timer, Dumbbell, TrendingUp, Calendar } from 'lucide-react'

export default async function DashboardContent() {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return null
    }

    // Fetch all data
    const [profileResult, goalsResult, statsResult, historyResult] = await Promise.all([
        supabase.from('users').select('*').eq('id', user.id).single(),
        getDashboardGoals(),
        getDashboardStats(),
        getWorkoutHistory(5),
    ])

    const profile = profileResult.data
    const goals = goalsResult.data || []
    const topGoals = goals.slice(0, 3)
    const stats = statsResult.data
    const recentWorkouts = historyResult.data || []

    const greeting = getGreeting()
    const formattedDate = getFormattedDate()

    // Format duration
    const formatDuration = (minutes: number) => {
        if (minutes < 60) return `${minutes}m`
        const hours = Math.floor(minutes / 60)
        const mins = minutes % 60
        return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
    }

    return (
        <div className="space-y-8 text-white">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight text-white mb-2">
                        {greeting}, {profile?.full_name?.split(' ')[0] || 'Athlete'}
                    </h1>
                    <p className="text-zinc-400">
                        {formattedDate}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Link 
                        href="/workouts"
                        className="bg-[#10B981] hover:bg-[#059669] text-black font-bold px-6 py-2.5 rounded-lg transition-colors flex items-center gap-2"
                    >
                        <span>+</span> New Workout
                    </Link>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-[#18181B] rounded-2xl p-6 border border-white/5 flex items-center justify-between group hover:border-[#10B981]/30 transition-colors">
                    <div>
                        <div className="w-10 h-10 rounded-full bg-[#10B981]/20 flex items-center justify-center text-[#10B981] mb-4">
                            <Dumbbell className="w-5 h-5" />
                        </div>
                        <p className="text-zinc-400 font-medium mb-1">Workouts This Week</p>
                        <h3 className="text-3xl font-bold text-white">{stats?.totalWorkoutsThisWeek || 0}</h3>
                    </div>
                </div>

                <div className="bg-[#18181B] rounded-2xl p-6 border border-white/5 flex items-center justify-between group hover:border-[#10B981]/30 transition-colors">
                    <div>
                        <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500 mb-4">
                            <Flame className="w-5 h-5" />
                        </div>
                        <p className="text-zinc-400 font-medium mb-1">Calories Burned</p>
                        <h3 className="text-3xl font-bold text-white">{stats?.caloriesBurned || 0} <span className="text-base font-normal text-zinc-500">kcal</span></h3>
                    </div>
                </div>

                <div className="bg-[#18181B] rounded-2xl p-6 border border-white/5 flex items-center justify-between group hover:border-[#10B981]/30 transition-colors">
                    <div>
                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500 mb-4">
                            <Timer className="w-5 h-5" />
                        </div>
                        <p className="text-zinc-400 font-medium mb-1">Active Time</p>
                        <h3 className="text-3xl font-bold text-white">{formatDuration(stats?.totalDurationMinutes || 0)}</h3>
                    </div>
                </div>

                <div className="bg-[#18181B] rounded-2xl p-6 border border-white/5 flex items-center justify-between group hover:border-[#10B981]/30 transition-colors">
                    <div>
                        <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-500 mb-4">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                        <p className="text-zinc-400 font-medium mb-1">Total Volume</p>
                        <h3 className="text-3xl font-bold text-white">{Math.round(stats?.totalVolumeKg || 0).toLocaleString()} <span className="text-base font-normal text-zinc-500">kg</span></h3>
                    </div>
                </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-[#18181B] rounded-2xl p-6 border border-white/5">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-[#10B981]" />
                            <h3 className="text-zinc-400 font-bold text-xs uppercase tracking-widest">Recent Workouts</h3>
                        </div>
                        <Link href="/workouts" className="text-[#10B981] text-sm font-medium hover:underline">
                            View All
                        </Link>
                    </div>
                    
                    {recentWorkouts.length > 0 ? (
                        <div className="space-y-4">
                            {recentWorkouts.map((workout: any) => (
                                <div key={workout.id} className="flex items-center justify-between p-4 bg-[#27272A] rounded-xl hover:bg-[#3F3F46] transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-[#10B981]/20 flex items-center justify-center text-[#10B981]">
                                            <Dumbbell className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white">{workout.workout_name}</h4>
                                            <p className="text-sm text-zinc-500">
                                                {workout.total_sets} sets • {workout.total_reps} reps • {Math.round(workout.total_volume_kg || 0)} kg
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-zinc-300">
                                            {formatDuration(Math.round((workout.duration_seconds || 0) / 60))}
                                        </p>
                                        <p className="text-xs text-zinc-500">
                                            {new Date(workout.completed_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 rounded-full bg-[#10B981]/10 flex items-center justify-center mx-auto mb-4 text-[#10B981]">
                                <Dumbbell className="w-8 h-8" />
                            </div>
                            <p className="text-zinc-400">No workouts yet. Start your first session!</p>
                            <Link 
                                href="/workouts" 
                                className="inline-block mt-4 px-6 py-2 bg-[#10B981] text-black font-bold rounded-lg hover:bg-[#059669] transition-colors"
                            >
                                Browse Workouts
                            </Link>
                        </div>
                    )}
                </div>

                {/* Quick Stats Card */}
                <div className="bg-[#18181B] rounded-2xl p-6 border border-white/5">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-2 h-2 rounded-full bg-[#10B981]" />
                        <h3 className="text-zinc-400 font-bold text-xs uppercase tracking-widest">This Week</h3>
                    </div>
                    
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <span className="text-zinc-400">Total Sets</span>
                            <span className="text-xl font-bold text-white">{stats?.totalSets || 0}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-zinc-400">Total Reps</span>
                            <span className="text-xl font-bold text-white">{stats?.totalReps || 0}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-zinc-400">Streak</span>
                            <span className="text-xl font-bold text-[#10B981] flex items-center gap-2">
                                {stats?.streakDays || 0} days <Flame className="w-4 h-4 fill-current" />
                            </span>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/5">
                        <Link 
                            href="/progress" 
                            className="w-full block text-center py-3 bg-[#27272A] hover:bg-[#3F3F46] text-white font-medium rounded-xl transition-colors"
                        >
                            View Progress
                        </Link>
                    </div>
                </div>
            </div>

            {/* Active Goals Section */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-[#10B981]" />
                        <h3 className="text-zinc-400 font-bold text-xs uppercase tracking-widest">Active Goals</h3>
                    </div>
                    <Link href="/goals" className="text-[#10B981] text-sm font-medium hover:underline">
                        Manage Goals
                    </Link>
                </div>
                
                {topGoals.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {topGoals.map((goal: any, index: number) => (
                            <GoalCard
                                key={goal.id}
                                goal={goal}
                                index={index}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-[#18181B] border border-white/5 rounded-2xl">
                        <div className="w-16 h-16 rounded-full bg-[#10B981]/10 flex items-center justify-center mx-auto mb-4 text-[#10B981]">
                            <Target className="w-8 h-8" />
                        </div>
                        <p className="text-zinc-400 mb-4">No active goals yet. Set your first goal!</p>
                        <Link 
                            href="/goals" 
                            className="inline-block px-6 py-2 bg-[#10B981] text-black font-bold rounded-lg hover:bg-[#059669] transition-colors"
                        >
                            Create Goal
                        </Link>
                    </div>
                )}
            </div>

        </div>
    )
}
