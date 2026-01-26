'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Minus, Plus } from 'lucide-react'

interface SetLoggerProps {
    exerciseName: string
    setNumber: number
    previousSet?: {
        weight_kg: number | null
        reps: number | null
    }
    onLogSet: (data: { weight_kg: number; reps: number }) => Promise<void>
    onSkip?: () => void
}

export function SetLogger({ exerciseName, setNumber, previousSet, onLogSet, onSkip }: SetLoggerProps) {
    const [weight, setWeight] = useState(previousSet?.weight_kg || 0)
    const [reps, setReps] = useState(previousSet?.reps || 0)
    const [logging, setLogging] = useState(false)

    const handleLogSet = async () => {
        setLogging(true)
        try {
            await onLogSet({ weight_kg: weight, reps })
        } finally {
            setLogging(false)
        }
    }

    const adjustWeight = (delta: number) => {
        setWeight(Math.max(0, weight + delta))
    }

    const adjustReps = (delta: number) => {
        setReps(Math.max(0, reps + delta))
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[rgb(var(--card))] rounded-2xl p-4 md:p-6 glow-border"
        >
            {/* Header */}
            <div className="mb-6">
                <h3 className="text-xl font-bold mb-1">{exerciseName}</h3>
                <p className="text-[rgb(var(--foreground-muted))] text-sm">
                    Set {setNumber}
                    {previousSet && (
                        <span className="ml-2 text-[rgb(var(--primary))]">
                            Previous: {previousSet.weight_kg}kg × {previousSet.reps}
                        </span>
                    )}
                </p>
            </div>

            {/* Weight Input */}
            <div className="mb-6">
                <label className="block text-sm font-medium mb-3">Weight (kg)</label>
                {/* Mobile Layout: 3 Columns (Left Btns | Value | Right Btns) */}
                <div className="flex md:hidden items-stretch justify-between gap-3">
                     <div className="flex flex-col gap-2">
                        <button
                            onClick={() => adjustWeight(-1)}
                            className="w-14 h-10 rounded-lg bg-[rgb(var(--background-secondary))] hover:bg-[rgb(var(--card-hover))] transition-colors flex items-center justify-center"
                        >
                            <Minus className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => adjustWeight(-5)}
                            className="w-14 h-10 rounded-lg bg-[rgb(var(--background-secondary))] hover:bg-[rgb(var(--card-hover))] transition-colors flex items-center justify-center font-medium text-xs"
                        >
                            -5
                        </button>
                        <button
                            onClick={() => adjustWeight(-10)}
                            className="w-14 h-10 rounded-lg bg-[rgb(var(--background-secondary))] hover:bg-[rgb(var(--card-hover))] transition-colors flex items-center justify-center font-medium text-xs"
                        >
                            -10
                        </button>
                     </div>

                     <div className="flex-1 flex flex-col items-center justify-center bg-[rgb(var(--background-secondary))]/30 rounded-xl">
                        <div className="text-4xl font-bold glow-text">{weight}</div>
                        <div className="text-xs text-[rgb(var(--foreground-muted))]">kg</div>
                     </div>

                     <div className="flex flex-col gap-2">
                        <button
                            onClick={() => adjustWeight(1)}
                            className="w-14 h-10 rounded-lg bg-[rgb(var(--background-secondary))] hover:bg-[rgb(var(--card-hover))] transition-colors flex items-center justify-center"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => adjustWeight(5)}
                            className="w-14 h-10 rounded-lg bg-[rgb(var(--background-secondary))] hover:bg-[rgb(var(--card-hover))] transition-colors flex items-center justify-center font-medium text-xs"
                        >
                            +5
                        </button>
                        <button
                            onClick={() => adjustWeight(10)}
                            className="w-14 h-10 rounded-lg bg-[rgb(var(--background-secondary))] hover:bg-[rgb(var(--card-hover))] transition-colors flex items-center justify-center font-medium text-xs"
                        >
                            +10
                        </button>
                     </div>
                </div>

                {/* Desktop Layout: Single Row */}
                <div className="hidden md:flex items-center gap-3">
                    <button
                        onClick={() => adjustWeight(-10)}
                        className="min-h-12 min-w-12 rounded-lg bg-[rgb(var(--background-secondary))] hover:bg-[rgb(var(--card-hover))] transition-colors flex items-center justify-center"
                        type="button"
                    >
                        <span className="text-lg font-medium">-10</span>
                    </button>
                    <button
                        onClick={() => adjustWeight(-5)}
                        className="min-h-12 min-w-12 rounded-lg bg-[rgb(var(--background-secondary))] hover:bg-[rgb(var(--card-hover))] transition-colors flex items-center justify-center"
                        type="button"
                    >
                        <span className="text-lg font-medium">-5</span>
                    </button>
                    <button
                        onClick={() => adjustWeight(-1)}
                        className="min-h-12 min-w-12 rounded-lg bg-[rgb(var(--background-secondary))] hover:bg-[rgb(var(--card-hover))] transition-colors flex items-center justify-center"
                        type="button"
                    >
                        <Minus className="w-5 h-5" />
                    </button>

                    <div className="flex-1 text-center">
                        <div className="text-4xl font-bold glow-text">{weight}</div>
                        <div className="text-sm text-[rgb(var(--foreground-muted))]">kg</div>
                    </div>

                    <button
                        onClick={() => adjustWeight(1)}
                        className="min-h-12 min-w-12 rounded-lg bg-[rgb(var(--background-secondary))] hover:bg-[rgb(var(--card-hover))] transition-colors flex items-center justify-center"
                        type="button"
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => adjustWeight(5)}
                        className="min-h-12 min-w-12 rounded-lg bg-[rgb(var(--background-secondary))] hover:bg-[rgb(var(--card-hover))] transition-colors flex items-center justify-center"
                        type="button"
                    >
                        <span className="text-lg font-medium">+5</span>
                    </button>
                    <button
                        onClick={() => adjustWeight(10)}
                        className="min-h-12 min-w-12 rounded-lg bg-[rgb(var(--background-secondary))] hover:bg-[rgb(var(--card-hover))] transition-colors flex items-center justify-center"
                        type="button"
                    >
                        <span className="text-lg font-medium">+10</span>
                    </button>
                </div>
            </div>

            {/* Reps Input */}
            <div className="mb-6">
                <label className="block text-sm font-medium mb-3">Reps</label>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => adjustReps(-1)}
                        className="min-h-12 min-w-12 rounded-lg bg-[rgb(var(--background-secondary))] hover:bg-[rgb(var(--card-hover))] transition-colors flex items-center justify-center"
                        type="button"
                    >
                        <Minus className="w-5 h-5" />
                    </button>

                    <div className="flex-1 text-center">
                        <div className="text-3xl md:text-4xl font-bold glow-text">{reps}</div>
                        <div className="text-xs md:text-sm text-[rgb(var(--foreground-muted))]">reps</div>
                    </div>

                    <button
                        onClick={() => adjustReps(1)}
                        className="min-h-12 min-w-12 rounded-lg bg-[rgb(var(--background-secondary))] hover:bg-[rgb(var(--card-hover))] transition-colors flex items-center justify-center"
                        type="button"
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
                {onSkip && (
                    <button
                        onClick={onSkip}
                        className="flex-1 min-h-14 rounded-lg border-2 border-[rgb(var(--border))] hover:bg-[rgb(var(--card-hover))] transition-colors font-medium"
                        type="button"
                    >
                        Skip Set
                    </button>
                )}
                <button
                    onClick={handleLogSet}
                    disabled={logging || (weight === 0 && reps === 0)}
                    className="flex-1 min-h-14 rounded-lg bg-[rgb(var(--primary))] text-[rgb(var(--background))] hover:bg-[rgb(var(--primary-hover))] transition-colors font-bold shadow-lg shadow-[rgb(var(--primary))]/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    type="button"
                >
                    {logging ? 'Logging...' : 'Log Set'}
                </button>
            </div>
        </motion.div>
    )
}
