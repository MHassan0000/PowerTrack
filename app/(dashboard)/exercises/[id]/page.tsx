import { getExerciseById } from '@/lib/actions/exercises'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

interface ExerciseDetailPageProps {
    params: {
        id: string
    }
}

export default async function ExerciseDetailPage({ params }: ExerciseDetailPageProps) {
    const { data: exercise, error } = await getExerciseById(params.id)

    if (error || !exercise) {
        notFound()
    }

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'beginner':
                return 'text-green-400 bg-green-500/10 border-green-500/30'
            case 'intermediate':
                return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30'
            case 'advanced':
                return 'text-red-400 bg-red-500/10 border-red-500/30'
            default:
                return 'text-[rgb(var(--primary))] bg-[rgb(var(--primary))]/10 border-[rgb(var(--primary))]/30'
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Back Button */}
            <Link
                href="/exercises"
                className="inline-flex items-center gap-2 text-[rgb(var(--primary))] hover:underline"
            >
                ← Back to Exercises
            </Link>

            {/* Exercise Header */}
            <div className="glow-border bg-[rgb(var(--card))] backdrop-blur-xl rounded-2xl overflow-hidden">
                {/* Media */}
                {exercise.media_url && (
                    <div className="relative h-96 bg-[rgb(var(--background-secondary))]">
                        <Image
                            src={exercise.media_url}
                            alt={exercise.name}
                            fill
                            className="object-cover"
                        />
                    </div>
                )}

                <div className="p-8">
                    {/* Title & Difficulty */}
                    <div className="flex items-start justify-between mb-4">
                        <h1 className="text-4xl font-bold glow-text">{exercise.name}</h1>
                        <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getDifficultyColor(exercise.difficulty)}`}>
                            {exercise.difficulty.charAt(0).toUpperCase() + exercise.difficulty.slice(1)}
                        </span>
                    </div>

                    {/* Description */}
                    {exercise.description && (
                        <p className="text-lg text-[rgb(var(--foreground-secondary))] mb-6">
                            {exercise.description}
                        </p>
                    )}

                    {/* Tags */}
                    <div className="flex flex-wrap gap-3 mb-6">
                        <div className="px-4 py-2 bg-[rgb(var(--primary))]/10 border border-[rgb(var(--primary))]/30 rounded-lg">
                            <span className="text-sm text-[rgb(var(--foreground-muted))]">Primary Muscle</span>
                            <p className="font-medium">🎯 {exercise.primary_muscle}</p>
                        </div>

                        <div className="px-4 py-2 bg-[rgb(var(--primary))]/10 border border-[rgb(var(--primary))]/30 rounded-lg">
                            <span className="text-sm text-[rgb(var(--foreground-muted))]">Equipment</span>
                            <p className="font-medium">🏋️ {exercise.equipment}</p>
                        </div>

                        {exercise.secondary_muscles && exercise.secondary_muscles.length > 0 && (
                            <div className="px-4 py-2 bg-[rgb(var(--primary))]/10 border border-[rgb(var(--primary))]/30 rounded-lg">
                                <span className="text-sm text-[rgb(var(--foreground-muted))]">Secondary Muscles</span>
                                <p className="font-medium">💪 {exercise.secondary_muscles.join(', ')}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Instructions */}
            {exercise.instructions && (
                <div className="glow-border bg-[rgb(var(--card))] backdrop-blur-xl rounded-xl p-8">
                    <h2 className="text-2xl font-bold mb-4">How To Perform</h2>
                    <div className="space-y-2">
                        {exercise.instructions.split('\n').map((step, index) => (
                            <div key={index} className="flex gap-3">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[rgb(var(--primary))]/20 border border-[rgb(var(--primary))]/50 flex items-center justify-center text-sm">
                                    {index + 1}
                                </span>
                                <p className="text-[rgb(var(--foreground-secondary))]">{step}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Tips */}
            {exercise.tips && (
                <div className="glow-border bg-[rgb(var(--card))] backdrop-blur-xl rounded-xl p-8">
                    <h2 className="text-2xl font-bold mb-4">Tips & Safety</h2>
                    <p className="text-[rgb(var(--foreground-secondary))]">{exercise.tips}</p>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
                <button className="flex-1 py-3 bg-[rgb(var(--primary))] text-[rgb(var(--background))] font-medium rounded-lg hover:bg-[rgb(var(--primary-hover))] transition-all shadow-lg shadow-[rgb(var(--primary))]/20">
                    Add to Workout
                </button>
                <button className="px-6 py-3 bg-[rgb(var(--card-hover))] text-[rgb(var(--foreground-secondary))] font-medium rounded-lg hover:bg-[rgb(var(--border))] transition-all">
                    Track Sets
                </button>
            </div>
        </div>
    )
}
