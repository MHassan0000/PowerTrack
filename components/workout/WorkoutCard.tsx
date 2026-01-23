import { memo } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Dumbbell, Clock, LayoutList } from 'lucide-react'

interface WorkoutCardProps {
    workout: {
        id: string
        name: string
        description?: string | null
        is_template: boolean
        exercises: any[]
    }
}

function WorkoutCardComponent({ workout }: WorkoutCardProps) {
    const exerciseCount = workout.exercises?.length || 0
    const totalSets = workout.exercises?.reduce((sum, ex) => sum + ex.sets, 0) || 0

    return (
        <Link href={`/workouts/${workout.id}`}>
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                className="group bg-[#18181B] hover:bg-[#27272A] rounded-2xl p-6 border border-white/5 hover:border-[#10B981]/30 transition-all duration-300 cursor-pointer"
            >
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#10B981] transition-colors">
                            {workout.name}
                        </h3>
                        {workout.description && (
                            <p className="text-sm text-zinc-400 line-clamp-2">
                                {workout.description}
                            </p>
                        )}
                    </div>
                    {workout.is_template && (
                        <span className="px-3 py-1 bg-[#10B981]/10 text-[#10B981] text-xs font-bold rounded-lg">
                            TEMPLATE
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-4 text-sm text-zinc-500">
                    <div className="flex items-center gap-2">
                        <LayoutList className="w-4 h-4" />
                        <span>{exerciseCount} exercises</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Dumbbell className="w-4 h-4" />
                        <span>{totalSets} sets</span>
                    </div>
                </div>
            </motion.div>
        </Link>
    )
}

export const WorkoutCard = memo(WorkoutCardComponent)
