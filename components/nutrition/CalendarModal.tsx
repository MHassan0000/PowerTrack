'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

interface CalendarModalProps {
    isOpen: boolean
    onClose: () => void
    currentDate: Date
    onDateSelect: (date: Date) => void
}

export function CalendarModal({ isOpen, onClose, currentDate, onDateSelect }: CalendarModalProps) {
    const [viewDate, setViewDate] = useState(new Date(currentDate))
    const [selectedDate, setSelectedDate] = useState(new Date(currentDate))

    useEffect(() => {
        setViewDate(new Date(currentDate))
        setSelectedDate(new Date(currentDate))
    }, [currentDate, isOpen])

    const getDaysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
    }

    const getFirstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
    }

    const generateCalendarDays = () => {
        const daysInMonth = getDaysInMonth(viewDate)
        const firstDay = getFirstDayOfMonth(viewDate)
        const days: (number | null)[] = []

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < firstDay; i++) {
            days.push(null)
        }

        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(day)
        }

        return days
    }

    const handlePreviousMonth = () => {
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1))
    }

    const handleNextMonth = () => {
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1))
    }

    const handleDateClick = (day: number) => {
        const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day)
        setSelectedDate(newDate)
        onDateSelect(newDate)
        onClose()
    }

    const isToday = (day: number) => {
        const today = new Date()
        return (
            day === today.getDate() &&
            viewDate.getMonth() === today.getMonth() &&
            viewDate.getFullYear() === today.getFullYear()
        )
    }

    const isSelected = (day: number) => {
        return (
            day === selectedDate.getDate() &&
            viewDate.getMonth() === selectedDate.getMonth() &&
            viewDate.getFullYear() === selectedDate.getFullYear()
        )
    }

    const isFutureDate = (day: number) => {
        const checkDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        return checkDate > today
    }

    const formatMonthYear = () => {
        return viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    }

    // Handle keyboard navigation
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (!isOpen) return

        if (e.key === 'Escape') {
            onClose()
        }
    }, [isOpen, onClose])

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [handleKeyDown])

    const calendarDays = generateCalendarDays()
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    onClick={onClose}
                    data-lenis-prevent
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="bg-[#18181B] rounded-2xl p-6 w-full max-w-md border border-white/10"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-white">Select Date</h3>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                                aria-label="Close calendar"
                            >
                                <X className="w-5 h-5 text-zinc-400" />
                            </button>
                        </div>

                        {/* Month Navigation */}
                        <div className="flex items-center justify-between mb-6">
                            <button
                                onClick={handlePreviousMonth}
                                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                                aria-label="Previous month"
                            >
                                <ChevronLeft className="w-5 h-5 text-white" />
                            </button>
                            <span className="text-lg font-semibold text-white">
                                {formatMonthYear()}
                            </span>
                            <button
                                onClick={handleNextMonth}
                                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                                aria-label="Next month"
                            >
                                <ChevronRight className="w-5 h-5 text-white" />
                            </button>
                        </div>

                        {/* Week Days */}
                        <div className="grid grid-cols-7 gap-2 mb-2">
                            {weekDays.map(day => (
                                <div
                                    key={day}
                                    className="text-center text-sm font-medium text-zinc-500 py-2"
                                >
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Calendar Grid */}
                        <div className="grid grid-cols-7 gap-2">
                            {calendarDays.map((day, index) => {
                                if (day === null) {
                                    return <div key={`empty-${index}`} />
                                }
                                
                                const today = isToday(day)
                                const selected = isSelected(day)
                                const future = isFutureDate(day)

                                return (
                                    <motion.button
                                        key={day}
                                        onClick={() => !future && handleDateClick(day)}
                                        disabled={future}
                                        whileHover={!future ? { scale: 1.05 } : {}}
                                        whileTap={!future ? { scale: 0.95 } : {}}
                                        className={`
                                            aspect-square rounded-lg text-sm font-medium transition-all
                                            ${future 
                                                ? 'text-zinc-600 cursor-not-allowed' 
                                                : 'hover:bg-white/5 cursor-pointer'
                                            }
                                            ${selected 
                                                ? 'bg-[#10B981] text-black font-bold' 
                                                : today 
                                                    ? 'bg-white/10 text-white ring-2 ring-[#10B981]/50' 
                                                    : 'text-white'
                                            }
                                        `}
                                        aria-label={`Select ${day}`}
                                    >
                                        {day}
                                    </motion.button>
                                )
                            })}
                        </div>

                        {/* Footer */}
                        <div className="mt-6 pt-4 border-t border-white/5">
                            <p className="text-sm text-zinc-500 text-center">
                                Press <kbd className="px-2 py-1 bg-white/5 rounded text-zinc-400">Esc</kbd> to close
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
