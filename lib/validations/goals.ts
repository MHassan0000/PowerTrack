import { z } from 'zod'

export const goalTypeSchema = z.enum(['strength', 'weight_loss', 'weight_gain', 'volume', 'consistency'])
export const goalStatusSchema = z.enum(['active', 'completed', 'archived'])

export const createGoalSchema = z.object({
    title: z.string().min(1, 'Title is required').max(100),
    description: z.string().max(500).optional().nullable(),
    goal_type: goalTypeSchema,
    target_value: z.number().positive('Target value must be positive'),
    unit: z.string().min(1, 'Unit is required').max(20),
    exercise_id: z.string().uuid().optional().nullable(),
    initial_value: z.number().nonnegative().optional().nullable(),
    target_date: z.string().optional().nullable(),
})

export const updateGoalSchema = createGoalSchema.partial().and(
    z.object({
        current_value: z.number().nonnegative().optional()
    })
)

export type CreateGoalData = z.infer<typeof createGoalSchema>
