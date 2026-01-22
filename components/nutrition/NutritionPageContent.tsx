'use client'

import { useState, useTransition } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Apple, Coffee, Sun, Moon, Cookie, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import { addNutritionLog, deleteNutritionLog, MealType, NutritionLog, DailyNutritionSummary } from '@/lib/actions/nutrition'

interface NutritionPageContentProps {
    initialLogs: Record<MealType, NutritionLog[]>
    initialSummary: DailyNutritionSummary
    initialDate: string
}

const MEAL_CONFIG: Record<MealType, { label: string; icon: React.ReactNode; color: string }> = {
    breakfast: { label: 'Breakfast', icon: <Coffee className="w-5 h-5" />, color: 'text-yellow-400' },
    lunch: { label: 'Lunch', icon: <Sun className="w-5 h-5" />, color: 'text-orange-400' },
    dinner: { label: 'Dinner', icon: <Moon className="w-5 h-5" />, color: 'text-blue-400' },
    snack: { label: 'Snacks', icon: <Cookie className="w-5 h-5" />, color: 'text-pink-400' },
    other: { label: 'Other', icon: <Apple className="w-5 h-5" />, color: 'text-green-400' },
}

const CALORIE_GOAL = 2000
const PROTEIN_GOAL = 150
const CARBS_GOAL = 250
const FAT_GOAL = 65

