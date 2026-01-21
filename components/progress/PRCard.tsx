'use client'

import { motion } from 'framer-motion'
import { TrendingUp, Calendar, Dumbbell } from 'lucide-react'
import type { PersonalRecord } from '@/lib/actions/progress'

interface PRCardProps {
    pr: PersonalRecord
    index?: number
}

export function PRCard({ pr, index = 0 }: PRCardProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        })
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-[rgb(var(--card))] rounded-xl p-5 glow-border hover:border-[rgb(var(--primary))] transition-colors"
        >
            {/* Exercise Name */}
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="font-bold text-lg mb-1">{pr.exercise_name}</h3>
                    <p className="text-sm text-[rgb(var(--foreground-muted))]">
                        {pr.primary_muscle} • {pr.equipment}
                    </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-[rgb(var(--primary))]/20 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-[rgb(var(--primary))]" />
                </div>
            </div>

            {/* PR Stats */}
            <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                    <span className="text-sm text-[rgb(var(--foreground-muted))]">Best Set</span>
                    <span className="font-bold text-lg">
                        {pr.pr_weight}kg × {pr.pr_reps}
                    </span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-sm text-[rgb(var(--foreground-muted))]">Total Volume</span>
                    <span className="font-bold glow-text">{Math.round(pr.pr_volume)}kg</span>
                </div>
            </div>

            {/* Date Achieved */}
            <div className="pt-3 border-t border-[rgb(var(--border))] flex items-center gap-2 text-sm text-[rgb(var(--foreground-muted))]">
                <Calendar className="w-4 h-4" />
                <span>Achieved {formatDate(pr.achieved_at)}</span>
            </div>
        </motion.div>
    )
}

interface PRGridProps {
    prs: PersonalRecord[]
}

export function PRGrid({ prs }: PRGridProps) {
    if (prs.length === 0) {
        return (
            <div className="bg-[rgb(var(--card))] rounded-xl p-8 text-center glow-border">
                <Dumbbell className="w-12 h-12 mx-auto mb-3 text-[rgb(var(--primary))]" />
                <p className="text-[rgb(var(--foreground-muted))]">
                    No personal records yet. Complete some workouts to set your first PR!
                </p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {prs.map((pr, index) => (
                <PRCard key={pr.exercise_id} pr={pr} index={index} />
            ))}
        </div>
    )
}
