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
                className="block bg-[#18181B] border border-white/5 rounded-2xl overflow-hidden hover:border-[#10B981]/50 transition-all group h-full flex flex-col"
            >
                {/* Image */}
                <div className="relative h-48 bg-[#27272A] overflow-hidden">
                    {exercise.media_url ? (
                        <Image
                            src={exercise.media_url}
                            alt={exercise.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-6xl text-zinc-700">
                            💪
                        </div>
                    )}
                    {/* Difficulty Badge */}
                    <div className="absolute top-3 right-3">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getDifficultyColor(exercise.difficulty)}`}>
                            {exercise.difficulty}
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#10B981] transition-colors">
                            {exercise.name}
                        </h3>

                        {exercise.description && (
                            <p className="text-sm text-zinc-500 mb-4 line-clamp-2">
                                {exercise.description}
                            </p>
                        )}
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5">
                        <span className="px-2 py-1 bg-[#10B981]/10 text-[#10B981] rounded text-[10px] font-bold uppercase tracking-wider">
                            {exercise.primary_muscle}
                        </span>
                        <span className="px-2 py-1 bg-zinc-800 text-zinc-400 rounded text-[10px] font-bold uppercase tracking-wider">
                            {exercise.equipment}
                        </span>
                    </div>
                </div>
            </Link>
        </motion.div>
    )
}
