'use client'

import { useState, useTransition, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Apple, Coffee, Sun, Moon, Cookie, Trash2, ChevronLeft, ChevronRight, Calendar, Copy, Edit2 } from 'lucide-react'
import { addNutritionLog, deleteNutritionLog, duplicateNutritionLog, copyYesterdaysMeals, updateNutritionLog, MealType, NutritionLog, DailyNutritionSummary } from '@/lib/actions/nutrition'
import { CalendarModal } from './CalendarModal'
import { FoodContextMenu } from './FoodContextMenu'

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

export function NutritionPageContent({ initialLogs, initialSummary, initialDate }: NutritionPageContentProps) {
    const [isPending, startTransition] = useTransition()
    const [isCopying, setIsCopying] = useState(false)
    const [logs, setLogs] = useState(initialLogs)
    const [summary, setSummary] = useState(initialSummary)
    const [showAddModal, setShowAddModal] = useState(false)
    const [showCalendar, setShowCalendar] = useState(false)
    const [selectedMeal, setSelectedMeal] = useState<MealType>('breakfast')
    const [currentDate, setCurrentDate] = useState(new Date(initialDate))
    const [contextMenu, setContextMenu] = useState<{ isOpen: boolean; position: { x: number; y: number }; logId: string | null }>({
        isOpen: false,
        position: { x: 0, y: 0 },
        logId: null,
    })
    const longPressTimerRef = useRef<NodeJS.Timeout | null>(null)
    const [isEditing, setIsEditing] = useState(false)
    const [editingLog, setEditingLog] = useState<NutritionLog | null>(null)

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
            if (isEditing && editingLog) {
                // Update existing meal
                const result = await updateNutritionLog(editingLog.id, {
                    food_item: formData.food_item,
                    calories: formData.calories ? parseInt(formData.calories) : undefined,
                    protein_g: formData.protein_g ? parseFloat(formData.protein_g) : undefined,
                    carbs_g: formData.carbs_g ? parseFloat(formData.carbs_g) : undefined,
                    fat_g: formData.fat_g ? parseFloat(formData.fat_g) : undefined,
                    notes: formData.notes || null,
                })

                if (result.data) {
                    // Update local state
                    setLogs(prev => ({
                        ...prev,
                        [editingLog.meal_type]: prev[editingLog.meal_type].map(log =>
                            log.id === editingLog.id ? result.data! : log
                        )
                    }))
                    // Recalculate summary (subtract old, add new)
                    const oldCalories = editingLog.calories || 0
                    const oldProtein = Number(editingLog.protein_g) || 0
                    const oldCarbs = Number(editingLog.carbs_g) || 0
                    const oldFat = Number(editingLog.fat_g) || 0

                    setSummary(prev => ({
                        ...prev,
                        totalCalories: prev.totalCalories - oldCalories + (result.data!.calories || 0),
                        totalProtein: prev.totalProtein - oldProtein + (Number(result.data!.protein_g) || 0),
                        totalCarbs: prev.totalCarbs - oldCarbs + (Number(result.data!.carbs_g) || 0),
                        totalFat: prev.totalFat - oldFat + (Number(result.data!.fat_g) || 0),
                    }))
                    setFormData({ food_item: '', calories: '', protein_g: '', carbs_g: '', fat_g: '', notes: '' })
                    setShowAddModal(false)
                    setIsEditing(false)
                    setEditingLog(null)
                }
            } else {
                // Add new meal
                const result = await addNutritionLog({
                    meal_type: selectedMeal,
                    food_item: formData.food_item,
                    calories: formData.calories ? parseInt(formData.calories) : undefined,
                    protein_g: formData.protein_g ? parseFloat(formData.protein_g) : undefined,
                    carbs_g: formData.carbs_g ? parseFloat(formData.carbs_g) : undefined,
                    fat_g: formData.fat_g ? parseFloat(formData.fat_g) : undefined,
                    notes: formData.notes || undefined,
                    logged_at: currentDate.toISOString(), // Use the date being viewed, not today
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

    const handleEdit = (log: NutritionLog) => {
        setEditingLog(log)
        setIsEditing(true)
        setSelectedMeal(log.meal_type)
        setFormData({
            food_item: log.food_item,
            calories: log.calories?.toString() || '',
            protein_g: log.protein_g?.toString() || '',
            carbs_g: log.carbs_g?.toString() || '',
            fat_g: log.fat_g?.toString() || '',
            notes: log.notes || '',
        })
        setShowAddModal(true)
    }

    const handleRightClick = (e: React.MouseEvent, logId: string) => {
        e.preventDefault()
        setContextMenu({
            isOpen: true,
            position: { x: e.clientX, y: e.clientY },
            logId,
        })
    }

    const handleLongPressStart = (e: React.TouchEvent | React.MouseEvent, logId: string) => {
        longPressTimerRef.current = setTimeout(() => {
            const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
            const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
            setContextMenu({
                isOpen: true,
                position: { x: clientX, y: clientY },
                logId,
            })
        }, 500)
    }

    const handleLongPressEnd = () => {
        if (longPressTimerRef.current) {
            clearTimeout(longPressTimerRef.current)
            longPressTimerRef.current = null
        }
    }

    const handleDuplicateFood = async (logId: string) => {
        try {
            const result = await duplicateNutritionLog(logId, currentDate.toISOString())
            if (result.data) {
                const newLog = result.data
                setLogs(prev => ({
                    ...prev,
                    [newLog.meal_type]: [...prev[newLog.meal_type], newLog]
                }))
                setSummary(prev => ({
                    ...prev,
                    totalCalories: prev.totalCalories + (newLog.calories || 0),
                    totalProtein: prev.totalProtein + (Number(newLog.protein_g) || 0),
                    totalCarbs: prev.totalCarbs + (Number(newLog.carbs_g) || 0),
                    totalFat: prev.totalFat + (Number(newLog.fat_g) || 0),
                    totalFiber: prev.totalFiber + (Number(newLog.fiber_g) || 0),
                    totalSugar: prev.totalSugar + (Number(newLog.sugar_g) || 0),
                    mealCount: prev.mealCount + 1,
                    calorieGoal: prev.calorieGoal,
                    proteinGoal: prev.proteinGoal,
                    carbsGoal: prev.carbsGoal,
                    fatGoal: prev.fatGoal,
                }))
                setContextMenu({ isOpen: false, position: { x: 0, y: 0 }, logId: null })
            }
        } catch (error) {
            console.error('Failed to duplicate food:', error)
        }
    }

    const handleCopyYesterdaysMeals = async () => {
        setIsCopying(true)
        try {
            const result = await copyYesterdaysMeals(currentDate.toISOString())
            if (result.data && !result.skipped) {
                // Refresh the page to show the copied meals
                window.location.reload()
            }
        } catch (error) {
            console.error('Failed to copy meals:', error)
        } finally {
            setIsCopying(false)
        }
    }

    const navigateDate = (direction: 'prev' | 'next') => {
        const newDate = new Date(currentDate)
        newDate.setDate(currentDate.getDate() + (direction === 'next' ? 1 : -1))
        window.location.href = `/nutrition?date=${newDate.toISOString().split('T')[0]}`
    }

    const handleDateSelect = (date: Date) => {
        // Construct YYYY-MM-DD from local components to avoid UTC timezone shifts
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        const dateString = `${year}-${month}-${day}`
        window.location.href = `/nutrition?date=${dateString}`
    }

    // Helper function to get progress bar color based on percentage
    const getProgressColor = (current: number, goal: number) => {
        const progress = (current / goal) * 100
        if (progress > 100) return 'bg-red-500'      // Exceeded
        if (progress >= 80) return 'bg-[#10B981]'    // On target (green)
        if (progress >= 60) return 'bg-yellow-500'   // Close (yellow)
        return 'bg-zinc-600'                          // Below target (gray)
    }

    const proteinProgress = summary.proteinGoal 
        ? Math.min((summary.totalProtein / summary.proteinGoal) * 100, 100) 
        : 0

    // Check if protein goal is met/exceeded for emphasis
    const isProteinGoalMet = summary.proteinGoal && summary.totalProtein >= summary.proteinGoal

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
            <div className="flex items-center justify-between gap-2">
                <div>
                    <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-white mb-1 md:mb-2">Nutrition</h1>
                    <p className="text-zinc-400 text-xs md:text-base">Track your daily meals</p>
                </div>
                
                <div className="flex flex-col-reverse md:flex-row items-end md:items-center gap-2 md:gap-3">
                    {/* Copy Yesterday's Meals Button */}
                    {summary.mealCount === 0 && (
                        <motion.button
                            onClick={handleCopyYesterdaysMeals}
                            disabled={isCopying}
                            className="flex items-center gap-2 p-2 md:px-4 md:py-2 bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20 rounded-xl hover:bg-[#10B981]/20 transition-all font-medium text-sm disabled:opacity-50 justify-center"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            title="Copy Previous Meals"
                        >
                            <Copy className="w-4 h-4" />
                            <span className="whitespace-nowrap font-medium text-xs md:text-sm">
                                {isCopying ? 'Copying...' : (
                                    <>
                                        <span className="md:hidden">Previous Meals</span>
                                        <span className="hidden md:inline">Copy Previous Meals</span>
                                    </>
                                )}
                            </span>
                        </motion.button>
                    )}
                    
                    {/* Date Navigation */}
                    <div className="flex items-center gap-1 md:gap-2 bg-[#18181B] rounded-xl p-1 shrink-0">
                        <button 
                            onClick={() => navigateDate('prev')}
                            className="p-1.5 md:p-2 hover:bg-[#27272A] rounded-lg transition-colors"
                            aria-label="Previous day"
                        >
                            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                        <button
                            onClick={() => setShowCalendar(true)}
                            className="px-2 md:px-4 py-1.5 md:py-2 font-medium hover:bg-[#27272A] rounded-lg transition-colors flex items-center gap-2 group text-sm md:text-base"
                            aria-label="Open calendar"
                        >
                            <span>{formatDate(currentDate)}</span>
                            <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4 text-zinc-500 group-hover:text-[#10B981] transition-colors" />
                        </button>
                        <button 
                            onClick={() => navigateDate('next')}
                            className="p-1.5 md:p-2 hover:bg-[#27272A] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={currentDate.toDateString() === new Date().toDateString()}
                            aria-label="Next day"
                        >
                            <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Daily Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Calories Card */}
                <div className="bg-[#18181B] rounded-2xl p-5 border border-white/5">
                    <p className="text-zinc-400 text-sm mb-2">Calories</p>
                    {summary.calorieGoal ? (
                        <>
                            <h3 className="text-2xl font-bold text-white mb-3">
                                {summary.totalCalories} <span className="text-base font-normal text-zinc-500">/ {summary.calorieGoal}</span>
                            </h3>
                            <div className="h-2 bg-[#27272A] rounded-full overflow-hidden">
                                <motion.div 
                                    className={`h-full ${getProgressColor(summary.totalCalories, summary.calorieGoal)} rounded-full`}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min((summary.totalCalories / summary.calorieGoal) * 100, 100)}%` }}
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            <h3 className="text-2xl font-bold text-white">{summary.totalCalories}</h3>
                            <a href="/settings" className="text-xs text-zinc-500 hover:text-[#10B981] transition-colors">
                                Set goal in settings →
                            </a>
                        </>
                    )}
                </div>
                {/* Protein Card */}
                <div className="bg-[#18181B] rounded-2xl p-5 border border-white/5">
                    <p className="text-zinc-400 text-sm mb-2">Protein</p>
                    {summary.proteinGoal ? (
                        <>
                            <h3 className="text-2xl font-bold text-white mb-3">
                                {Math.round(summary.totalProtein)}g <span className="text-base font-normal text-zinc-500">/ {summary.proteinGoal}g</span>
                            </h3>
                            <div className="h-2 bg-[#27272A] rounded-full overflow-hidden">
                                <motion.div 
                                    className={`h-full ${getProgressColor(summary.totalProtein, summary.proteinGoal)} rounded-full`}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min((summary.totalProtein / summary.proteinGoal) * 100, 100)}%` }}
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            <h3 className="text-2xl font-bold text-white">{Math.round(summary.totalProtein)}g</h3>
                            <a href="/settings" className="text-xs text-zinc-500 hover:text-[#10B981] transition-colors">
                                Set goal in settings →
                            </a>
                        </>
                    )}
                </div>
                {/* Carbs Card */}
                <div className="bg-[#18181B] rounded-2xl p-5 border border-white/5">
                    <p className="text-zinc-400 text-sm mb-2">Carbs</p>
                    {summary.carbsGoal ? (
                        <>
                            <h3 className="text-2xl font-bold text-white mb-3">
                                {Math.round(summary.totalCarbs)}g <span className="text-base font-normal text-zinc-500">/ {summary.carbsGoal}g</span>
                            </h3>
                            <div className="h-2 bg-[#27272A] rounded-full overflow-hidden">
                                <motion.div 
                                    className={`h-full ${getProgressColor(summary.totalCarbs, summary.carbsGoal)} rounded-full`}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min((summary.totalCarbs / summary.carbsGoal) * 100, 100)}%` }}
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            <h3 className="text-2xl font-bold text-white">{Math.round(summary.totalCarbs)}g</h3>
                            <a href="/settings" className="text-xs text-zinc-500 hover:text-[#10B981] transition-colors">
                                Set goal in settings →
                            </a>
                        </>
                    )}
                </div>
                {/* Fat Card */}
                <div className="bg-[#18181B] rounded-2xl p-5 border border-white/5">
                    <p className="text-zinc-400 text-sm mb-2">Fat</p>
                    {summary.fatGoal ? (
                        <>
                            <h3 className="text-2xl font-bold text-white mb-3">
                                {Math.round(summary.totalFat)}g <span className="text-base font-normal text-zinc-500">/ {summary.fatGoal}g</span>
                            </h3>
                            <div className="h-2 bg-[#27272A] rounded-full overflow-hidden">
                                <motion.div 
                                    className={`h-full ${getProgressColor(summary.totalFat, summary.fatGoal)} rounded-full`}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min((summary.totalFat / summary.fatGoal) * 100, 100)}%` }}
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            <h3 className="text-2xl font-bold text-white">{Math.round(summary.totalFat)}g</h3>
                            <a href="/settings" className="text-xs text-zinc-500 hover:text-[#10B981] transition-colors">
                                Set goal in settings →
                            </a>
                        </>
                    )}
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
                                        className="flex items-center justify-between p-3 bg-[#27272A] rounded-xl group cursor-context-menu select-none"
                                        onContextMenu={(e) => handleRightClick(e, log.id)}
                                        onTouchStart={(e) => handleLongPressStart(e, log.id)}
                                        onTouchEnd={handleLongPressEnd}
                                        onMouseDown={(e) => e.button === 0 && handleLongPressStart(e, log.id)}
                                        onMouseUp={handleLongPressEnd}
                                        onMouseLeave={handleLongPressEnd}
                                    >
                                        <div>
                                            <p className="font-medium">{log.food_item}</p>
                                            <p className="text-sm text-zinc-500">
                                                {log.calories && `${log.calories} kcal`}
                                                {log.protein_g && ` • ${log.protein_g}g protein`}
                                                {log.carbs_g && ` • ${log.carbs_g}g carbs`}
                                                {log.fat_g && ` • ${log.fat_g}g fat`}
                                            </p>
                                            {log.notes && (
                                                <p className="text-xs text-zinc-500 italic mt-0.5">
                                                    Note: {log.notes}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(log)}
                                                disabled={isPending}
                                                className="p-2 text-zinc-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors disabled:opacity-50"
                                                aria-label="Edit meal"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(log)}
                                                disabled={isPending}
                                                className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                                                aria-label="Delete meal"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
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
                            <h3 className="text-xl font-bold mb-6">
                                {isEditing ? 'Edit Meal' : `Log ${MEAL_CONFIG[selectedMeal].label}`}
                            </h3>
                            
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
                                        placeholder="Any additional notes... (max 60 chars)"
                                        rows={2}
                                        maxLength={60}
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

            {/* Food Context Menu */}
            <FoodContextMenu
                isOpen={contextMenu.isOpen}
                position={contextMenu.position}
                onClose={() => setContextMenu({ isOpen: false, position: { x: 0, y: 0 }, logId: null })}
                onLogAgain={() => {
                    if (contextMenu.logId) {
                        handleDuplicateFood(contextMenu.logId)
                    }
                }}
            />

            {/* Calendar Modal */}
            <CalendarModal
                isOpen={showCalendar}
                onClose={() => setShowCalendar(false)}
                currentDate={currentDate}
                onDateSelect={handleDateSelect}
            />
        </div>
    )
}
