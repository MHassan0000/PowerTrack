'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Dumbbell, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { createWorkout } from '@/lib/actions/workouts'
import { toast } from 'sonner'

export default function NewWorkoutPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        is_template: true,
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const toastId = toast.loading('Creating workout...')

        try {
            const formDataObj = new FormData()
            formDataObj.append('name', formData.name)
            formDataObj.append('description', formData.description)
            formDataObj.append('is_template', formData.is_template.toString())

            const result = await createWorkout(formDataObj)

            if (result.error) {
                toast.error(result.error, { id: toastId })
            } else if (result.data) {
                toast.success('Workout created! Now add exercises.', { id: toastId })
                router.push(`/workouts/${result.data.id}/edit`)
            }
        } catch (error) {
            toast.error('Failed to create workout', { id: toastId })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto py-8 px-4">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link
                    href="/workouts"
                    className="w-10 h-10 rounded-xl bg-[#18181B] hover:bg-[#27272A] border border-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Create Workout</h1>
                    <p className="text-zinc-400 mt-1">Build your custom workout routine</p>
                </div>
            </div>

            {/* Form Card */}
            <form onSubmit={handleSubmit} className="bg-[#18181B] rounded-3xl p-8 border border-white/5 space-y-8">
                {/* Workout Icon */}
                <div className="flex justify-center">
                    <div className="w-20 h-20 rounded-2xl bg-[#10B981]/10 border border-[#10B981]/20 flex items-center justify-center">
                        <Dumbbell className="w-10 h-10 text-[#10B981]" />
                    </div>
                </div>

                {/* Workout Name */}
                <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-bold text-zinc-300 uppercase tracking-wider">
                        Workout Name *
                    </label>
                    <input
                        type="text"
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g., Push Day, Full Body Strength..."
                        className="w-full px-4 py-3 bg-[#27272A] border border-white/5 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-transparent transition-all"
                    />
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <label htmlFor="description" className="block text-sm font-bold text-zinc-300 uppercase tracking-wider">
                        Description
                    </label>
                    <textarea
                        id="description"
                        rows={4}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="What's the focus of this workout?"
                        className="w-full px-4 py-3 bg-[#27272A] border border-white/5 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-transparent transition-all resize-none"
                    />
                </div>

                {/* Template Toggle */}
                <div className="flex items-center justify-between p-4 bg-[#27272A] rounded-xl border border-white/5">
                    <div>
                        <h3 className="text-sm font-bold text-white">Save as Template</h3>
                        <p className="text-xs text-zinc-500 mt-1">Reuse this workout multiple times</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setFormData({ ...formData, is_template: !formData.is_template })}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            formData.is_template ? 'bg-[#10B981]' : 'bg-zinc-700'
                        }`}
                    >
                        <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                formData.is_template ? 'translate-x-6' : 'translate-x-1'
                            }`}
                        />
                    </button>
                </div>

                {/* Info Box */}
                <div className="p-4 bg-[#10B981]/5 border border-[#10B981]/20 rounded-xl">
                    <p className="text-sm text-zinc-400">
                        💡 After creating your workout, you'll be able to add exercises, configure sets/reps, and customize rest times.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-4">
                    <Link
                        href="/workouts"
                        className="flex-1 py-3.5 bg-[#27272A] hover:bg-[#3F3F46] text-white font-medium rounded-xl transition-colors text-center"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={loading || !formData.name.trim()}
                        className="flex-1 py-3.5 bg-[#10B981] hover:bg-[#059669] text-black font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            <>
                                Create Workout
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    )
}
