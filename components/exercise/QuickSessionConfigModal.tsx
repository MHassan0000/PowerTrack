'use client'

import { useState } from 'react'
import { X, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface QuickSessionConfigModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: (config: {
        sets: number
        reps: number
        duration: number | ''
        rest: number
        notes?: string
    }) => void
    exerciseName: string
}

export function QuickSessionConfigModal({ isOpen, onClose, onConfirm, exerciseName }: QuickSessionConfigModalProps) {
    // Configuration - Match other forms
    const [sets, setSets] = useState(3)
    const [reps, setReps] = useState(10)
    const [duration, setDuration] = useState<number | ''>('')
    const [rest, setRest] = useState(60)
    const [notes, setNotes] = useState('')

    const handleSubmit = () => {
        if (sets <= 0) {
            toast.error('Sets must be greater than 0')
            return
        }

        if (reps <= 0 && !duration) {
            toast.error('Either reps or duration must be provided')
            return
        }

        onConfirm({ sets, reps, duration, rest, notes: notes || undefined })
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#18181B] border border-white/10 rounded-2xl max-w-md w-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                    <div>
                        <h2 className="text-xl font-bold text-white">Quick Session</h2>
                        <p className="text-sm text-zinc-400 mt-1">{exerciseName}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-lg bg-[#27272A] hover:bg-[#3F3F46] text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Exercise Configuration */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium text-zinc-300">Configure Your Session</h3>
                        
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs text-zinc-500 uppercase tracking-wider mb-1 block">Sets</label>
                                <input
                                    type="number"
                                    value={sets}
                                    onChange={(e) => setSets(parseInt(e.target.value) || 0)}
                                    min="1"
                                    max="10"
                                    className="w-full px-3 py-2 bg-[#27272A] text-white rounded-lg border border-white/10 focus:border-[#10B981] focus:outline-none text-center"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-zinc-500 uppercase tracking-wider mb-1 block">Reps</label>
                                <input
                                    type="number"
                                    value={reps}
                                    onChange={(e) => setReps(parseInt(e.target.value) || 0)}
                                    min="0"
                                    max="50"
                                    placeholder="0 for timed"
                                    className="w-full px-3 py-2 bg-[#27272A] text-white rounded-lg border border-white/10 focus:border-[#10B981] focus:outline-none text-center"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs text-zinc-500 uppercase tracking-wider mb-1 block">Duration (s)</label>
                                <input
                                    type="number"
                                    value={duration}
                                    onChange={(e) => setDuration(e.target.value ? parseInt(e.target.value) : '')}
                                    min="0"
                                    placeholder="For timed"
                                    className="w-full px-3 py-2 bg-[#27272A] text-white rounded-lg border border-white/10 focus:border-[#10B981] focus:outline-none text-center"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-zinc-500 uppercase tracking-wider mb-1 block">Rest (s)</label>
                                <input
                                    type="number"
                                    value={rest}
                                    onChange={(e) => setRest(parseInt(e.target.value) || 0)}
                                    min="0"
                                    step="15"
                                    className="w-full px-3 py-2 bg-[#27272A] text-white rounded-lg border border-white/10 focus:border-[#10B981] focus:outline-none text-center"
                                />
                            </div>
                        </div>

                        <p className="text-xs text-zinc-500 mt-2">
                            💡 Use reps for count-based exercises, duration for timed exercises (e.g., planks)
                        </p>

                        {/* Notes */}
                        <div className="mt-4">
                            <label htmlFor="notes" className="text-xs text-zinc-500 uppercase tracking-wider mb-1 block">
                                Notes (Optional)
                            </label>
                            <textarea
                                id="notes"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                rows={3}
                                placeholder="Any specific instructions..."
                                className="w-full px-3 py-2 bg-[#27272A] text-white rounded-lg border border-white/10 focus:border-[#10B981] focus:outline-none resize-none"
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 py-3 bg-[#27272A] hover:bg-[#3F3F46] text-white font-medium rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="flex-1 py-3 bg-[#10B981] hover:bg-[#059669] text-black font-bold rounded-xl transition-all shadow-lg hover:shadow-[#10B981]/20"
                        >
                            Start Session
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
