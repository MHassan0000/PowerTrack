'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'

interface ExerciseFiltersProps {
    muscles: string[]
    equipment: string[]
}

export function ExerciseFilters({ muscles, equipment }: ExerciseFiltersProps) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [search, setSearch] = useState(searchParams.get('search') || '')
    const [muscle, setMuscle] = useState(searchParams.get('muscle') || '')
    const [equipmentFilter, setEquipmentFilter] = useState(searchParams.get('equipment') || '')
    const [difficulty, setDifficulty] = useState(searchParams.get('difficulty') || '')

    const applyFilters = () => {
        const params = new URLSearchParams()

        if (search) params.set('search', search)
        if (muscle) params.set('muscle', muscle)
        if (equipmentFilter) params.set('equipment', equipmentFilter)
        if (difficulty) params.set('difficulty', difficulty)

        router.push(`/exercises?${params.toString()}`)
    }

    const clearFilters = () => {
        setSearch('')
        setMuscle('')
        setEquipmentFilter('')
        setDifficulty('')
        router.push('/exercises')
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glow-border bg-[rgb(var(--card))] backdrop-blur-xl rounded-xl p-6 mb-6"
        >
            <h3 className="text-lg font-bold mb-4">Filters</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Search */}
                <div className="lg:col-span-2">
                    <label htmlFor="search" className="block text-sm font-medium mb-2">
                        Search
                    </label>
                    <input
                        id="search"
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                        placeholder="Search exercises..."
                        className="w-full px-4 py-2 bg-[rgb(var(--background-secondary))] border border-[rgb(var(--border))] rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))] transition-all"
                    />
                </div>

                {/* Muscle Group */}
                <div>
                    <label htmlFor="muscle" className="block text-sm font-medium mb-2">
                        Muscle Group
                    </label>
                    <select
                        id="muscle"
                        value={muscle}
                        onChange={(e) => setMuscle(e.target.value)}
                        className="w-full px-4 py-2 bg-[rgb(var(--background-secondary))] border border-[rgb(var(--border))] rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))] transition-all"
                    >
                        <option value="">All Muscles</option>
                        {muscles.map((m) => (
                            <option key={m} value={m}>
                                {m}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Equipment */}
                <div>
                    <label htmlFor="equipment" className="block text-sm font-medium mb-2">
                        Equipment
                    </label>
                    <select
                        id="equipment"
                        value={equipmentFilter}
                        onChange={(e) => setEquipmentFilter(e.target.value)}
                        className="w-full px-4 py-2 bg-[rgb(var(--background-secondary))] border border-[rgb(var(--border))] rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))] transition-all"
                    >
                        <option value="">All Equipment</option>
                        {equipment.map((eq) => (
                            <option key={eq} value={eq}>
                                {eq}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Difficulty */}
                <div>
                    <label htmlFor="difficulty" className="block text-sm font-medium mb-2">
                        Difficulty
                    </label>
                    <select
                        id="difficulty"
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                        className="w-full px-4 py-2 bg-[rgb(var(--background-secondary))] border border-[rgb(var(--border))] rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))] transition-all"
                    >
                        <option value="">All Levels</option>
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                    </select>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-4">
                <button
                    onClick={applyFilters}
                    className="px-6 py-2 bg-[rgb(var(--primary))] text-[rgb(var(--background))] font-medium rounded-lg hover:bg-[rgb(var(--primary-hover))] transition-all shadow-lg shadow-[rgb(var(--primary))]/20"
                >
                    Apply Filters
                </button>
                <button
                    onClick={clearFilters}
                    className="px-6 py-2 bg-[rgb(var(--card-hover))] text-[rgb(var(--foreground-secondary))] font-medium rounded-lg hover:bg-[rgb(var(--border))] transition-all"
                >
                    Clear
                </button>
            </div>
        </motion.div>
    )
}
