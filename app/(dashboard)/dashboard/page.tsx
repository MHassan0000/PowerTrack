import { createClient } from '@/lib/supabase/server'
import { ProfileCard } from '@/components/shared/ProfileCard'

export default async function DashboardPage() {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return null
    }

    // Fetch user profile
    const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

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
