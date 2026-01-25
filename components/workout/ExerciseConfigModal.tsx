'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Dumbbell, Hash, Clock, Weight } from 'lucide-react'
import type { Exercise } from '@/lib/actions/exercises'
import Image from 'next/image'
import { toast } from 'sonner'
import { exerciseConfigSchema } from '@/lib/validations/workout'

interface ExerciseConfigModalProps {
    exercise: Exercise | null
    onClose: () => void
    onConfirm: (config: {
        sets: number
        duration_seconds?: number
        rest_seconds: number
        notes?: string
    }) => void
}

export function ExerciseConfigModal({ exercise, onClose, onConfirm }: ExerciseConfigModalProps) {
    const [sets, setSets] = useState(3)
    const [restSeconds, setRestSeconds] = useState(60)
    const [duration, setDuration] = useState<number | ''>(30)
    const [notes, setNotes] = useState('')

    if (!exercise) return null

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        
        const config = {
            sets,
            rest_seconds: restSeconds,
            duration_seconds: duration || undefined,
            notes: notes || undefined
        }

        // Validate with Zod
        const validation = exerciseConfigSchema.safeParse(config)
        if (!validation.success) {
            const errors = validation.error.flatten().fieldErrors
            const firstError = Object.values(errors).flat()[0]
            toast.error(firstError || 'Invalid input')
            return
        }

        // Convert null to undefined for TypeScript compatibility
        onConfirm({
            sets: validation.data.sets,
            rest_seconds: validation.data.rest_seconds,
            duration_seconds: validation.data.duration_seconds ?? undefined,
            notes: validation.data.notes ?? undefined
        })
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    onClick={(e) => e.stopPropagation()}
                    className="relative w-full max-w-2xl max-h-[90vh] bg-[#18181B] rounded-3xl border border-white/10 overflow-hidden flex flex-col"
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-[#27272A] hover:bg-[#3F3F46] flex items-center justify-center text-zinc-400 hover:text-white transition-colors z-10"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Header */}
                    <div className="p-8 pb-6 border-b border-white/5">
                        <div className="flex items-start gap-4">
                            {/* Exercise Image */}
                            <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-black/20 shrink-0 border border-white/5">
                                {exercise.media_url ? (
                                    <Image
                                        src={exercise.media_url}
                                        alt={exercise.name}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Dumbbell className="w-8 h-8 text-zinc-600" />
                                    </div>
                                )}
                            </div>

                            {/* Exercise Info */}
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-white mb-2">
                                    Configure Exercise
                                </h2>
                                <h3 className="text-lg font-semibold text-[#10B981] mb-1">
                                    {exercise.name}
                                </h3>
                                <p className="text-sm text-zinc-400">
                                    {exercise.primary_muscle} • {exercise.equipment}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                        <div className="flex-1 overflow-y-auto p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Sets */}
                            <div>
                                <label htmlFor="sets" className="text-sm font-bold text-zinc-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <Hash className="w-4 h-4 text-[#10B981]" />
                                    Sets
                                </label>
                                <input
                                    type="number"
                                    id="sets"
                                    min="1"
                                    max="20"
                                    required
                                    value={sets}
                                    onChange={(e) => setSets(Number(e.target.value))}
                                    className="w-full px-4 py-3 bg-[#27272A] border border-white/5 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#10B981] transition-all"
                                />
                            </div>

                            {/* Rest Time */}
                            <div>
                                <label htmlFor="rest" className="text-sm font-bold text-zinc-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-[#10B981]" />
                                    Rest (seconds)
                                </label>
                                <input
                                    type="number"
                                    id="rest"
                                    min="0"
                                    max="600"
                                    required
                                    value={restSeconds}
                                    onChange={(e) => setRestSeconds(Number(e.target.value))}
                                    className="w-full px-4 py-3 bg-[#27272A] border border-white/5 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#10B981] transition-all"
                                />
                            </div>

                            <div>
                                <label htmlFor="duration" className="text-sm font-bold text-zinc-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-[#10B981]" />

                                    Duration (per set) - Seconds
                                </label>
                                <input
                                    type="number"
                                    id="duration"
                                    min="5"
                                    required
                                    placeholder="e.g., 30"
                                    value={duration}
                                    onChange={(e) => setDuration(e.target.value ? Number(e.target.value) : '')}
                                    className="w-full px-4 py-3 bg-[#27272A] border border-white/5 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#10B981] transition-all"
                                />
                                <p className="text-xs text-zinc-500 mt-1">Minimum 5 seconds per set</p>
                            </div>

                            {/* Notes */}
                            <div className="md:col-span-2">
                                <label htmlFor="notes" className="block text-sm font-bold text-zinc-300 uppercase tracking-wider mb-2">
                                    Notes
                                </label>
                                <textarea
                                    id="notes"
                                    rows={3}
                                    placeholder="Any specific instructions or notes..."
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    className="w-full px-4 py-3 bg-[#27272A] border border-white/5 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#10B981] transition-all resize-none"
                                />
                            </div>
                        </div>
                        </div>

                        {/* Actions - Fixed at bottom */}
                        <div className="border-t border-white/5 p-6 bg-[#18181B]">
                            <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 py-3.5 bg-[#27272A] hover:bg-[#3F3F46] text-white font-medium rounded-xl transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex-1 py-3.5 bg-[#10B981] hover:bg-[#059669] text-black font-bold rounded-xl transition-colors"
                            >
                                Add to Workout
                            </button>
                        </div>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}
