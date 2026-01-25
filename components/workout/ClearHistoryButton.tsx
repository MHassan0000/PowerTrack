'use client'

import { useState } from 'react'
import { Trash2, Loader2 } from 'lucide-react'
import { clearAllWorkoutHistory } from '@/lib/actions/workout-sessions'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export function ClearHistoryButton() {
    const [isDeleting, setIsDeleting] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const router = useRouter()

    const handleClearHistory = async () => {
        setIsDeleting(true)
        const { error } = await clearAllWorkoutHistory()
        
        if (error) {
            toast.error('Failed to clear history')
            setIsDeleting(false)
            setShowConfirm(false)
            return
        }

        toast.success('Workout history cleared')
        setIsDeleting(false)
        setShowConfirm(false)
        router.refresh()
    }

    if (showConfirm) {
        return (
            <div className="flex items-center gap-2">
                <button
                    onClick={() => setShowConfirm(false)}
                    className="px-4 py-2 bg-[#27272A] hover:bg-[#3F3F46] text-white font-medium rounded-xl transition-colors"
                    disabled={isDeleting}
                >
                    Cancel
                </button>
                <button
                    onClick={handleClearHistory}
                    disabled={isDeleting}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-colors flex items-center gap-2"
                >
                    {isDeleting ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Clearing...
                        </>
                    ) : (
                        <>
                            <Trash2 className="w-4 h-4" />
                            Confirm Delete All
                        </>
                    )}
                </button>
            </div>
        )
    }

    return (
        <button
            onClick={() => setShowConfirm(true)}
            className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-medium rounded-xl transition-colors flex items-center gap-2"
        >
            <Trash2 className="w-4 h-4" />
            Clear History
        </button>
    )
}
