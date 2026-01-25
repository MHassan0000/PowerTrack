'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { updateProfile, uploadAvatar } from '@/lib/actions/profile'
import Image from 'next/image'

interface ProfileFormProps {
    initialData: {
        id: string
        email: string
        full_name: string | null
        age: number | null
        height_cm: number | null
        weight_kg: number | null
        fitness_goal: string | null
        experience_level: string | null
        preferred_units: string | null
        bio: string | null
        avatar_url: string | null
        daily_calorie_goal: number | null
        daily_protein_goal_g: number | null
        daily_carbs_goal_g: number | null
        daily_fat_goal_g: number | null
    }
}

export function ProfileForm({ initialData }: ProfileFormProps) {
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [avatarUploading, setAvatarUploading] = useState(false)
    const [avatarUrl, setAvatarUrl] = useState(initialData.avatar_url)

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        setError(null)
        setSuccess(null)

        const result = await updateProfile(formData)

        if (result?.error) {
            setError(result.error)
            setLoading(false)
        } else if (result?.success) {
            setSuccess(result.message)
            setLoading(false)
        }
    }

    async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return

        setAvatarUploading(true)
        setError(null)

        const formData = new FormData()
        formData.append('avatar', file)

        const result = await uploadAvatar(formData)

        if (result?.error) {
            setError(result.error)
        } else if (result?.success && result.avatarUrl) {
            setAvatarUrl(result.avatarUrl)
            setSuccess('Avatar uploaded successfully!')
        }

        setAvatarUploading(false)
    }

    return (
        <form action={handleSubmit} className="space-y-8">
            {/* Avatar Section */}
            <div className="bg-[#18181B] border border-white/5 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-white mb-6">Profile Picture</h3>
                <div className="flex items-center gap-6">
                    <div className="relative">
                        {avatarUrl ? (
                            <Image
                                src={avatarUrl}
                                alt="Profile"
                                width={96}
                                height={96}
                                className="rounded-full object-cover w-24 h-24 border-4 border-[#10B981]/20"
                            />
                        ) : (
                            <div className="w-24 h-24 rounded-full bg-[#10B981]/10 border-4 border-[#10B981]/20 flex items-center justify-center text-3xl font-bold text-[#10B981]">
                                {initialData.full_name?.[0]?.toUpperCase() || initialData.email[0].toUpperCase()}
                            </div>
                        )}
                        {avatarUploading && (
                            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                                <div className="animate-spin w-8 h-8 border-2 border-[#10B981] border-t-transparent rounded-full" />
                            </div>
                        )}
                    </div>
                    <div>
                        <label
                            htmlFor="avatar"
                            className="cursor-pointer px-6 py-2.5 bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20 rounded-xl hover:bg-[#10B981]/20 transition-all font-bold inline-block"
                        >
                            {avatarUploading ? 'Uploading...' : 'Change Avatar'}
                        </label>
                        <input
                            id="avatar"
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarUpload}
                            className="hidden"
                            disabled={avatarUploading}
                        />
                        <p className="text-xs text-zinc-500 mt-2">
                            JPG, PNG or GIF. Max 5MB.
                        </p>
                    </div>
                </div>
            </div>

            {/* Basic Info */}
            <div className="bg-[#18181B] border border-white/5 rounded-2xl p-8 space-y-6">
                <h3 className="text-xl font-bold text-white mb-6">Basic Information</h3>

                <div>
                    <label htmlFor="full_name" className="block text-sm font-bold text-zinc-400 mb-2">
                        Full Name *
                    </label>
                    <input
                        id="full_name"
                        name="full_name"
                        type="text"
                        required
                        defaultValue={initialData.full_name || ''}
                        className="w-full px-4 py-3 bg-[#27272A] border border-white/5 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#10B981] transition-all placeholder:text-zinc-600"
                        placeholder="John Doe"
                    />
                </div>

                <div>
                    <label htmlFor="age" className="block text-sm font-bold text-zinc-400 mb-2">
                        Age *
                    </label>
                    <input
                        id="age"
                        name="age"
                        type="number"
                        required
                        min="13"
                        max="120"
                        defaultValue={initialData.age || ''}
                        className="w-full px-4 py-3 bg-[#27272A] border border-white/5 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#10B981] transition-all placeholder:text-zinc-600"
                        placeholder="25"
                    />
                </div>

                <div>
                    <label htmlFor="bio" className="block text-sm font-bold text-zinc-400 mb-2">
                        Bio
                    </label>
                    <textarea
                        id="bio"
                        name="bio"
                        rows={3}
                        defaultValue={initialData.bio || ''}
                        className="w-full px-4 py-3 bg-[#27272A] border border-white/5 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#10B981] transition-all resize-none placeholder:text-zinc-600"
                        placeholder="Tell us about yourself..."
                    />
                </div>
            </div>

            {/* Physical Stats */}
            <div className="bg-[#18181B] border border-white/5 rounded-2xl p-8 space-y-6">
                <h3 className="text-xl font-bold text-white mb-6">Physical Stats</h3>

                <div>
                    <label htmlFor="preferred_units" className="block text-sm font-bold text-zinc-400 mb-2">
                        Preferred Units *
                    </label>
                    <select
                        id="preferred_units"
                        name="preferred_units"
                        required
                        defaultValue={initialData.preferred_units || 'metric'}
                        className="w-full px-4 py-3 bg-[#27272A] border border-white/5 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#10B981] transition-all"
                    >
                        <option value="metric">Metric (kg, cm)</option>
                        <option value="imperial">Imperial (lbs, ft/in)</option>
                    </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="height_cm" className="block text-sm font-bold text-zinc-400 mb-2">
                            Height (cm) *
                        </label>
                        <input
                            id="height_cm"
                            name="height_cm"
                            type="number"
                            step="0.1"
                            required
                            min="0"
                            defaultValue={initialData.height_cm || ''}
                            className="w-full px-4 py-3 bg-[#27272A] border border-white/5 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#10B981] transition-all placeholder:text-zinc-600"
                            placeholder="175"
                        />
                    </div>

                    <div>
                        <label htmlFor="weight_kg" className="block text-sm font-bold text-zinc-400 mb-2">
                            Weight (kg) *
                        </label>
                        <input
                            id="weight_kg"
                            name="weight_kg"
                            type="number"
                            step="0.1"
                            required
                            min="0"
                            defaultValue={initialData.weight_kg || ''}
                            className="w-full px-4 py-3 bg-[#27272A] border border-white/5 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#10B981] transition-all placeholder:text-zinc-600"
                            placeholder="70"
                        />
                    </div>
                </div>
            </div>

            {/* Nutrition Goals */}
            <div className="bg-[#18181B] border border-white/5 rounded-2xl p-8 space-y-6">
                <div>
                    <h3 className="text-xl font-bold text-white mb-2">Nutrition Goals</h3>
                    <p className="text-sm text-zinc-400 mb-6">
                        Set your daily macro targets. Leave blank to see only current values without goals.
                    </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="daily_calorie_goal" className="block text-sm font-bold text-zinc-400 mb-2">
                            Daily Calories Goal
                        </label>
                        <input
                            id="daily_calorie_goal"
                            name="daily_calorie_goal"
                            type="number"
                            min="0"
                            defaultValue={initialData.daily_calorie_goal || ''}
                            className="w-full px-4 py-3 bg-[#27272A] border border-white/5 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#10B981] transition-all placeholder:text-zinc-600"
                            placeholder="e.g., 2000"
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="daily_protein_goal_g" className="block text-sm font-bold text-zinc-400 mb-2">
                            Daily Protein Goal (g)
                        </label>
                        <input
                            id="daily_protein_goal_g"
                            name="daily_protein_goal_g"
                            type="number"
                            step="0.1"
                            min="0"
                            defaultValue={initialData.daily_protein_goal_g || ''}
                            className="w-full px-4 py-3 bg-[#27272A] border border-white/5 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#10B981] transition-all placeholder:text-zinc-600"
                            placeholder="e.g., 150"
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="daily_carbs_goal_g" className="block text-sm font-bold text-zinc-400 mb-2">
                            Daily Carbs Goal (g)
                        </label>
                        <input
                            id="daily_carbs_goal_g"
                            name="daily_carbs_goal_g"
                            type="number"
                            step="0.1"
                            min="0"
                            defaultValue={initialData.daily_carbs_goal_g || ''}
                            className="w-full px-4 py-3 bg-[#27272A] border border-white/5 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#10B981] transition-all placeholder:text-zinc-600"
                            placeholder="e.g., 250"
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="daily_fat_goal_g" className="block text-sm font-bold text-zinc-400 mb-2">
                            Daily Fat Goal (g)
                        </label>
                        <input
                            id="daily_fat_goal_g"
                            name="daily_fat_goal_g"
                            type="number"
                            step="0.1"
                            min="0"
                            defaultValue={initialData.daily_fat_goal_g || ''}
                            className="w-full px-4 py-3 bg-[#27272A] border border-white/5 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#10B981] transition-all placeholder:text-zinc-600"
                            placeholder="e.g., 65"
                        />
                    </div>
                </div>
            </div>

            {/* Fitness Info */}
            <div className="bg-[#18181B] border border-white/5 rounded-2xl p-8 space-y-6">
                <h3 className="text-xl font-bold text-white mb-6">Fitness Information</h3>

                <div>
                    <label htmlFor="fitness_goal" className="block text-sm font-bold text-zinc-400 mb-2">
                        Primary Fitness Goal *
                    </label>
                    <select
                        id="fitness_goal"
                        name="fitness_goal"
                        required
                        defaultValue={initialData.fitness_goal || ''}
                        className="w-full px-4 py-3 bg-[#27272A] border border-white/5 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#10B981] transition-all"
                    >
                        <option value="">Select a goal...</option>
                        <option value="lose_fat">Lose Fat</option>
                        <option value="build_muscle">Build Muscle</option>
                        <option value="maintain">Maintain</option>
                        <option value="endurance">Improve Endurance</option>
                        <option value="strength">Build Strength</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="experience_level" className="block text-sm font-bold text-zinc-400 mb-2">
                        Experience Level *
                    </label>
                    <select
                        id="experience_level"
                        name="experience_level"
                        required
                        defaultValue={initialData.experience_level || ''}
                        className="w-full px-4 py-3 bg-[#27272A] border border-white/5 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#10B981] transition-all"
                    >
                        <option value="">Select level...</option>
                        <option value="beginner">Beginner (0-1 years)</option>
                        <option value="intermediate">Intermediate (1-3 years)</option>
                        <option value="advanced">Advanced (3+ years)</option>
                    </select>
                </div>
            </div>

            {/* Messages */}
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400"
                >
                    {error}
                </motion.div>
            )}

            {success && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-green-500/10 border border-green-500/50 rounded-lg text-green-400"
                >
                    {success}
                </motion.div>
            )}

            {/* Submit Button */}
            <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-[#10B981] text-black font-bold text-lg rounded-xl hover:bg-[#059669] transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide"
            >
                {loading ? 'Saving...' : 'Save Profile'}
            </button>
        </form>
    )
}
