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
        <div className="container mx-auto px-4 py-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Goals</h1>
                    <p className="text-[rgb(var(--foreground-muted))]">
                        Set and track your fitness goals
                    </p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 px-4 py-3 bg-[rgb(var(--primary))] text-[rgb(var(--background))] rounded-lg hover:bg-[rgb(var(--primary-hover))] transition-colors font-medium shadow-lg shadow-[rgb(var(--primary))]/30"
                >
                    <Plus className="w-5 h-5" />
                    Create Goal
                </button>
            </div>

            {/* Filters */}
            <div className="flex gap-2 mb-6">
                {(['all', 'active', 'completed', 'archived'] as const).map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === status
                                ? 'bg-[rgb(var(--primary))] text-[rgb(var(--background))]'
                                : 'bg-[rgb(var(--card))] hover:bg-[rgb(var(--card-hover))]'
                            }`}
                    >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
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
                <div className="text-center py-20">
                    <div className="w-20 h-20 rounded-full bg-[rgb(var(--primary))]/10 flex items-center justify-center mx-auto mb-4">
                        <Target className="w-10 h-10 text-[rgb(var(--primary))]" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">No Goals Yet</h2>
                    <p className="text-[rgb(var(--foreground-muted))] mb-6">
                        Create your first goal to start tracking your progress
                    </p>
                    <button
                        onClick={() => setShowForm(true)}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[rgb(var(--primary))] text-[rgb(var(--background))] rounded-lg hover:bg-[rgb(var(--primary-hover))] transition-colors font-medium"
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
