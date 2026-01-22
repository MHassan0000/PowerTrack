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
                className="block bg-[#18181B] border border-white/5 rounded-2xl p-6 hover:border-[#10B981]/50 transition-all group h-full flex flex-col justify-between"
            >
                <div>
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-white group-hover:text-[#10B981] transition-colors mb-1">
                                {workout.name}
                            </h3>
                            {workout.description && (
                                <p className="text-sm text-zinc-500 line-clamp-2">
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
                            className="p-2 text-zinc-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors -mt-2 -mr-2"
                            disabled={loading}
                        >
                            ⋮
                        </button>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-2">
                         {workout.is_template && (
                            <span className="px-2.5 py-1 bg-zinc-800 text-zinc-300 rounded-md text-[10px] font-bold uppercase tracking-wider">
                                Template
                            </span>
                        )}
                        {workout.scheduled_date && (
                            <span className="px-2.5 py-1 bg-blue-500/10 text-blue-400 rounded-md text-[10px] font-bold uppercase tracking-wider">
                                {new Date(workout.scheduled_date).toLocaleDateString()}
                            </span>
                        )}
                        {workout.completed_at && (
                            <span className="px-2.5 py-1 bg-[#10B981]/10 text-[#10B981] rounded-md text-[10px] font-bold uppercase tracking-wider">
                                Completed
                            </span>
                        )}
                    </div>
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
                        className="absolute right-2 top-14 z-20 bg-[#27272A] border border-white/10 rounded-xl shadow-2xl overflow-hidden min-w-[160px]"
                    >
                        <button
                            onClick={(e) => {
                                e.preventDefault()
                                handleDuplicate()
                                setShowMenu(false)
                            }}
                            disabled={loading}
                            className="w-full px-4 py-3 text-left hover:bg-white/5 transition-colors text-sm text-zinc-200 font-medium border-b border-white/5"
                        >
                            Duplicate
                        </button>
                        <button
                            onClick={(e) => {
                                e.preventDefault()
                                router.push(`/workouts/${workout.id}/edit`)
                                setShowMenu(false)
                            }}
                            disabled={loading}
                            className="w-full px-4 py-3 text-left hover:bg-white/5 transition-colors text-sm text-zinc-200 font-medium border-b border-white/5"
                        >
                            Edit
                        </button>
                        <button
                            onClick={(e) => {
                                e.preventDefault()
                                handleDelete()
                                setShowMenu(false)
                            }}
                            disabled={loading}
                            className="w-full px-4 py-3 text-left hover:bg-red-500/10 transition-colors text-sm text-red-400 font-medium"
                        >
                            Delete
                        </button>
                    </motion.div>
                </>
            )}
        </motion.div>
    )
}
