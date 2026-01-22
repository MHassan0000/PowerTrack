'use client'

import { motion } from 'framer-motion'
import { Calendar, Target, TrendingUp, CheckCircle2, Archive, Dumbbell } from 'lucide-react'
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
                return <Dumbbell className="w-5 h-5" />
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
                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#10B981]/10 text-[#10B981] rounded-sm">
                        Active
                    </span>
                )
            case 'completed':
                return (
                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-green-500/20 text-green-500 rounded-sm flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Done
                    </span>
                )
            case 'archived':
                return (
                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-zinc-500/20 text-zinc-500 rounded-sm flex items-center gap-1">
                        <Archive className="w-3 h-3" />
                        Archived
                    </span>
                )
        }
    }

    return (
        <Link href={`/goals/${goal.id}`}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#18181B] rounded-2xl p-6 border border-white/5 hover:border-[#10B981]/50 transition-colors cursor-pointer h-full group flex flex-col justify-between"
            >
                <div>
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-[#27272A] flex items-center justify-center text-zinc-300 group-hover:text-white group-hover:bg-[#10B981] transition-all duration-300 shadow-lg">
                                {getGoalTypeIcon(goal.goal_type)}
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-white mb-1 group-hover:text-[#10B981] transition-colors">{goal.title}</h3>
                                {goal.exercise && (
                                    <p className="text-xs text-zinc-500 font-medium uppercase tracking-wide">
                                        {goal.exercise.name}
                                    </p>
                                )}
                            </div>
                        </div>
                        {getStatusBadge(goal.status)}
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                        <GoalProgressBar
                            current={goal.current_value}
                            target={goal.target_value}
                            unit={goal.unit}
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between text-xs text-zinc-500 pt-4 border-t border-white/5">
                    {goal.target_date ? (
                        <div className="flex items-center gap-2">
                            <Calendar className="w-3 h-3" />
                            <span>Due {formatDate(goal.target_date)}</span>
                        </div>
                    ) : (
                        <span>No deadline</span>
                    )}
                    <span className="font-bold uppercase tracking-wider text-zinc-600">
                        {goal.goal_type.replace('_', ' ')}
                    </span>
                </div>
            </motion.div>
        </Link>
    )
}
