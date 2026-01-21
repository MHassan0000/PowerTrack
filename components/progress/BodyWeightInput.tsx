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
                className="flex items-center gap-2 px-4 py-2 bg-[rgb(var(--primary))] text-[rgb(var(--background))] rounded-lg hover:bg-[rgb(var(--primary-hover))] transition-colors font-medium"
            >
                <Plus className="w-5 h-5" />
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
            className="bg-[rgb(var(--card))] rounded-xl p-5 glow-border space-y-4"
        >
            <h4 className="font-bold">Add Body Weight</h4>

            <div>
                <label htmlFor="weight" className="block text-sm font-medium mb-2">
                    Weight (kg)
                </label>
                <input
                    type="number"
                    id="weight"
                    step="0.1"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full px-4 py-2 bg-[rgb(var(--background-secondary))] border border-[rgb(var(--border))] rounded-lg focus:outline-none focus:border-[rgb(var(--primary))] transition-colors"
                    placeholder="75.5"
                    required
                />
            </div>

            <div>
                <label htmlFor="date" className="block text-sm font-medium mb-2">
                    Date
                </label>
                <input
                    type="date"
                    id="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-2 bg-[rgb(var(--background-secondary))] border border-[rgb(var(--border))] rounded-lg focus:outline-none focus:border-[rgb(var(--primary))] transition-colors"
                    required
                />
            </div>

            <div>
                <label htmlFor="notes" className="block text-sm font-medium mb-2">
                    Notes (optional)
                </label>
                <textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-4 py-2 bg-[rgb(var(--background-secondary))] border border-[rgb(var(--border))] rounded-lg focus:outline-none focus:border-[rgb(var(--primary))] transition-colors resize-none"
                    rows={2}
                    placeholder="Feeling good today..."
                />
            </div>

            <div className="flex gap-3">
                <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 px-4 py-2 border border-[rgb(var(--border))] rounded-lg hover:bg-[rgb(var(--card-hover))] transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={adding}
                    className="flex-1 px-4 py-2 bg-[rgb(var(--primary))] text-[rgb(var(--background))] rounded-lg hover:bg-[rgb(var(--primary-hover))] transition-colors font-medium disabled:opacity-50"
                >
                    {adding ? 'Adding...' : 'Add'}
                </button>
            </div>
        </motion.form>
    )
}
