'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, SlidersHorizontal, X, Check } from 'lucide-react'
import { useDebounce } from '@/hooks/useDebounce'

interface ExerciseFiltersProps {
    muscles: string[]
    equipment: string[]
}

const DIFFICULTY_LEVELS = [
    { value: 'beginner', label: 'Beginner', color: 'text-[#10B981]' },
    { value: 'intermediate', label: 'Intermediate', color: 'text-yellow-500' },
    { value: 'advanced', label: 'Advanced', color: 'text-red-500' },
]

export function ExerciseFilters({ muscles, equipment }: ExerciseFiltersProps) {
    const router = useRouter()
    const searchParams = useSearchParams()

    // Initialize from URL params
    const [search, setSearch] = useState(searchParams.get('search') || '')
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    
    // Local filter state (not applied until user clicks "Apply Filters")
    const [localMuscle, setLocalMuscle] = useState(searchParams.get('muscle') || '')
    const [localEquipment, setLocalEquipment] = useState(searchParams.get('equipment') || '')
    const [localDifficulty, setLocalDifficulty] = useState(searchParams.get('difficulty') || '')
    
    // Applied filters (what's actually in the URL)
    const [activeMuscle, setActiveMuscle] = useState(searchParams.get('muscle') || '')
    const [activeEquipment, setActiveEquipment] = useState(searchParams.get('equipment') || '')
    const [activeDifficulty, setActiveDifficulty] = useState(searchParams.get('difficulty') || '')

    // Debounce search to prevent excessive server requests
    const debouncedSearch = useDebounce(search, 300)

    // Update URL when debounced search value changes
    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString())
        if (debouncedSearch) {
            params.set('search', debouncedSearch)
        } else {
            params.delete('search')
        }
        
        // Only push if the search param actually changed
        const newUrl = `/exercises?${params.toString()}`
        const currentUrl = `/exercises?${searchParams.toString()}`
        if (newUrl !== currentUrl) {
            router.push(newUrl)
        }
    }, [debouncedSearch])

    const handleMuscleClick = (muscle: string) => {
        const newValue = localMuscle === muscle ? '' : muscle
        setLocalMuscle(newValue)
    }

    const handleEquipmentClick = (equip: string) => {
        const newValue = localEquipment === equip ? '' : equip
        setLocalEquipment(newValue)
    }

    const handleDifficultyClick = (difficulty: string) => {
        const newValue = localDifficulty === difficulty ? '' : difficulty
        setLocalDifficulty(newValue)
    }

    const applyFilters = () => {
        // Update active filters
        setActiveMuscle(localMuscle)
        setActiveEquipment(localEquipment)
        setActiveDifficulty(localDifficulty)
        
        // Build URL params
        const params = new URLSearchParams(searchParams.toString())
        
        if (localMuscle) {
            params.set('muscle', localMuscle)
        } else {
            params.delete('muscle')
        }
        
        if (localEquipment) {
            params.set('equipment', localEquipment)
        } else {
            params.delete('equipment')
        }
        
        if (localDifficulty) {
            params.set('difficulty', localDifficulty)
        } else {
            params.delete('difficulty')
        }
        
        router.push(`/exercises?${params.toString()}`)
        setIsFilterOpen(false)
    }

    const clearAllFilters = () => {
        setSearch('')
        setLocalMuscle('')
        setLocalEquipment('')
        setLocalDifficulty('')
        setActiveMuscle('')
        setActiveEquipment('')
        setActiveDifficulty('')
        router.push('/exercises')
        setIsFilterOpen(false)
    }

    const removeFilter = (type: 'muscle' | 'equipment' | 'difficulty') => {
        const params = new URLSearchParams(searchParams.toString())
        params.delete(type)
        
        if (type === 'muscle') {
            setActiveMuscle('')
            setLocalMuscle('')
        } else if (type === 'equipment') {
            setActiveEquipment('')
            setLocalEquipment('')
        } else if (type === 'difficulty') {
            setActiveDifficulty('')
            setLocalDifficulty('')
        }
        
        router.push(`/exercises?${params.toString()}`)
    }

    const hasActiveFilters = activeMuscle || activeEquipment || activeDifficulty
    const activeFilterCount = [activeMuscle, activeEquipment, activeDifficulty].filter(Boolean).length

    return (
        <div className="space-y-4">
            {/* Search Bar with Filter Button */}
            <div className="flex gap-3">
                <div className="relative group flex-1">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-zinc-500 group-focus-within:text-[rgb(var(--primary))] transition-colors" />
                    </div>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="block w-full pl-12 pr-12 py-3.5 bg-[#18181B] border border-white/5 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-[rgb(var(--primary))]/50 focus:ring-1 focus:ring-[rgb(var(--primary))]/50 transition-all"
                        placeholder="Search exercises..."
                    />
                    {search && (
                        <button
                            onClick={() => setSearch('')}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-zinc-500 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>

                <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="relative flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold bg-[#27272A] text-white border border-white/5 hover:bg-[#3F3F46] transition-all"
                >
                    <SlidersHorizontal className="w-4 h-4" />
                    Filters
                    {activeFilterCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#10B981] text-black text-xs font-bold rounded-full flex items-center justify-center">
                            {activeFilterCount}
                        </span>
                    )}
                </button>
            </div>

            {/* Filter Modal/Panel */}
            <AnimatePresence>
                {isFilterOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="bg-[#18181B] border border-white/5 rounded-2xl p-6 space-y-6">
                            {/* Header */}
                            <div className="flex items-center justify-between pb-4 border-b border-white/5">
                                <h3 className="text-lg font-bold text-white">Filter Options</h3>
                                {(localMuscle || localEquipment || localDifficulty) && (
                                    <button
                                        onClick={() => {
                                            setLocalMuscle('')
                                            setLocalEquipment('')
                                            setLocalDifficulty('')
                                        }}
                                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all"
                                    >
                                        <X className="w-4 h-4" />
                                        Clear Selection
                                    </button>
                                )}
                            </div>

                            {/* Muscle Groups */}
                            <div className="space-y-3">
                                <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Muscle Groups</h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                    {muscles.map((muscle) => (
                                        <button
                                            key={muscle}
                                            onClick={() => handleMuscleClick(muscle)}
                                            className={`relative px-4 py-3 rounded-lg text-sm font-medium transition-all border ${
                                                localMuscle === muscle
                                                    ? 'bg-[#10B981]/20 text-[#10B981] border-[#10B981]/50'
                                                    : 'bg-[#27272A] text-zinc-400 border-transparent hover:bg-[#3F3F46] hover:text-white'
                                            }`}
                                        >
                                            {localMuscle === muscle && (
                                                <Check className="absolute top-2 right-2 w-4 h-4" />
                                            )}
                                            {muscle}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Equipment */}
                            <div className="space-y-3">
                                <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Equipment</h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                    {equipment.map((equip) => (
                                        <button
                                            key={equip}
                                            onClick={() => handleEquipmentClick(equip)}
                                            className={`relative px-4 py-3 rounded-lg text-sm font-medium transition-all border ${
                                                localEquipment === equip
                                                    ? 'bg-[#10B981]/20 text-[#10B981] border-[#10B981]/50'
                                                    : 'bg-[#27272A] text-zinc-400 border-transparent hover:bg-[#3F3F46] hover:text-white'
                                            }`}
                                        >
                                            {localEquipment === equip && (
                                                <Check className="absolute top-2 right-2 w-4 h-4" />
                                            )}
                                            {equip}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Difficulty */}
                            <div className="space-y-3">
                                <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Difficulty Level</h4>
                                <div className="grid grid-cols-3 gap-2">
                                    {DIFFICULTY_LEVELS.map((level) => (
                                        <button
                                            key={level.value}
                                            onClick={() => handleDifficultyClick(level.value)}
                                            className={`relative px-4 py-3 rounded-lg text-sm font-medium transition-all border ${
                                                localDifficulty === level.value
                                                    ? `bg-${level.color.split('-')[1]}/20 ${level.color} border-${level.color.split('-')[1]}/50`
                                                    : 'bg-[#27272A] text-zinc-400 border-transparent hover:bg-[#3F3F46] hover:text-white'
                                            }`}
                                        >
                                            {localDifficulty === level.value && (
                                                <Check className="absolute top-2 right-2 w-4 h-4" />
                                            )}
                                            {level.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="pt-4 border-t border-white/5 flex gap-3">
                                <button
                                    onClick={clearAllFilters}
                                    className="flex-1 px-6 py-3 rounded-xl text-sm font-bold bg-[#27272A] text-white hover:bg-[#3F3F46] transition-all"
                                >
                                    Clear All
                                </button>
                                <button
                                    onClick={applyFilters}
                                    className="flex-1 px-6 py-3 rounded-xl text-sm font-bold bg-[#10B981] text-black hover:bg-[#10B981]/90 transition-all"
                                >
                                    Apply Filters
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Active Filters Display */}
            {hasActiveFilters && (
                <div className="flex flex-wrap gap-2">
                    <span className="text-xs text-zinc-500 font-medium">Active filters:</span>
                    {activeMuscle && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30">
                            {activeMuscle}
                            <button onClick={() => removeFilter('muscle')} className="hover:opacity-70">
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    )}
                    {activeEquipment && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30">
                            {activeEquipment}
                            <button onClick={() => removeFilter('equipment')} className="hover:opacity-70">
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    )}
                    {activeDifficulty && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30">
                            {activeDifficulty}
                            <button onClick={() => removeFilter('difficulty')} className="hover:opacity-70">
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    )}
                </div>
            )}
        </div>
    )
}
