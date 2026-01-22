'use client'

import { Exercise } from '@/lib/actions/exercises'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Clock, Dumbbell } from 'lucide-react'

interface ExerciseCardProps {
    exercise: Exercise
    index?: number
}

// Map muscle groups to Unsplash placeholder images
const MUSCLE_IMAGES: Record<string, string> = {
    'Chest': 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop',
    'Back': 'https://images.unsplash.com/photo-1603287681836-e566d558e658?q=80&w=2070&auto=format&fit=crop',
    'Legs': 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=2069&auto=format&fit=crop',
    'Shoulders': 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=2069&auto=format&fit=crop',
    'Arms': 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=2070&auto=format&fit=crop',
    'Abs': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070&auto=format&fit=crop',
    'Cardio': 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?q=80&w=2066&auto=format&fit=crop',
}

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop'

export function ExerciseCard({ exercise, index = 0 }: ExerciseCardProps) {
    const bgImage = exercise.media_url || MUSCLE_IMAGES[exercise.primary_muscle] || DEFAULT_IMAGE

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty.toLowerCase()) {
            case 'beginner': return 'bg-[#10B981]/20 text-[#10B981]'
            case 'intermediate': return 'bg-yellow-500/20 text-yellow-500'
            case 'advanced': return 'bg-red-500/20 text-red-500'
            default: return 'bg-zinc-500/20 text-zinc-400'
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="group relative h-80 rounded-3xl overflow-hidden cursor-pointer bg-[#18181B] border border-white/5 hover:border-[#10B981]/30 transition-all"
        >
            <Link href={`/exercises/${exercise.id}`} className="block w-full h-full relative">
                {/* Background Image */}
                <Image
                    src={bgImage}
                    alt={exercise.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-60 group-hover:opacity-40"
                />

                {/* Overlay - Dark Gradient */}
                <div className="absolute inset-0 bg-linear-to-t from-[#18181B] via-[#18181B]/40 to-transparent" />

                {/* Floating Badge */}
                <div className="absolute top-4 right-4 z-10">
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider backdrop-blur-md ${getDifficultyColor(exercise.difficulty)}`}>
                        {exercise.difficulty}
                    </span>
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                    {/* Meta Info */}
                    <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center gap-1.5 text-[#10B981] text-xs font-bold uppercase tracking-wider">
                            <Clock className="w-3.5 h-3.5" />
                            <span>15 MIN</span> {/* Placeholder duration */}
                        </div>
                        <div className="w-1 h-1 rounded-full bg-white/20" />
                        <div className="flex items-center gap-1.5 text-zinc-400 text-xs font-bold uppercase tracking-wider">
                            <Dumbbell className="w-3.5 h-3.5" />
                            <span>{exercise.primary_muscle}</span>
                        </div>
                    </div>

                    <h3 className="text-xl font-bold text-white leading-tight mb-2 group-hover:text-[#10B981] transition-colors">
                        {exercise.name}
                    </h3>
                    
                    <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider line-clamp-1">
                        {exercise.equipment || 'No Equipment'} • {exercise.secondary_muscles?.[0] || 'Isolation'}
                    </p>
                </div>
            </Link>
        </motion.div>
    )
}
