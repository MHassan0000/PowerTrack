'use client'

import { Exercise } from '@/lib/actions/exercises'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

interface ExerciseCardProps {
    exercise: Exercise
    index?: number
}

export function ExerciseCard({ exercise, index = 0 }: ExerciseCardProps) {
    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'beginner':
                return 'text-green-400 bg-green-500/10 border-green-500/30'
            case 'intermediate':
                return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30'
            case 'advanced':
                return 'text-red-400 bg-red-500/10 border-red-500/30'
            default:
                return 'text-[rgb(var(--primary))] bg-[rgb(var(--primary))]/10 border-[rgb(var(--primary))]/30'
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
        >
            <Link
                href={`/exercises/${exercise.id}`}
                className="block glow-border bg-[rgb(var(--card))] backdrop-blur-xl rounded-xl overflow-hidden hover:shadow-lg hover:shadow-[rgb(var(--primary))]/20 transition-all group"
            >
                {/* Image */}
                <div className="relative h-48 bg-[rgb(var(--background-secondary))] overflow-hidden">
                    {exercise.media_url ? (
                        <Image
                            src={exercise.media_url}
                            alt={exercise.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-6xl">
                            💪
                        </div>
                    )}
                    {/* Difficulty Badge */}
                    <div className="absolute top-3 right-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(exercise.difficulty)}`}>
                            {exercise.difficulty.charAt(0).toUpperCase() + exercise.difficulty.slice(1)}
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-5">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-[rgb(var(--primary))] transition-colors">
                        {exercise.name}
                    </h3>

                    {exercise.description && (
                        <p className="text-sm text-[rgb(var(--foreground-muted))] mb-3 line-clamp-2">
                            {exercise.description}
                        </p>
                    )}

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 bg-[rgb(var(--primary))]/10 border border-[rgb(var(--primary))]/30 rounded-md text-xs">
                            🎯 {exercise.primary_muscle}
                        </span>
                        <span className="px-2 py-1 bg-[rgb(var(--primary))]/10 border border-[rgb(var(--primary))]/30 rounded-md text-xs">
                            🏋️ {exercise.equipment}
                        </span>
                    </div>
                </div>
            </Link>
        </motion.div>
    )
}
