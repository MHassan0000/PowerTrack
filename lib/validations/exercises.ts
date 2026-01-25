import { z } from 'zod'

export const createExerciseSchema = z.object({
    name: z.string().min(1, 'Name is required').max(100),
    description: z.string().optional().nullable(),
    primary_muscle: z.string().min(1, 'Primary muscle is required'),
    secondary_muscles: z.array(z.string()).optional(),
    equipment: z.string().min(1, 'Equipment is required'),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
    media_url: z.string().url().optional().nullable().or(z.literal('')),
    instructions: z.string().optional().nullable(),
    tips: z.string().optional().nullable(),
})

export type CreateExerciseData = z.infer<typeof createExerciseSchema>
