'use client'

import { Workout } from '@/lib/actions/workouts'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'
import { deleteWorkout, duplicateWorkout } from '@/lib/actions/workouts'
import { useRouter } from 'next/navigation'

interface WorkoutCardProps {
    workout: Workout
    index?: number
}

export function WorkoutCard({ workout, index = 0 }: WorkoutCardProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [showMenu, setShowMenu] = useState(false)

    const handleDelete = async () => {
        if (!confirm(`Delete "${workout.name}"?`)) return

        setLoading(true)
        const result = await deleteWorkout(workout.id)

        if (result.error) {
            alert(`Error: ${result.error}`)
        } else {
            router.refresh()
        }
        setLoading(false)
    }

    const handleDuplicate = async () => {
        setLoading(true)
        const result = await duplicateWorkout(workout.id)

        if (result.error) {
            alert(`Error: ${result.error}`)
        } else {
            router.refresh()
        }
        setLoading(false)
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="relative"
        >
            <Link
                href={`/workouts/${workout.id}`}
                className="block glow-border bg-[rgb(var(--card))] backdrop-blur-xl rounded-xl p-6 hover:shadow-lg hover:shadow-[rgb(var(--primary))]/20 transition-all group"
            >
                <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                        <h3 className="text-xl font-bold group-hover:text-[rgb(var(--primary))] transition-colors mb-1">
                            {workout.name}
                        </h3>
                        {workout.description && (
                            <p className="text-sm text-[rgb(var(--foreground-muted))] line-clamp-2">
                                {workout.description}
                            </p>
                        )}
                    </div>

                    {/* Menu Button */}
                    <button
                        onClick={(e) => {
                            e.preventDefault()
                            setShowMenu(!showMenu)
                        }}
                        className="p-2 hover:bg-[rgb(var(--card-hover))] rounded-lg transition-colors"
                        disabled={loading}
                    >
                        ⋮
                    </button>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                    {workout.is_template && (
                        <span className="px-2 py-1 bg-[rgb(var(--primary))]/10 border border-[rgb(var(--primary))]/30 rounded-md text-xs">
                            📋 Template
                        </span>
                    )}
                    {workout.scheduled_date && (
                        <span className="px-2 py-1 bg-blue-500/10 border border-blue-500/30 rounded-md text-xs text-blue-400">
                            📅 {new Date(workout.scheduled_date).toLocaleDateString()}
                        </span>
                    )}
                    {workout.completed_at && (
                        <span className="px-2 py-1 bg-green-500/10 border border-green-500/30 rounded-md text-xs text-green-400">
                            ✅ Completed
                        </span>
                    )}
                </div>
            </Link>

            {/* Dropdown Menu */}
            {showMenu && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowMenu(false)}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute right-2 top-16 z-20 glow-border bg-[rgb(var(--card))] backdrop-blur-xl rounded-lg shadow-xl overflow-hidden min-w-[150px]"
                    >
                        <button
                            onClick={(e) => {
                                e.preventDefault()
                                handleDuplicate()
                                setShowMenu(false)
                            }}
                            disabled={loading}
                            className="w-full px-4 py-2 text-left hover:bg-[rgb(var(--card-hover))] transition-colors text-sm"
                        >
                            📋 Duplicate
                        </button>
                        <button
                            onClick={(e) => {
                                e.preventDefault()
                                router.push(`/workouts/${workout.id}/edit`)
                                setShowMenu(false)
                            }}
                            disabled={loading}
                            className="w-full px-4 py-2 text-left hover:bg-[rgb(var(--card-hover))] transition-colors text-sm"
                        >
                            ✏️ Edit
                        </button>
                        <button
                            onClick={(e) => {
                                e.preventDefault()
                                handleDelete()
                                setShowMenu(false)
                            }}
                            disabled={loading}
                            className="w-full px-4 py-2 text-left hover:bg-red-500/20 transition-colors text-sm text-red-400"
                        >
                            🗑️ Delete
                        </button>
                    </motion.div>
                </>
            )}
        </motion.div>
    )
}
