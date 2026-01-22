'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Search, Filter, Dumbbell, Activity, Flame, Heart } from 'lucide-react'

interface ExerciseFiltersProps {
    muscles: string[]
    equipment: string[]
}

const CATEGORIES = [
    { label: 'All Workouts', value: '', icon: Filter },
    { label: 'Strength', value: 'Strength', icon: Dumbbell },
    { label: 'HIIT', value: 'HIIT', icon: Flame }, // Mapping to muscle/type logically or just UI placeholders for now, sticking to Provided Muscles
    { label: 'Cardio', value: 'Cardio', icon: Heart },
    { label: 'Yoga', value: 'Yoga', icon: Activity },
]

export function ExerciseFilters({ muscles, equipment }: ExerciseFiltersProps) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [search, setSearch] = useState(searchParams.get('search') || '')
    const [activeMuscle, setActiveMuscle] = useState(searchParams.get('muscle') || '')

    const handleSearch = (term: string) => {
        setSearch(term)
        const params = new URLSearchParams(searchParams.toString())
        if (term) {
            params.set('search', term)
        } else {
            params.delete('search')
        }
        router.push(`/exercises?${params.toString()}`)
    }

    const handleMuscleClick = (muscle: string) => {
        const newValue = activeMuscle === muscle ? '' : muscle
        setActiveMuscle(newValue)
        
        const params = new URLSearchParams(searchParams.toString())
        if (newValue) {
            params.set('muscle', newValue)
        } else {
            params.delete('muscle')
        }
        router.push(`/exercises?${params.toString()}`)
    }

    return (
        <div className="space-y-8">
            {/* Main Search Bar */}
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-zinc-500 group-focus-within:text-[rgb(var(--primary))] transition-colors" />
                </div>
                <input
                    type="text"
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="block w-full pl-12 pr-4 py-4 bg-[#18181B] border border-white/5 rounded-2xl text-white placeholder-zinc-500 focus:outline-none focus:border-[rgb(var(--primary))]/50 focus:ring-1 focus:ring-[rgb(var(--primary))]/50 transition-all text-lg"
                    placeholder="Search exercises, trainers, or body parts..."
                />
            </div>

            {/* Filter Pills */}
            <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleMuscleClick('')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold uppercase tracking-wide whitespace-nowrap transition-all ${
                        activeMuscle === ''
                            ? 'bg-[rgb(var(--primary))] text-black shadow-[0_0_20px_rgba(204,255,0,0.3)]'
                            : 'bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white'
                    }`}
                >
                    <Filter className="w-4 h-4" />
                    All Workouts
                </motion.button>

                {muscles.map((muscle) => (
                    <motion.button
                        key={muscle}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleMuscleClick(muscle)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold uppercase tracking-wide whitespace-nowrap transition-all ${
                            activeMuscle === muscle
                                ? 'bg-[rgb(var(--primary))] text-black shadow-[0_0_20px_rgba(204,255,0,0.3)]'
                                : 'bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white'
                        }`}
                    >
                        {/* Static icon for now, could act dynamically based on muscle */}
                        <Dumbbell className="w-4 h-4" />
                        {muscle}
                    </motion.button>
                ))}
            </div>
        </div>
    )
}
