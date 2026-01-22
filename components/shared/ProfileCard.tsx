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
        <div className="bg-[#18181B] border border-white/5 rounded-2xl p-6">
            <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                    {profile.avatar_url ? (
                        <Image
                            src={profile.avatar_url}
                            alt={profile.full_name || 'Profile'}
                            width={80}
                            height={80}
                            className="rounded-full object-cover w-16 h-16 border-2 border-[#10B981]/20"
                        />
                    ) : (
                        <div className="w-16 h-16 rounded-full bg-[#10B981]/10 border border-[#10B981]/20 flex items-center justify-center text-xl font-bold text-[#10B981]">
                            {getInitials()}
                        </div>
                    )}
                    <div>
                        <h2 className="text-xl font-bold text-white">
                            {profile.full_name || 'User'}
                        </h2>
                        <p className="text-zinc-500 text-sm">
                            {profile.email}
                        </p>
                        {profile.bio && (
                            <p className="text-xs text-zinc-400 mt-1">
                                {profile.bio}
                            </p>
                        )}
                    </div>
                </div>
                <Link
                    href="/settings"
                    className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-white/5 text-zinc-300 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                >
                    Edit Profile
                </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {profile.age && (
                    <div className="bg-[#27272A] rounded-xl p-3 border border-white/5">
                        <div className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider mb-1">
                            Age
                        </div>
                        <div className="text-lg font-bold text-white">
                            {profile.age}
                        </div>
                    </div>
                )}

                {profile.height_cm && (
                    <div className="bg-[#27272A] rounded-xl p-3 border border-white/5">
                        <div className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider mb-1">
                            Height
                        </div>
                        <div className="text-lg font-bold text-white">
                            {profile.height_cm} <span className="text-sm font-normal text-zinc-500">cm</span>
                        </div>
                    </div>
                )}

                {profile.weight_kg && (
                    <div className="bg-[#27272A] rounded-xl p-3 border border-white/5">
                        <div className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider mb-1">
                            Weight
                        </div>
                        <div className="text-lg font-bold text-white">
                            {profile.weight_kg} <span className="text-sm font-normal text-zinc-500">kg</span>
                        </div>
                    </div>
                )}

                {calculateBMI() && (
                    <div className="bg-[#27272A] rounded-xl p-3 border border-white/5">
                        <div className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider mb-1">
                            BMI
                        </div>
                        <div className="text-lg font-bold text-[#10B981]">
                            {calculateBMI()}
                        </div>
                    </div>
                )}
            </div>

            {(profile.fitness_goal || profile.experience_level) && (
                <div className="mt-6 flex flex-wrap gap-2 pt-6 border-t border-white/5">
                    {profile.fitness_goal && (
                        <div className="px-3 py-1 bg-[#10B981]/10 text-[#10B981] text-xs font-bold uppercase tracking-wider rounded-md">
                            🎯 {FITNESS_GOALS[profile.fitness_goal]}
                        </div>
                    )}
                    {profile.experience_level && (
                        <div className="px-3 py-1 bg-zinc-800 text-zinc-300 text-xs font-bold uppercase tracking-wider rounded-md">
                            📊 {EXPERIENCE_LEVELS[profile.experience_level]}
                        </div>
                    )}
                </div>
            )}

            {!profile.fitness_goal && !profile.experience_level && !profile.age && (
                <div className="mt-4 p-3 bg-[#10B981]/10 border border-[#10B981]/20 rounded-lg text-sm">
                    <p className="text-zinc-400">
                        Complete your profile to get personalized workout recommendations!
                    </p>
                    <Link
                        href="/settings"
                        className="text-[#10B981] font-bold hover:underline mt-1 inline-block"
                    >
                        Complete Profile →
                    </Link>
                </div>
            )}
        </div>
    )
}
