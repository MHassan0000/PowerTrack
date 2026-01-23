interface SortableExerciseItemProps {
    exercise: any
    index: number
    onRemove: () => void
}

function SortableExerciseItem({ exercise, index, onRemove }: SortableExerciseItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: exercise.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="group bg-[#18181B] hover:bg-[#27272A] border border-white/5 rounded-2xl p-4 transition-all"
        >
            <div className="flex items-center gap-4">
                {/* Drag Handle */}
                <div
                    {...listeners}
                    {...attributes}
                    className="cursor-grab active:cursor-grabbing text-zinc-600 hover:text-zinc-400 transition-colors"
                >
                    <GripVertical className="w-5 h-5" />
                </div>

                {/* Order */}
                <div className="w-8 h-8 rounded-lg bg-[#10B981]/10 flex items-center justify-center text-[#10B981] font-bold text-sm">
                    {index + 1}
                </div>

                {/* Image */}
                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-black/20 shrink-0">
                    {exercise.exercise_library.media_url ? (
                        <Image
                            src={exercise.exercise_library.media_url}
                            alt={exercise.exercise_library.name}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">💪</div>
                    )}
                </div>

                {/* Exercise Info */}
                <div className="flex-1">
                    <h3 className="font-bold text-white">{exercise.exercise_library.name}</h3>
                    <p className="text-sm text-zinc-500">{exercise.exercise_library.primary_muscle}</p>
                </div>

                {/* Config */}
                <div className="flex flex-wrap gap-2">
                    <div className="px-3 py-1.5 bg-[#27272A] rounded-lg border border-white/5">
                        <span className="text-xs text-zinc-500">Sets:</span>{' '}
                        <span className="text-sm font-bold text-white">{exercise.sets}</span>
                    </div>
                    {exercise.reps && (
                        <div className="px-3 py-1.5 bg-[#27272A] rounded-lg border border-white/5">
                            <span className="text-xs text-zinc-500">Reps:</span>{' '}
                            <span className="text-sm font-bold text-white">{exercise.reps}</span>
                        </div>
                    )}
                    {exercise.weight_kg && (
                        <div className="px-3 py-1.5 bg-[#27272A] rounded-lg border border-white/5">
                            <span className="text-xs text-zinc-500">Weight:</span>{' '}
                            <span className="text-sm font-bold text-white">{exercise.weight_kg}kg</span>
                        </div>
                    )}
                    {exercise.rest_seconds !== undefined && (
                        <div className="px-3 py-1.5 bg-[#27272A] rounded-lg border border-white/5">
                            <span className="text-xs text-zinc-500">Rest:</span>{' '}
                            <span className="text-sm font-bold text-white">{exercise.rest_seconds}s</span>
                        </div>
                    )}
                    {exercise.duration_seconds && (
                        <div className="px-3 py-1.5 bg-[#27272A] rounded-lg border border-white/5">
                            <span className="text-xs text-zinc-500">Duration:</span>{' '}
                            <span className="text-sm font-bold text-white">{exercise.duration_seconds}s</span>
                        </div>
                    )}
                </div>

                {/* Delete */}
                <button
                    onClick={onRemove}
                    className="w-10 h-10 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    )
}