export function NutritionPageContent({ initialLogs, initialSummary, initialDate }: NutritionPageContentProps) {
    const [isPending, startTransition] = useTransition()
    const [logs, setLogs] = useState(initialLogs)
    const [summary, setSummary] = useState(initialSummary)
    const [showAddModal, setShowAddModal] = useState(false)
    const [selectedMeal, setSelectedMeal] = useState<MealType>('breakfast')
    const [currentDate, setCurrentDate] = useState(new Date(initialDate))

    const [formData, setFormData] = useState({
        food_item: '',
        calories: '',
        protein_g: '',
        carbs_g: '',
        fat_g: '',
        notes: '',
    })

    const handleAddMeal = (mealType: MealType) => {
        setSelectedMeal(mealType)
        setShowAddModal(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        startTransition(async () => {
            const result = await addNutritionLog({
                meal_type: selectedMeal,
                food_item: formData.food_item,
                calories: formData.calories ? parseInt(formData.calories) : undefined,
                protein_g: formData.protein_g ? parseFloat(formData.protein_g) : undefined,
                carbs_g: formData.carbs_g ? parseFloat(formData.carbs_g) : undefined,
                fat_g: formData.fat_g ? parseFloat(formData.fat_g) : undefined,
                notes: formData.notes || undefined,
            })

            if (result.data) {
                setLogs(prev => ({
                    ...prev,
                    [selectedMeal]: [...prev[selectedMeal], result.data!]
                }))
                setSummary(prev => ({
                    ...prev,
                    totalCalories: prev.totalCalories + (result.data!.calories || 0),
                    totalProtein: prev.totalProtein + (Number(result.data!.protein_g) || 0),
                    totalCarbs: prev.totalCarbs + (Number(result.data!.carbs_g) || 0),
                    totalFat: prev.totalFat + (Number(result.data!.fat_g) || 0),
                    mealCount: prev.mealCount + 1,
                }))
                setFormData({ food_item: '', calories: '', protein_g: '', carbs_g: '', fat_g: '', notes: '' })
                setShowAddModal(false)
            }
        })
    }

    const handleDelete = async (log: NutritionLog) => {
        startTransition(async () => {
            const result = await deleteNutritionLog(log.id)
            if (!result.error) {
                setLogs(prev => ({
                    ...prev,
                    [log.meal_type]: prev[log.meal_type].filter(l => l.id !== log.id)
                }))
                setSummary(prev => ({
                    ...prev,
                    totalCalories: prev.totalCalories - (log.calories || 0),
                    totalProtein: prev.totalProtein - (Number(log.protein_g) || 0),
                    totalCarbs: prev.totalCarbs - (Number(log.carbs_g) || 0),
                    totalFat: prev.totalFat - (Number(log.fat_g) || 0),
                    mealCount: prev.mealCount - 1,
                }))
            }
        })
    }

    const navigateDate = (direction: 'prev' | 'next') => {
        const newDate = new Date(currentDate)
        newDate.setDate(currentDate.getDate() + (direction === 'next' ? 1 : -1))
        window.location.href = `/nutrition?date=${newDate.toISOString().split('T')[0]}`
    }

    const calorieProgress = Math.min((summary.totalCalories / CALORIE_GOAL) * 100, 100)
    const proteinProgress = Math.min((summary.totalProtein / PROTEIN_GOAL) * 100, 100)
    const carbsProgress = Math.min((summary.totalCarbs / CARBS_GOAL) * 100, 100)
    const fatProgress = Math.min((summary.totalFat / FAT_GOAL) * 100, 100)

    const formatDate = (date: Date) => {
        const today = new Date()
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)
        
        if (date.toDateString() === today.toDateString()) return 'Today'
        if (date.toDateString() === yesterday.toDateString()) return 'Yesterday'
        return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
    }

    return (
        <div className="space-y-8 text-white">
            {/* Header with Date Navigation */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight text-white mb-2">Nutrition</h1>
                    <p className="text-zinc-400">Track your daily meals and macros</p>
                </div>
                <div className="flex items-center gap-2 bg-[#18181B] rounded-xl p-1">
                    <button 
                        onClick={() => navigateDate('prev')}
                        className="p-2 hover:bg-[#27272A] rounded-lg transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="px-4 py-2 font-medium">{formatDate(currentDate)}</span>
                    <button 
                        onClick={() => navigateDate('next')}
                        className="p-2 hover:bg-[#27272A] rounded-lg transition-colors"
                        disabled={currentDate.toDateString() === new Date().toDateString()}
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Daily Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[#18181B] rounded-2xl p-5 border border-white/5">
                    <p className="text-zinc-400 text-sm mb-2">Calories</p>
                    <h3 className="text-2xl font-bold text-white mb-3">{summary.totalCalories} <span className="text-base font-normal text-zinc-500">/ {CALORIE_GOAL}</span></h3>
                    <div className="h-2 bg-[#27272A] rounded-full overflow-hidden">
                        <motion.div 
                            className="h-full bg-[#10B981] rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${calorieProgress}%` }}
                        />
                    </div>
                </div>
                <div className="bg-[#18181B] rounded-2xl p-5 border border-white/5">
                    <p className="text-zinc-400 text-sm mb-2">Protein</p>
                    <h3 className="text-2xl font-bold text-white mb-3">{Math.round(summary.totalProtein)}g <span className="text-base font-normal text-zinc-500">/ {PROTEIN_GOAL}g</span></h3>
                    <div className="h-2 bg-[#27272A] rounded-full overflow-hidden">
                        <motion.div 
                            className="h-full bg-blue-500 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${proteinProgress}%` }}
                        />
                    </div>
                </div>
                <div className="bg-[#18181B] rounded-2xl p-5 border border-white/5">
                    <p className="text-zinc-400 text-sm mb-2">Carbs</p>
                    <h3 className="text-2xl font-bold text-white mb-3">{Math.round(summary.totalCarbs)}g <span className="text-base font-normal text-zinc-500">/ {CARBS_GOAL}g</span></h3>
                    <div className="h-2 bg-[#27272A] rounded-full overflow-hidden">
                        <motion.div 
                            className="h-full bg-orange-500 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${carbsProgress}%` }}
                        />
                    </div>
                </div>
                <div className="bg-[#18181B] rounded-2xl p-5 border border-white/5">
                    <p className="text-zinc-400 text-sm mb-2">Fat</p>
                    <h3 className="text-2xl font-bold text-white mb-3">{Math.round(summary.totalFat)}g <span className="text-base font-normal text-zinc-500">/ {FAT_GOAL}g</span></h3>
                    <div className="h-2 bg-[#27272A] rounded-full overflow-hidden">
                        <motion.div 
                            className="h-full bg-purple-500 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${fatProgress}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Meal Sections */}
            <div className="space-y-6">
                {(Object.keys(MEAL_CONFIG) as MealType[]).map((mealType) => (
                    <div key={mealType} className="bg-[#18181B] rounded-2xl p-6 border border-white/5">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg bg-white/5 ${MEAL_CONFIG[mealType].color}`}>
                                    {MEAL_CONFIG[mealType].icon}
                                </div>
                                <h3 className="font-bold text-lg">{MEAL_CONFIG[mealType].label}</h3>
                                <span className="text-zinc-500 text-sm">
                                    {logs[mealType].reduce((acc, log) => acc + (log.calories || 0), 0)} kcal
                                </span>
                            </div>
                            <button
                                onClick={() => handleAddMeal(mealType)}
                                className="p-2 bg-[#10B981]/10 text-[#10B981] rounded-lg hover:bg-[#10B981]/20 transition-colors"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>

                        {logs[mealType].length > 0 ? (
                            <div className="space-y-2">
                                {logs[mealType].map((log) => (
                                    <motion.div
                                        key={log.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex items-center justify-between p-3 bg-[#27272A] rounded-xl group"
                                    >
                                        <div>
                                            <p className="font-medium">{log.food_item}</p>
                                            <p className="text-sm text-zinc-500">
                                                {log.calories && `${log.calories} kcal`}
                                                {log.protein_g && ` • ${log.protein_g}g protein`}
                                                {log.carbs_g && ` • ${log.carbs_g}g carbs`}
                                                {log.fat_g && ` • ${log.fat_g}g fat`}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleDelete(log)}
                                            disabled={isPending}
                                            className="opacity-0 group-hover:opacity-100 p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-zinc-500 text-sm">No items logged yet</p>
                        )}
                    </div>
                ))}
            </div>

            {/* Add Meal Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={() => setShowAddModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-[#18181B] rounded-2xl p-6 w-full max-w-md border border-white/10"
                            onClick={e => e.stopPropagation()}
                        >
                            <h3 className="text-xl font-bold mb-6">Log {MEAL_CONFIG[selectedMeal].label}</h3>
                            
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="text-sm text-zinc-400 mb-1 block">Food Item *</label>
                                    <input
                                        type="text"
                                        value={formData.food_item}
                                        onChange={(e) => setFormData(prev => ({ ...prev, food_item: e.target.value }))}
                                        placeholder="e.g., Grilled Chicken Salad"
                                        className="w-full bg-[#27272A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#10B981]"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm text-zinc-400 mb-1 block">Calories</label>
                                        <input
                                            type="number"
                                            value={formData.calories}
                                            onChange={(e) => setFormData(prev => ({ ...prev, calories: e.target.value }))}
                                            placeholder="0"
                                            className="w-full bg-[#27272A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#10B981]"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-zinc-400 mb-1 block">Protein (g)</label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            value={formData.protein_g}
                                            onChange={(e) => setFormData(prev => ({ ...prev, protein_g: e.target.value }))}
                                            placeholder="0"
                                            className="w-full bg-[#27272A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#10B981]"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-zinc-400 mb-1 block">Carbs (g)</label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            value={formData.carbs_g}
                                            onChange={(e) => setFormData(prev => ({ ...prev, carbs_g: e.target.value }))}
                                            placeholder="0"
                                            className="w-full bg-[#27272A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#10B981]"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-zinc-400 mb-1 block">Fat (g)</label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            value={formData.fat_g}
                                            onChange={(e) => setFormData(prev => ({ ...prev, fat_g: e.target.value }))}
                                            placeholder="0"
                                            className="w-full bg-[#27272A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#10B981]"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm text-zinc-400 mb-1 block">Notes (optional)</label>
                                    <textarea
                                        value={formData.notes}
                                        onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                                        placeholder="Any additional notes..."
                                        rows={2}
                                        className="w-full bg-[#27272A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#10B981] resize-none"
                                    />
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddModal(false)}
                                        className="flex-1 py-3 bg-[#27272A] hover:bg-[#3F3F46] text-white font-medium rounded-xl transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isPending || !formData.food_item}
                                        className="flex-1 py-3 bg-[#10B981] hover:bg-[#059669] text-black font-bold rounded-xl transition-colors disabled:opacity-50"
                                    >
                                        {isPending ? 'Adding...' : 'Add Item'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
