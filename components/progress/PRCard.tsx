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
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group flex items-center justify-between p-4 rounded-xl bg-[#27272A] border border-white/5 hover:border-[#10B981]/30 transition-all"
        >
            {/* Left: Info */}
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#10B981]/10 flex items-center justify-center text-[#10B981] group-hover:bg-[#10B981] group-hover:text-black transition-colors">
                    <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="font-bold text-white text-sm mb-0.5">{pr.exercise_name}</h3>
                    <p className="text-xs text-zinc-500">
                        {pr.primary_muscle} • {formatDate(pr.achieved_at)}
                    </p>
                </div>
            </div>

            {/* Right: Stats */}
            <div className="text-right">
                <div className="font-bold text-white text-lg">
                    {pr.pr_weight}<span className="text-xs text-zinc-500 font-normal ml-0.5">kg</span>
                </div>
                <div className="text-xs text-zinc-400">
                    {pr.pr_reps} reps
                </div>
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
            <div className="bg-[#27272A] rounded-xl p-8 text-center border border-white/5">
                <div className="w-12 h-12 rounded-full bg-[#10B981]/10 flex items-center justify-center mx-auto mb-4 text-[#10B981]">
                    <Dumbbell className="w-6 h-6" />
                </div>
                <p className="text-zinc-400 text-sm">
                    No personal records yet.
                </p>
            </div>
        )
    }

    return (
        <div className="space-y-3">
            {prs.map((pr, index) => (
                <PRCard key={pr.exercise_id} pr={pr} index={index} />
            ))}
        </div>
    )
}
