'use client'

import { Trash2, Loader2 } from 'lucide-react'
import { deleteWorkoutSession } from '@/lib/actions/workout-sessions'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

interface DeleteSessionButtonProps {
    sessionId: string
}

export function DeleteSessionButton({ sessionId }: DeleteSessionButtonProps) {
    const router = useRouter()
    const [isDeleting, setIsDeleting] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)

    const handleDelete = async () => {
        setIsDeleting(true)
        const { error } = await deleteWorkoutSession(sessionId)
        
        if (error) {
            toast.error('Failed to delete session')
            setIsDeleting(false)
            setShowConfirm(false)
            return
        }

        toast.success('Session deleted')
        router.push('/workouts/history')
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
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-colors flex items-center gap-2"
                >
                    {isDeleting ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Deleting...
                        </>
                    ) : (
                        <>
                            <Trash2 className="w-4 h-4" />
                            Confirm Delete
                        </>
                    )}
                </button>
            </div>
        )
    }

    return (
        <button
            onClick={() => setShowConfirm(true)}
            className="p-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors"
        >
            <Trash2 className="w-5 h-5" />
        </button>
    )
}
