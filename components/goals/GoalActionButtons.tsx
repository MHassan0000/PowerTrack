'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2, Archive, Trash2, Loader2 } from 'lucide-react'
import { completeGoal, archiveGoal, deleteGoal } from '@/lib/actions/goals'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'

interface GoalActionButtonsProps {
    goalId: string
    status: string
}

export function GoalActionButtons({ goalId, status }: GoalActionButtonsProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [showArchiveDialog, setShowArchiveDialog] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)

    const handleComplete = async () => {
        setLoading(true)
        const toastId = toast.loading('Marking goal as complete...')
        
        const result = await completeGoal(goalId)
        
        if (result.error) {
            toast.error(result.error, { id: toastId })
        } else {
            toast.success('Goal completed! 🎉', { id: toastId })
            router.refresh()
        }
        
        setLoading(false)
    }

    const handleArchive = async () => {
        setLoading(true)
        const toastId = toast.loading('Archiving goal...')
        
        const result = await archiveGoal(goalId)
        
        if (result.error) {
            toast.error(result.error, { id: toastId })
        } else {
            toast.success('Goal archived', { id: toastId })
            router.push('/goals')
        }
        
        setLoading(false)
    }

    const handleDelete = async () => {
        setLoading(true)
        const toastId = toast.loading('Deleting goal...')
        
        const result = await deleteGoal(goalId)
        
        if (result.error) {
            toast.error(result.error, { id: toastId })
        } else {
            toast.success('Goal deleted', { id: toastId })
            router.push('/goals')
        }
        
        setLoading(false)
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {status === 'active' && (
                    <button
                        onClick={handleComplete}
                        disabled={loading}
                        className="py-3.5 bg-[#10B981] hover:bg-[#059669] text-black font-bold rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                <CheckCircle2 className="w-5 h-5" />
                                Mark Complete
                            </>
                        )}
                    </button>
                )}
                
                {status !== 'archived' && (
                    <button
                        onClick={() => setShowArchiveDialog(true)}
                        disabled={loading}
                        className="py-3.5 bg-[#27272A] hover:bg-[#3F3F46] text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        <Archive className="w-5 h-5" />
                        Archive
                    </button>
                )}
                
                <button
                    onClick={() => setShowDeleteDialog(true)}
                    disabled={loading}
                    className="py-3.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-medium rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    <Trash2 className="w-5 h-5" />
                    Delete
                </button>
            </div>

            {/* Confirm Dialogs */}
            <ConfirmDialog
                open={showArchiveDialog}
                onClose={() => setShowArchiveDialog(false)}
                onConfirm={handleArchive}
                title="Archive Goal?"
                message="This goal will be moved to your archived goals. You can view it later in the archived section."
                confirmText="Archive"
                variant="warning"
            />

            <ConfirmDialog
                open={showDeleteDialog}
                onClose={() => setShowDeleteDialog(false)}
                onConfirm={handleDelete}
                title="Delete Goal?"
                message="Are you sure you want to delete this goal? This action cannot be undone and all progress will be lost."
                confirmText="Delete"
                variant="danger"
            />
        </>
    )
}
