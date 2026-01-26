'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { X } from 'lucide-react'
import { createGoal, type GoalType, type CreateGoalData } from '@/lib/actions/goals'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'

interface GoalFormProps {
    onClose: () => void
    exercises?: Array<{ id: string; name: string }>
}

export function GoalForm({ onClose, exercises = [] }: GoalFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState<CreateGoalData>({
        title: '',
        description: '',
        goal_type: 'strength',
        target_value: 0,
        unit: 'kg',
        exercise_id: undefined,
        target_date: '',
    })

    const goalTypes: Array<{ value: GoalType; label: string; description: string }> = [
        { value: 'strength', label: 'Strength Goal', description: 'Lift a specific weight on an exercise' },
        { value: 'weight_loss', label: 'Weight Loss', description: 'Reach a target body weight' },
        { value: 'weight_gain', label: 'Weight Gain', description: 'Reach a target body weight' },
        { value: 'volume', label: 'Volume Goal', description: 'Lift a total amount of weight' },
        { value: 'consistency', label: 'Consistency', description: 'Complete a number of workouts' },
    ]

    const handleTypeChange = (type: GoalType) => {
        let unit = 'kg'
        if (type === 'consistency') unit = 'workouts'

        setFormData({ ...formData, goal_type: type, unit })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        const toastId = toast.loading('Creating goal...')

        try {
            const result = await createGoal(formData)

            if (result.error) {
                toast.error(result.error, { id: toastId })
            } else {
                toast.success('Goal created successfully!', { id: toastId })
                router.refresh()
                onClose()
            }
        } catch (error) {
            toast.error('Failed to create goal', { id: toastId })
        } finally {
            setLoading(false)
        }
    }

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" data-lenis-prevent>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-[rgb(var(--card))] rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto glow-border"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold">Create New Goal</h2>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 rounded-full hover:bg-[rgb(var(--card-hover))] transition-colors flex items-center justify-center"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Goal Type */}
                        <div>
                            <label className="block text-sm font-medium mb-3">Goal Type</label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {goalTypes.map((type) => (
                                    <button
                                        key={type.value}
                                        type="button"
                                        onClick={() => handleTypeChange(type.value)}
                                        className={`p-4 rounded-lg border-2 text-left transition-all ${formData.goal_type === type.value
                                            ? 'border-[rgb(var(--primary))] bg-[rgb(var(--primary))]/10'
                                            : 'border-[rgb(var(--border))] hover:border-[rgb(var(--primary))]/50'
                                            }`}
                                    >
                                        <div className="font-medium mb-1">{type.label}</div>
                                        <div className="text-xs text-[rgb(var(--foreground-muted))]">
                                            {type.description}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Title */}
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium mb-2">
                                Goal Title *
                            </label>
                            <input
                                type="text"
                                id="title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-4 py-2 bg-[rgb(var(--background-secondary))] border border-[rgb(var(--border))] rounded-lg focus:outline-none focus:border-[rgb(var(--primary))] transition-colors"
                                placeholder="e.g., Bench Press 100kg"
                                required
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium mb-2">
                                Description (optional)
                            </label>
                            <textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-4 py-2 bg-[rgb(var(--background-secondary))] border border-[rgb(var(--border))] rounded-lg focus:outline-none focus:border-[rgb(var(--primary))] transition-colors resize-none"
                                rows={3}
                                placeholder="Add any notes about this goal..."
                            />
                        </div>

                        {/* Exercise (for strength goals) */}
                        {formData.goal_type === 'strength' && exercises.length > 0 && (
                            <div>
                                <label htmlFor="exercise" className="block text-sm font-medium mb-2">
                                    Exercise *
                                </label>
                                <select
                                    id="exercise"
                                    value={formData.exercise_id || ''}
                                    onChange={(e) => setFormData({ ...formData, exercise_id: e.target.value })}
                                    className="w-full px-4 py-2 bg-[rgb(var(--background-secondary))] border border-[rgb(var(--border))] rounded-lg focus:outline-none focus:border-[rgb(var(--primary))] transition-colors"
                                    required
                                >
                                    <option value="">Select an exercise</option>
                                    {exercises.map((ex) => (
                                        <option key={ex.id} value={ex.id}>
                                            {ex.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Target Value */}
                        <div>
                            <label htmlFor="target" className="block text-sm font-medium mb-2">
                                Target Value *
                            </label>
                            <div className="flex gap-3">
                                <input
                                    type="number"
                                    id="target"
                                    step="0.1"
                                    min="0"
                                    value={formData.target_value || ''}
                                    onChange={(e) => setFormData({ ...formData, target_value: parseFloat(e.target.value) })}
                                    className="flex-1 px-4 py-2 bg-[rgb(var(--background-secondary))] border border-[rgb(var(--border))] rounded-lg focus:outline-none focus:border-[rgb(var(--primary))] transition-colors"
                                    placeholder="100"
                                    required
                                />
                                <input
                                    type="text"
                                    value={formData.unit}
                                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                    className="w-24 px-4 py-2 bg-[rgb(var(--background-secondary))] border border-[rgb(var(--border))] rounded-lg focus:outline-none focus:border-[rgb(var(--primary))] transition-colors"
                                    placeholder="kg"
                                />
                            </div>
                        </div>

                        {/* Target Date */}
                        <div>
                            <label htmlFor="targetDate" className="block text-sm font-medium mb-2">
                                Target Date (optional)
                            </label>
                            <input
                                type="date"
                                id="targetDate"
                                value={formData.target_date}
                                onChange={(e) => setFormData({ ...formData, target_date: e.target.value })}
                                min={new Date().toISOString().split('T')[0]}
                                className="w-full px-4 py-2 bg-[rgb(var(--background-secondary))] border border-[rgb(var(--border))] rounded-lg focus:outline-none focus:border-[rgb(var(--primary))] transition-colors"
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-3 border border-[rgb(var(--border))] rounded-lg hover:bg-[rgb(var(--card-hover))] transition-colors font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 px-4 py-3 bg-[rgb(var(--primary))] text-[rgb(var(--background))] rounded-lg hover:bg-[rgb(var(--primary-hover))] transition-colors font-bold disabled:opacity-50"
                            >
                                {loading ? 'Creating...' : 'Create Goal'}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}
