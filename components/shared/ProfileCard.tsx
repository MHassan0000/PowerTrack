import { UserProfile, FITNESS_GOALS, EXPERIENCE_LEVELS } from '@/types'
import Image from 'next/image'
import Link from 'next/link'

interface ProfileCardProps {
    profile: UserProfile
}

export function ProfileCard({ profile }: ProfileCardProps) {
    const getInitials = () => {
        if (profile.full_name) {
            return profile.full_name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()
        }
        return profile.email[0].toUpperCase()
    }

    const calculateBMI = () => {
        if (profile.height_cm && profile.weight_kg) {
            const heightM = profile.height_cm / 100
            const bmi = profile.weight_kg / (heightM * heightM)
            return bmi.toFixed(1)
        }
        return null
    }

    return (
        <div className="glow-border bg-[rgb(var(--card))] backdrop-blur-xl rounded-2xl p-6">
            <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                    {profile.avatar_url ? (
                        <Image
                            src={profile.avatar_url}
                            alt={profile.full_name || 'Profile'}
                            width={80}
                            height={80}
                            className="rounded-full object-cover w-20 h-20"
                        />
                    ) : (
                        <div className="w-20 h-20 rounded-full bg-linear-to-br from-[rgb(var(--primary))] to-[rgb(var(--primary-hover))] flex items-center justify-center text-2xl font-bold">
                            {getInitials()}
                        </div>
                    )}
                    <div>
                        <h2 className="text-2xl font-bold">
                            {profile.full_name || 'User'}
                        </h2>
                        <p className="text-[rgb(var(--foreground-muted))]">
                            {profile.email}
                        </p>
                        {profile.bio && (
                            <p className="text-sm text-[rgb(var(--foreground-secondary))] mt-1">
                                {profile.bio}
                            </p>
                        )}
                    </div>
                </div>
                <Link
                    href="/settings"
                    className="px-4 py-2 text-sm bg-[rgb(var(--primary))]/20 text-[rgb(var(--primary))] border border-[rgb(var(--primary))] rounded-lg hover:bg-[rgb(var(--primary))]/30 transition-all"
                >
                    Edit Profile
                </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {profile.age && (
                    <div className="bg-[rgb(var(--background-secondary))] rounded-lg p-3">
                        <div className="text-[rgb(var(--foreground-muted))] text-xs mb-1">
                            Age
                        </div>
                        <div className="text-xl font-bold text-[rgb(var(--primary))]">
                            {profile.age}
                        </div>
                    </div>
                )}

                {profile.height_cm && (
                    <div className="bg-[rgb(var(--background-secondary))] rounded-lg p-3">
                        <div className="text-[rgb(var(--foreground-muted))] text-xs mb-1">
                            Height
                        </div>
                        <div className="text-xl font-bold text-[rgb(var(--primary))]">
                            {profile.height_cm} cm
                        </div>
                    </div>
                )}

                {profile.weight_kg && (
                    <div className="bg-[rgb(var(--background-secondary))] rounded-lg p-3">
                        <div className="text-[rgb(var(--foreground-muted))] text-xs mb-1">
                            Weight
                        </div>
                        <div className="text-xl font-bold text-[rgb(var(--primary))]">
                            {profile.weight_kg} kg
                        </div>
                    </div>
                )}

                {calculateBMI() && (
                    <div className="bg-[rgb(var(--background-secondary))] rounded-lg p-3">
                        <div className="text-[rgb(var(--foreground-muted))] text-xs mb-1">
                            BMI
                        </div>
                        <div className="text-xl font-bold text-[rgb(var(--primary))]">
                            {calculateBMI()}
                        </div>
                    </div>
                )}
            </div>

            {(profile.fitness_goal || profile.experience_level) && (
                <div className="mt-4 flex flex-wrap gap-2">
                    {profile.fitness_goal && (
                        <div className="px-3 py-1 bg-[rgb(var(--primary))]/10 border border-[rgb(var(--primary))]/30 rounded-full text-sm">
                            🎯 {FITNESS_GOALS[profile.fitness_goal]}
                        </div>
                    )}
                    {profile.experience_level && (
                        <div className="px-3 py-1 bg-[rgb(var(--primary))]/10 border border-[rgb(var(--primary))]/30 rounded-full text-sm">
                            📊 {EXPERIENCE_LEVELS[profile.experience_level]}
                        </div>
                    )}
                </div>
            )}

            {!profile.fitness_goal && !profile.experience_level && !profile.age && (
                <div className="mt-4 p-3 bg-[rgb(var(--primary))]/10 border border-[rgb(var(--primary))]/30 rounded-lg text-sm">
                    <p className="text-[rgb(var(--foreground-muted))]">
                        Complete your profile to get personalized workout recommendations!
                    </p>
                    <Link
                        href="/settings"
                        className="text-[rgb(var(--primary))] hover:underline mt-1 inline-block"
                    >
                        Complete Profile →
                    </Link>
                </div>
            )}
        </div>
    )
}
