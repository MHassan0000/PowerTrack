import { getWorkoutById } from '@/lib/actions/workouts'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { StartWorkoutButton } from '@/components/workout/StartWorkoutButton'
import { ArrowLeft, Clock, Dumbbell, Calendar, LayoutList, Edit } from 'lucide-react'

export const dynamic = 'force-dynamic'

interface WorkoutDetailPageProps {
    params: Promise<{
        id: string
    }>
}

export default async function WorkoutDetailPage({ params }: WorkoutDetailPageProps) {
    const { id } = await params
    const { data: workout, error } = await getWorkoutById(id)

    if (error || !workout) {
        notFound()
    }

    const totalSets = workout.exercises.reduce((sum, ex) => sum + ex.sets, 0)
    const estimatedDuration = workout.exercises.reduce((sum, ex) => {
       
        const setTime = ex.duration_seconds || 0
        const restTime = ex.rest_seconds || 0
        
        const totalSetTime = setTime * ex.sets
        const totalRest = restTime * (ex.sets - 1) // Rest is strictly between sets
        return sum + totalSetTime + totalRest
    }, 0)

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-32">
             {/* Header / Nav */}
             <div className="flex items-center gap-4">
                <Link
                    href="/workouts"
                    className="w-10 h-10 rounded-xl bg-[#18181B] hover:bg-[#27272A] border border-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div className="flex-1">
                    <h1 className="font-bold text-zinc-400 uppercase tracking-wider text-xs">Workout Details</h1>
                </div>
                <Link
                    href={`/workouts/${workout.id}/edit`}
                     className="w-10 h-10 rounded-xl bg-[#18181B] hover:bg-[#27272A] border border-white/5 flex items-center justify-center text-zinc-400 hover:text-[#10B981] transition-colors"
                >
                    <Edit className="w-4 h-4" />
                </Link>
            </div>

            {/* Main Header Card */}
            <div className="bg-[#18181B] rounded-3xl p-8 border border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#10B981]/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
                
                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">{workout.name}</h1>
                            {workout.description && (
                                <p className="text-zinc-400 text-lg max-w-2xl leading-relaxed">
                                    {workout.description}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Quick Stats Row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                         <div className="bg-[#27272A]/50 p-4 rounded-2xl border border-white/5">
                            <div className="flex items-center gap-2 text-zinc-400 mb-1">
                                <LayoutList className="w-4 h-4" />
                                <span className="text-xs font-bold uppercase tracking-wider">Exercises</span>
                            </div>
                            <span className="text-2xl font-bold text-white">{workout.exercises.length}</span>
                        </div>
                        <div className="bg-[#27272A]/50 p-4 rounded-2xl border border-white/5">
                            <div className="flex items-center gap-2 text-zinc-400 mb-1">
                                <Dumbbell className="w-4 h-4" />
                                <span className="text-xs font-bold uppercase tracking-wider">Sets</span>
                            </div>
                            <span className="text-2xl font-bold text-white">{totalSets}</span>
                        </div>
                        <div className="bg-[#27272A]/50 p-4 rounded-2xl border border-white/5">
                            <div className="flex items-center gap-2 text-zinc-400 mb-1">
                                <Clock className="w-4 h-4" />
                                <span className="text-xs font-bold uppercase tracking-wider">Est. Duration</span>
                            </div>
                            <span className="text-2xl font-bold text-white">{Math.round(estimatedDuration / 60)}m</span>
                        </div>
                        <div className="bg-[#27272A]/50 p-4 rounded-2xl border border-white/5">
                            <div className="flex items-center gap-2 text-zinc-400 mb-1">
                                <Calendar className="w-4 h-4" />
                                <span className="text-xs font-bold uppercase tracking-wider">Last Run</span>
                            </div>
                            <span className="text-lg font-bold text-zinc-500">Never</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Exercises List */}
            <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <Dumbbell className="w-5 h-5 text-[#10B981]" />
                        Workout Plan
                    </h2>
                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">{workout.exercises.length} MOVEMENTS</span>
                </div>

                {workout.exercises.length > 0 ? (
                    <div className="space-y-4">
                        {workout.exercises.map((ex, index) => (
                            <div
                                key={ex.id}
                                className="group bg-[#18181B] hover:bg-[#27272A] border border-white/5 hover:border-[#10B981]/30 rounded-2xl p-4 transition-all duration-300 flex flex-col md:flex-row gap-6"
                            >
                                {/* Left: Index & Image */}
                                <div className="flex items-center gap-4">
                                    <div className="flex flex-col items-center gap-1 min-w-8">
                                        <span className="text-xs font-bold text-zinc-600 uppercase">Ex</span>
                                        <span className="text-xl font-bold text-[#10B981]">{String(index + 1).padStart(2, '0')}</span>
                                    </div>
                                    
                                    <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-black/20 shrink-0 border border-white/5">
                                        {ex.exercise_library.media_url ? (
                                            <Image
                                                src={ex.exercise_library.media_url}
                                                alt={ex.exercise_library.name}
                                                fill
                                                className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Dumbbell className="w-8 h-8 text-zinc-700" />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Center: Info */}
                                <div className="flex-1 py-1">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-[#10B981] transition-colors">{ex.exercise_library.name}</h3>
                                            <p className="text-sm text-zinc-400 line-clamp-1">{ex.exercise_library.primary_muscle} • {ex.exercise_library.equipment}</p>
                                            {ex.notes && (
                                                <p className="text-xs text-zinc-500 mt-2 italic flex items-start gap-1">
                                                    <span className="shrink-0">📝</span>
                                                    <span>{ex.notes}</span>
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Set Details */}
                                    <div className="flex flex-wrap gap-3 mt-3">
                                        <div className="px-3 py-1.5 rounded-lg bg-[#10B981]/10 border border-[#10B981]/20">
                                            <span className="text-xs font-bold text-[#10B981] uppercase tracking-wider mr-2">Sets</span>
                                            <span className="text-sm font-bold text-white">{ex.sets}</span>
                                        </div>
                                        {ex.reps && (
                                            <div className="px-3 py-1.5 rounded-lg bg-zinc-800/50 border border-white/5">
                                                <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider mr-2">Reps</span>
                                                <span className="text-sm font-bold text-zinc-300">{ex.reps}</span>
                                            </div>
                                        )}
                                        {ex.weight_kg && (
                                            <div className="px-3 py-1.5 rounded-lg bg-zinc-800/50 border border-white/5">
                                                <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider mr-2">Weight</span>
                                                <span className="text-sm font-bold text-zinc-300">{ex.weight_kg}kg</span>
                                            </div>
                                        )}
                                        {ex.duration_seconds && (
                                            <div className="px-3 py-1.5 rounded-lg bg-zinc-800/50 border border-white/5">
                                                <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider mr-2">Duration</span>
                                                <span className="text-sm font-bold text-zinc-300">{ex.duration_seconds}s</span>
                                            </div>
                                        )}
                                        {ex.rest_seconds !== undefined && (
                                            <div className="px-3 py-1.5 rounded-lg bg-zinc-800/50 border border-white/5">
                                                <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider mr-2">Rest</span>
                                                <span className="text-sm font-bold text-zinc-300">{ex.rest_seconds}s</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                     <div className="text-center py-20 bg-[#18181B] rounded-3xl border border-white/5 border-dashed">
                        <div className="w-16 h-16 rounded-full bg-zinc-800/50 flex items-center justify-center mx-auto mb-4">
                            <Dumbbell className="w-8 h-8 text-zinc-600" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">No exercises yet</h3>
                        <p className="text-zinc-500 max-w-sm mx-auto mb-6">This workout is empty. Add some exercises to get started.</p>
                        <Link
                            href={`/workouts/${workout.id}/edit`}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-[#27272A] hover:bg-[#3F3F46] text-white font-bold rounded-xl transition-colors"
                        >
                            Add Exercises
                        </Link>
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="pb-8">
                {workout.is_template ? (
                    <StartWorkoutButton workoutId={workout.id} workoutName={workout.name} />
                ) : (
                    <div className="bg-[#18181B] border border-white/5 rounded-xl p-6 text-center">
                        <p className="text-zinc-400 mb-2">
                            This is a workout plan. To start tracking workouts, create it as a template.
                        </p>
                        <p className="text-sm text-zinc-500">
                            Templates can be used multiple times to track your progress.
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

