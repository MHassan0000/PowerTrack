import { createClient } from '@/lib/supabase/server'
import { ProfileCard } from '@/components/shared/ProfileCard'
import { getDashboardGoals } from '@/lib/actions/goals'
import { GoalCard } from '@/components/goals/GoalCard'
import Link from 'next/link'
import { Target } from 'lucide-react'

export default async function DashboardPage() {
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
        <div className="space-y-8">
            {/* Profile Card */}
            {profile && <ProfileCard profile={profile} />}

            {/* Welcome Header */}
            <div className="glow-border bg-[rgb(var(--card))] backdrop-blur-xl rounded-2xl p-8">
                <h1 className="text-4xl font-bold glow-text mb-2">
                    Welcome back, {profile?.full_name || user?.email?.split('@')[0]}!
                </h1>
                <p className="text-[rgb(var(--foreground-muted))] text-lg">
                    Ready to crush your fitness goals today?
                </p>
            </div>

            {/* Active Goals Section */}
            {topGoals.length > 0 && (
                <div className="glow-border bg-[rgb(var(--card))] backdrop-blur-xl rounded-2xl p-8">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <Target className="w-6 h-6 text-[rgb(var(--primary))]" />
                            <h2 className="text-2xl font-bold">Active Goals</h2>
                        </div>
                        <Link
                            href="/goals"
                            className="text-[rgb(var(--primary))] hover:underline font-medium"
                        >
                            View all →
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {topGoals.map((goal: any, index: number) => (
                            <GoalCard
                                key={goal.id}
                                goal={goal}
                                index={index}
                                compact
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glow-border bg-[rgb(var(--card))] backdrop-blur-xl rounded-xl p-6">
                    <div className="text-[rgb(var(--foreground-muted))] text-sm font-medium mb-2">
                        Total Workouts
                    </div>
                    <div className="text-4xl font-bold text-[rgb(var(--primary))]">0</div>
                </div>

                <div className="glow-border bg-[rgb(var(--card))] backdrop-blur-xl rounded-xl p-6">
                    <div className="text-[rgb(var(--foreground-muted))] text-sm font-medium mb-2">
                        Active Days
                    </div>
                    <div className="text-4xl font-bold text-[rgb(var(--primary))]">0</div>
                </div>

                <div className="glow-border bg-[rgb(var(--card))] backdrop-blur-xl rounded-xl p-6">
                    <div className="text-[rgb(var(--foreground-muted))] text-sm font-medium mb-2">
                        Calories Burned
                    </div>
                    <div className="text-4xl font-bold text-[rgb(var(--primary))]">0</div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="glow-border bg-[rgb(var(--card))] backdrop-blur-xl rounded-2xl p-8">
                <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
                <div className="text-center py-12 text-[rgb(var(--foreground-muted))]">
                    <p>No workouts yet. Start your journey today!</p>
                    <a
                        href="/workouts"
                        className="inline-block mt-4 px-6 py-3 bg-[rgb(var(--primary))] text-[rgb(var(--background))] font-medium rounded-lg hover:bg-[rgb(var(--primary-hover))] transition-all shadow-lg shadow-[rgb(var(--primary))]/20"
                    >
                        Log Your First Workout
                    </a>
                </div>
            </div>
        </div>
    )
}
