'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { addBodyStat } from '@/lib/actions/progress'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export function BodyWeightInput() {
    const router = useRouter()
    const [weight, setWeight] = useState('')
    const [date, setDate] = useState(new Date().toISOString().split('T')[0])
    const [notes, setNotes] = useState('')
    const [adding, setAdding] = useState(false)
    const [showForm, setShowForm] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setAdding(true)

        const result = await addBodyStat(parseFloat(weight), date, notes || undefined)

        if (result.error) {
            alert('Failed to add body weight: ' + result.error)
        } else {
            setWeight('')
            setNotes('')
            setShowForm(false)
            router.refresh()
        }

        setAdding(false)
    }

    if (!showForm) {
        return (
            <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#10B981] text-black rounded-lg hover:bg-[#059669] transition-colors font-bold text-sm"
            >
                <Plus className="w-4 h-4" />
                Add Weight
            </button>
        )
    }

    return (
        <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit}
            className="bg-[#27272A] rounded-xl p-5 border border-white/10 space-y-4"
        >
            <h4 className="font-bold text-white">Add Body Weight</h4>

            <div>
                <label htmlFor="weight" className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                    Weight (kg)
                </label>
                <input
                    type="number"
                    id="weight"
                    step="0.1"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full px-4 py-3 bg-[#18181B] border border-white/5 text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-[#10B981] transition-all"
                    placeholder="75.5"
                    required
                />
            </div>

            <div>
                <label htmlFor="date" className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                    Date
                </label>
                <input
                    type="date"
                    id="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-3 bg-[#18181B] border border-white/5 text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-[#10B981] transition-all"
                    required
                />
            </div>

            <div>
                <label htmlFor="notes" className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                    Notes (optional)
                </label>
                <textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-4 py-3 bg-[#18181B] border border-white/5 text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-[#10B981] transition-all resize-none"
                    rows={2}
                    placeholder="Feeling good today..."
                />
            </div>

            <div className="flex gap-3">
                <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 px-4 py-2.5 bg-[#18181B] text-zinc-400 font-bold text-sm rounded-lg hover:bg-[#3F3F46] hover:text-white transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={adding}
                    className="flex-1 px-4 py-2.5 bg-[#10B981] text-black font-bold text-sm rounded-lg hover:bg-[#059669] transition-colors disabled:opacity-50"
                >
                    {adding ? 'Adding...' : 'Save Entry'}
                </button>
            </div>
        </motion.form>
    )
}
