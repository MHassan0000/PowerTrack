import { getGoalById, completeGoal, archiveGoal, deleteGoal } from '@/lib/actions/goals'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Target, Calendar, Dumbbell, TrendingUp, CheckCircle2, Archive, Trash2, Edit } from 'lucide-react'
import { GoalProgressBar } from '@/components/goals/GoalProgressBar'
import { GoalActionButtons } from '@/components/goals/GoalActionButtons'

interface GoalDetailPageProps {
    params: Promise<{ id: string }>
}

export default async function GoalDetailPage({ params }: GoalDetailPageProps) {
    const { id } = await params
    const { data: goal, error } = await getGoalById(id)

    if (error || !goal) {
        notFound()
    }

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'No deadline'
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        })
    }

    const getGoalTypeIcon = (type: string) => {
        switch (type) {
            case 'strength':
                return <Dumbbell className="w-6 h-6" />
            case 'weight_loss':
            case 'weight_gain':
                return <Target className="w-6 h-6" />
            case 'volume':
                return <TrendingUp className="w-6 h-6" />
            case 'consistency':
                return <Calendar className="w-6 h-6" />
            default:
                return <Target className="w-6 h-6" />
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'text-green-500 bg-green-500/10'
            case 'archived':
                return 'text-zinc-500 bg-zinc-500/10'
            default:
                return 'text-[#10B981] bg-[#10B981]/10'
        }
    }

    const progress = goal.target_value > 0 
        ? (goal.current_value / goal.target_value) * 100 
        : 0

    const remaining = goal.target_value - goal.current_value
    const daysUntilTarget = goal.target_date 
        ? Math.ceil((new Date(goal.target_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        : null

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 pb-20">
            {/* Header / Nav */}
            <div className="flex items-center gap-4 mb-8">
                <Link
                    href="/goals"
                    className="w-10 h-10 rounded-xl bg-[#18181B] hover:bg-[#27272A] border border-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div className="flex-1">
                    <p className="text-xs text-zinc-500 uppercase tracking-wider font-bold">Goal Details</p>
                </div>
                <Link
                    href={`/goals/${id}/edit`}
                    className="w-10 h-10 rounded-xl bg-[#18181B] hover:bg-[#27272A] border border-white/5 flex items-center justify-center text-zinc-400 hover:text-[#10B981] transition-colors"
                >
                    <Edit className="w-4 h-4" />
                </Link>
            </div>

            {/* Main Goal Card */}
            <div className="bg-[#18181B] rounded-3xl p-8 border border-white/5 mb-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#10B981]/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
                
                <div className="relative z-10">
                    {/* Header */}
                    <div className="flex items-start gap-6 mb-8">
                        <div className={`w-20 h-20 rounded-2xl ${getStatusColor(goal.status)} flex items-center justify-center`}>
                            {getGoalTypeIcon(goal.goal_type)}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                                <h1 className="text-3xl font-bold text-white">{goal.title}</h1>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(goal.status)}`}>
                                    {goal.status}
                                </span>
                            </div>
                            {goal.description && (
                                <p className="text-zinc-400 text-lg">{goal.description}</p>
                            )}
                            {goal.exercise && (
                                <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-[#27272A] rounded-lg border border-white/5">
                                    <Dumbbell className="w-4 h-4 text-zinc-500" />
                                    <span className="text-sm text-zinc-300 font-medium">{goal.exercise.name}</span>
                                    <span className="text-xs text-zinc-600">•</span>
                                    <span className="text-xs text-zinc-500">{goal.exercise.primary_muscle}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-8">
                        <GoalProgressBar
                            current={goal.current_value}
                            target={goal.target_value}
                            unit={goal.unit}
                        />
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-[#27272A]/50 p-4 rounded-2xl border border-white/5">
                            <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Current</p>
                            <p className="text-2xl font-bold text-white">
                                {goal.current_value}
                                <span className="text-sm text-zinc-500 font-normal ml-1">{goal.unit}</span>
                            </p>
                        </div>
                        <div className="bg-[#27272A]/50 p-4 rounded-2xl border border-white/5">
                            <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Target</p>
                            <p className="text-2xl font-bold text-white">
                                {goal.target_value}
                                <span className="text-sm text-zinc-500 font-normal ml-1">{goal.unit}</span>
                            </p>
                        </div>
                        <div className="bg-[#27272A]/50 p-4 rounded-2xl border border-white/5">
                            <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Remaining</p>
                            <p className="text-2xl font-bold text-white">
                                {remaining > 0 ? remaining : 0}
                                <span className="text-sm text-zinc-500 font-normal ml-1">{goal.unit}</span>
                            </p>
                        </div>
                        <div className="bg-[#27272A]/50 p-4 rounded-2xl border border-white/5">
                            <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Progress</p>
                            <p className="text-2xl font-bold text-[#10B981]">
                                {Math.min(Math.round(progress), 100)}%
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Timeline */}
            <div className="bg-[#18181B] rounded-2xl p-6 border border-white/5 mb-8">
                <h2 className="text-lg font-bold text-white mb-4">Timeline</h2>
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-[#10B981]/10 flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-[#10B981]" />
                        </div>
                        <div>
                            <p className="text-sm text-zinc-500">Target Date</p>
                            <p className="text-white font-medium">{formatDate(goal.target_date)}</p>
                        </div>
                    </div>
                    {daysUntilTarget !== null && (
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-orange-500" />
                            </div>
                            <div>
                                <p className="text-sm text-zinc-500">Time Remaining</p>
                                <p className="text-white font-medium">
                                    {daysUntilTarget > 0 
                                        ? `${daysUntilTarget} days` 
                                        : daysUntilTarget === 0 
                                        ? 'Today!' 
                                        : `${Math.abs(daysUntilTarget)} days overdue`}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Action Buttons */}
            <GoalActionButtons goalId={id} status={goal.status} />
        </div>
    )
}
