import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ProfileForm } from '@/components/shared/ProfileForm'

export default async function SettingsPage() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Fetch user profile
    const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

    if (!profile) {
        // If profile doesn't exist yet, create basic entry
        await supabase.from('users').insert({
            id: user.id,
            email: user.email!,
            full_name: user.user_metadata?.full_name || '',
        })

        // Re-fetch
        const { data: newProfile } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single()

        if (!newProfile) {
            return <div>Error loading profile</div>
        }

        return (
            <div className="max-w-3xl mx-auto space-y-6">
                <div>
                    <h1 className="text-4xl font-bold glow-text mb-2">Profile Settings</h1>
                    <p className="text-[rgb(var(--foreground-muted))] text-lg">
                        Manage your account and fitness preferences
                    </p>
                </div>

                <ProfileForm initialData={newProfile} />
            </div>
        )
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div>
                <h1 className="text-4xl font-bold glow-text mb-2">Profile Settings</h1>
                <p className="text-[rgb(var(--foreground-muted))] text-lg">
                    Manage your account and fitness preferences
                </p>
            </div>

            <ProfileForm initialData={profile} />
        </div>
    )
}
