
import { getExerciseById } from '@/lib/actions/exercises'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Target, Dumbbell, Activity, AlertCircle, Play } from 'lucide-react'

interface ExerciseDetailPageProps {
    params: Promise<{
        id: string
    }>
}

export default async function ExerciseDetailPage({ params }: ExerciseDetailPageProps) {
    const { id } = await params
    const { data: exercise, error } = await getExerciseById(id)

    if (error || !exercise) {
        notFound()
    }

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'beginner':
                return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'
            case 'intermediate':
                return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
            case 'advanced':
                return 'text-orange-400 bg-orange-400/10 border-orange-400/20'
            default:
                return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'
        }
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-20">
            {/* Header / Nav */}
            <div className="flex items-center gap-4">
                <Link
                    href="/exercises"
                    className="w-10 h-10 rounded-xl bg-[#18181B] hover:bg-[#27272A] border border-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">{exercise.name}</h1>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Media & Quick Stats */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Hero Image */}
                    <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-[#18181B] border border-white/5 group">
                        {exercise.media_url ? (
                            <>
                                <Image
                                    src={exercise.media_url}
                                    alt={exercise.name}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-transparent opacity-60" />
                            </>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <Dumbbell className="w-20 h-20 text-zinc-700" />
                            </div>
                        )}
                        
                        {/* Overlay Tags */}
                        <div className="absolute bottom-4 left-4 flex gap-2">
                             <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border backdrop-blur-md ${getDifficultyColor(exercise.difficulty)}`}>
                                {exercise.difficulty}
                            </span>
                        </div>
                    </div>

                    {/* Instructions */}
                    <div className="bg-[#18181B] rounded-2xl border border-white/5 overflow-hidden">
                        <div className="p-6 border-b border-white/5">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <Activity className="w-5 h-5 text-[#10B981]" />
                                Instructions
                            </h2>
                        </div>
                        <div className="p-6 space-y-6">
                            {exercise.instructions ? (
                                <div className="space-y-4">
                                    {exercise.instructions.split('\n').map((step: string, index: number) => (
                                        <div key={index} className="flex gap-4 group">
                                            <div className="shrink-0 w-8 h-8 rounded-full bg-[#27272A] text-zinc-400 group-hover:bg-[#10B981] group-hover:text-black font-bold flex items-center justify-center text-sm transition-colors border border-white/5 group-hover:border-[#10B981]">
                                                {index + 1}
                                            </div>
                                            <p className="text-zinc-300 pt-1 leading-relaxed">{step}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-zinc-500 italic">No instructions available.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Details & Actions */}
                <div className="space-y-6">
                    {/* Action Card */}
                    <div className="bg-[#18181B] rounded-2xl p-6 border border-white/5 space-y-4 sticky top-6">
                        <div className="space-y-2 mb-6">
                            <p className="text-zinc-400 text-sm">Target Muscle</p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#10B981]/10 flex items-center justify-center text-[#10B981]">
                                    <Target className="w-5 h-5" />
                                </div>
                                <span className="text-xl font-bold text-white">{exercise.primary_muscle}</span>
                            </div>
                        </div>

                         {/* Secondary Stats */}
                         <div className="grid grid-cols-2 gap-4 py-4 border-t border-white/5">
                            <div>
                                <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Equipment</p>
                                <p className="text-white font-medium">{exercise.equipment}</p>
                            </div>
                            <div>
                                <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Secondary</p>
                                <p className="text-zinc-400 text-sm truncate">
                                    {exercise.secondary_muscles?.join(', ') || 'None'}
                                </p>
                            </div>
                        </div>

                        {exercise.description && (
                            <div className="py-4 border-t border-white/5">
                                <p className="text-zinc-400 text-sm leading-relaxed">
                                    {exercise.description}
                                </p>
                            </div>
                        )}

                        <div className="pt-2 space-y-3">
                            <button className="w-full py-3.5 bg-[#10B981] hover:bg-[#059669] text-black font-bold rounded-xl transition-all shadow-lg hover:shadow-[#10B981]/20 flex items-center justify-center gap-2">
                                <Play className="w-4 h-4 fill-current" />
                                Start Stats
                            </button>
                            <button className="w-full py-3.5 bg-[#27272A] hover:bg-[#3F3F46] text-white font-medium rounded-xl transition-colors border border-white/5 hover:border-white/10">
                                Add to Workout
                            </button>
                        </div>
                    </div>

                    {/* Tips Card */}
                    {exercise.tips && (
                         <div className="bg-[#18181B] rounded-2xl p-6 border border-white/5">
                            <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-orange-400" />
                                Pro Tips
                            </h3>
                            <p className="text-zinc-400 text-sm leading-relaxed">
                                {exercise.tips}
                            </p>
                         </div>
                    )}
                </div>
            </div>
        </div>
    )
}
