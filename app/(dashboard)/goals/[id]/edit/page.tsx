'use client'

import { use, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Loader2, Target } from 'lucide-react'
import Link from 'next/link'
import { getGoalById, updateGoal } from '@/lib/actions/goals'
import { toast } from 'sonner'

interface GoalEditPageProps {
    params: Promise<{ id: string }>
}

export default function GoalEditPage({ params }: GoalEditPageProps) {
    const { id } = use(params)
    const router = useRouter()
    const [goal, setGoal] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        current_value: 0,
        target_value: 0,
        target_date: '',
    })

    useEffect(() => {
        const loadGoal = async () => {
            const { data, error } = await getGoalById(id)
            if (data) {
                setGoal(data)
                setFormData({
                    title: data.title,
                    description: data.description || '',
                    current_value: data.current_value,
                    target_value: data.target_value,
                    target_date: data.target_date ? data.target_date.split('T')[0] : '',
                })
            }
            setLoading(false)
        }
        loadGoal()
    }, [id])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)

        const toastId = toast.loading('Updating goal...')

        const result = await updateGoal(id, {
            title: formData.title,
            description: formData.description,
            target_value: formData.target_value,
            target_date: formData.target_date || undefined,
        })

        if (result.error) {
            toast.error(result.error, { id: toastId })
        } else {
            toast.success('Goal updated successfully!', { id: toastId })
            router.push(`/goals/${id}`)
        }

        setSaving(false)
    }

    const handleUpdateProgress = async () => {
        setSaving(true)
        const toastId = toast.loading('Updating progress...')

        const result = await updateGoal(id, {
            current_value: formData.current_value,
        })

        if (result.error) {
            toast.error(result.error, { id: toastId })
        } else {
            toast.success('Progress updated!', { id: toastId })
            router.refresh()
        }

        setSaving(false)
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-[#10B981]" />
            </div>
        )
    }

    if (!goal) {
        return (
            <div className="text-center py-20">
                <p className="text-zinc-400">Goal not found</p>
            </div>
        )
    }

    const progress = goal.target_value > 0 
        ? (formData.current_value / formData.target_value) * 100 
        : 0

    return (
        <div className="max-w-2xl mx-auto py-8 px-4">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link
                    href={`/goals/${id}`}
                    className="w-10 h-10 rounded-xl bg-[#18181B] hover:bg-[#27272A] border border-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-white">Edit Goal</h1>
                    <p className="text-zinc-400 text-sm mt-1">Update your goal details and track progress</p>
                </div>
            </div>

            {/* Progress Card */}
            <div className="bg-[#18181B] rounded-3xl p-8 border border-white/5 mb-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-[#10B981]/10 flex items-center justify-center">
                        <Target className="w-6 h-6 text-[#10B981]" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-white">Quick Progress Update</h2>
                        <p className="text-sm text-zinc-500">Update your current progress</p>
                    </div>
                </div>

                {/* Current Progress Input */}
                <div className="mb-6">
                    <label htmlFor="current_value" className="block text-sm font-bold text-zinc-300 uppercase tracking-wider mb-2">
                        Current Progress
                    </label>
                    <div className="flex gap-3">
                        <input
                            type="number"
                            id="current_value"
                            value={formData.current_value}
                            onChange={(e) => setFormData({ ...formData, current_value: Number(e.target.value) })}
                            className="flex-1 px-4 py-3 bg-[#27272A] border border-white/5 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#10B981] transition-all"
                        />
                        <span className="px-4 py-3 bg-[#27272A] border border-white/5 rounded-xl text-zinc-400">
                            {goal.unit}
                        </span>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-zinc-500">Progress</span>
                        <span className="text-sm font-bold text-[#10B981]">{Math.min(Math.round(progress), 100)}%</span>
                    </div>
                    <div className="h-3 bg-[#27272A] rounded-full overflow-hidden">
                        <div
                            className="h-full bg-linear-to-r from-[#10B981] to-[#059669] transition-all duration-500"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                        ></div>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-zinc-600">{formData.current_value} {goal.unit}</span>
                        <span className="text-xs text-zinc-600">{formData.target_value} {goal.unit}</span>
                    </div>
                </div>

                <button
                    onClick={handleUpdateProgress}
                    disabled={saving}
                    className="w-full py-3 bg-[#10B981] hover:bg-[#059669] text-black font-bold rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    Update Progress
                </button>
            </div>

            {/* Goal Details Form */}
            <form onSubmit={handleSubmit} className="bg-[#18181B] rounded-3xl p-8 border border-white/5 space-y-6">
                <h2 className="text-lg font-bold text-white mb-4">Goal Details</h2>

                {/* Title */}
                <div>
                    <label htmlFor="title" className="block text-sm font-bold text-zinc-300 uppercase tracking-wider mb-2">
                        Goal Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-4 py-3 bg-[#27272A] border border-white/5 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#10B981] transition-all"
                    />
                </div>

                {/* Description */}
                <div>
                    <label htmlFor="description" className="block text-sm font-bold text-zinc-300 uppercase tracking-wider mb-2">
                        Description
                    </label>
                    <textarea
                        id="description"
                        rows={3}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-4 py-3 bg-[#27272A] border border-white/5 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#10B981] transition-all resize-none"
                    />
                </div>

                {/* Target Value */}
                <div>
                    <label htmlFor="target_value" className="block text-sm font-bold text-zinc-300 uppercase tracking-wider mb-2">
                        Target Value
                    </label>
                    <div className="flex gap-3">
                        <input
                            type="number"
                            id="target_value"
                            required
                            value={formData.target_value}
                            onChange={(e) => setFormData({ ...formData, target_value: Number(e.target.value) })}
                            className="flex-1 px-4 py-3 bg-[#27272A] border border-white/5 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#10B981] transition-all"
                        />
                        <span className="px-4 py-3 bg-[#27272A] border border-white/5 rounded-xl text-zinc-400">
                            {goal.unit}
                        </span>
                    </div>
                </div>

                {/* Target Date */}
                <div>
                    <label htmlFor="target_date" className="block text-sm font-bold text-zinc-300 uppercase tracking-wider mb-2">
                        Target Date (Optional)
                    </label>
                    <input
                        type="date"
                        id="target_date"
                        value={formData.target_date}
                        onChange={(e) => setFormData({ ...formData, target_date: e.target.value })}
                        className="w-full px-4 py-3 bg-[#27272A] border border-white/5 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#10B981] transition-all"
                    />
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-4">
                    <Link
                        href={`/goals/${id}`}
                        className="flex-1 py-3 bg-[#27272A] hover:bg-[#3F3F46] text-white font-medium rounded-xl transition-colors text-center"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex-1 py-3 bg-[#10B981] hover:bg-[#059669] text-black font-bold rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    )
}
