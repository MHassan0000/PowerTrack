'use client'

import { useState } from 'react'
import { Plus, Target } from 'lucide-react'
import { GoalCard } from '@/components/goals/GoalCard'
import { GoalForm } from '@/components/goals/GoalForm'
import type { GoalStatus } from '@/lib/actions/goals'

interface Goal {
    id: string
    title: string
    description: string | null
    goal_type: any
    target_value: number
    current_value: number
    unit: string
    target_date: string | null
    status: GoalStatus
    exercise?: {
        name: string
        primary_muscle: string
    }
}

interface GoalsPageContentProps {
    initialGoals: Goal[]
    exercises: Array<{ id: string; name: string }>
}

export function GoalsPageContent({ initialGoals, exercises }: GoalsPageContentProps) {
    const [showForm, setShowForm] = useState(false)
    const [filter, setFilter] = useState<GoalStatus | 'all'>('all')

    const filteredGoals = filter === 'all'
        ? initialGoals
        : initialGoals.filter(g => g.status === filter)

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Goals</h1>
                    <p className="text-zinc-400">
                        Set and track your fitness goals
                    </p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#10B981] text-black rounded-xl hover:bg-[#059669] transition-all font-bold"
                >
                    <Plus className="w-5 h-5" />
                    Create Goal
                </button>
            </div>

            {/* Filters */}
            <div className="flex gap-2">
                {(['all', 'active', 'completed', 'archived'] as const).map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-all ${filter === status
                                ? 'bg-[#10B981] text-black'
                                : 'bg-[#18181B] text-zinc-400 hover:text-white hover:bg-white/5 border border-white/5'
                            }`}
                    >
                        {status}
                    </button>
                ))}
            </div>

            {/* Goals Grid */}
            {filteredGoals.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredGoals.map((goal, index) => (
                        <GoalCard key={goal.id} goal={goal} index={index} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-24 bg-[#18181B] border border-white/5 rounded-2xl">
                    <div className="w-20 h-20 rounded-full bg-[#10B981]/10 flex items-center justify-center mx-auto mb-6">
                        <Target className="w-10 h-10 text-[#10B981]" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">No Goals Yet</h2>
                    <p className="text-zinc-500 mb-8 max-w-md mx-auto">
                        Create your first goal to start tracking your progress
                    </p>
                    <button
                        onClick={() => setShowForm(true)}
                        className="inline-flex items-center gap-2 px-8 py-3 bg-[#10B981] text-black rounded-xl hover:bg-[#059669] transition-all font-bold"
                    >
                        <Plus className="w-5 h-5" />
                        Create Goal
                    </button>
                </div>
            )}

            {/* Goal Form Modal */}
            {showForm && (
                <GoalForm
                    onClose={() => setShowForm(false)}
                    exercises={exercises}
                />
            )}
        </div>
    )
}
