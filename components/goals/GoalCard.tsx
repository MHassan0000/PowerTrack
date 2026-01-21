'use client'

import { motion } from 'framer-motion'
import { Calendar, Target, TrendingUp, CheckCircle2, Archive } from 'lucide-react'
import Link from 'next/link'
import { GoalProgressBar } from './GoalProgressBar'
import type { GoalType, GoalStatus } from '@/lib/actions/goals'

interface Goal {
    id: string
    title: string
    description: string | null
    goal_type: GoalType
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

interface GoalCardProps {
    goal: Goal
    index?: number
    compact?: boolean
}

export function GoalCard({ goal, index = 0, compact = false }: GoalCardProps) {
    const formatDate = (dateString: string | null) => {
        if (!dateString) return null
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        })
    }

    const getGoalTypeIcon = (type: GoalType) => {
        switch (type) {
            case 'strength':
                return <TrendingUp className="w-5 h-5" />
            case 'weight_loss':
            case 'weight_gain':
                return <Target className="w-5 h-5" />
            case 'volume':
                return <TrendingUp className="w-5 h-5" />
            case 'consistency':
                return <Calendar className="w-5 h-5" />
        }
    }

    const getStatusBadge = (status: GoalStatus) => {
        switch (status) {
            case 'active':
                return (
                    <span className="px-2 py-1 text-xs font-medium bg-[rgb(var(--primary))]/20 text-[rgb(var(--primary))] rounded-full">
                        🎯 Active
                    </span>
                )
            case 'completed':
                return (
                    <span className="px-2 py-1 text-xs font-medium bg-green-500/20 text-green-500 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Completed
                    </span>
                )
            case 'archived':
                return (
                    <span className="px-2 py-1 text-xs font-medium bg-gray-500/20 text-gray-500 rounded-full flex items-center gap-1">
                        <Archive className="w-3 h-3" />
                        Archived
                    </span>
                )
        }
    }

    if (compact) {
        return (
            <Link href={`/goals/${goal.id}`}>
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-[rgb(var(--card))] rounded-lg p-4 glow-border hover:border-[rgb(var(--primary))] transition-colors cursor-pointer"
                >
                    <div className="flex items-start justify-between mb-3">
                        <h4 className="font-bold text-sm">{goal.title}</h4>
                        {getStatusBadge(goal.status)}
                    </div>
                    <GoalProgressBar
                        current={goal.current_value}
                        target={goal.target_value}
                        unit={goal.unit}
                    />
                </motion.div>
            </Link>
        )
    }

    return (
        <Link href={`/goals/${goal.id}`}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-[rgb(var(--card))] rounded-xl p-6 glow-border hover:border-[rgb(var(--primary))] transition-colors cursor-pointer h-full"
            >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-[rgb(var(--primary))]/20 flex items-center justify-center text-[rgb(var(--primary))]">
                            {getGoalTypeIcon(goal.goal_type)}
                        </div>
                        <div>
                            <h3 className="font-bold text-lg mb-1">{goal.title}</h3>
                            {goal.exercise && (
                                <p className="text-sm text-[rgb(var(--foreground-muted))]">
                                    {goal.exercise.name} • {goal.exercise.primary_muscle}
                                </p>
                            )}
                        </div>
                    </div>
                    {getStatusBadge(goal.status)}
                </div>

                {/* Description */}
                {goal.description && (
                    <p className="text-sm text-[rgb(var(--foreground-muted))] mb-4 line-clamp-2">
                        {goal.description}
                    </p>
                )}

                {/* Progress Bar */}
                <div className="mb-4">
                    <GoalProgressBar
                        current={goal.current_value}
                        target={goal.target_value}
                        unit={goal.unit}
                    />
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between text-sm text-[rgb(var(--foreground-muted))] pt-4 border-t border-[rgb(var(--border))]">
                    {goal.target_date ? (
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>Due {formatDate(goal.target_date)}</span>
                        </div>
                    ) : (
                        <span>No deadline</span>
                    )}
                    <span className="font-medium capitalize">
                        {goal.goal_type.replace('_', ' ')}
                    </span>
                </div>
            </motion.div>
        </Link>
    )
}
