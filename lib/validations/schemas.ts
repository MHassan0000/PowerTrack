import { z } from 'zod'

// Goal Type and Status Enums
export const goalTypeSchema = z.enum(['strength', 'weight_loss', 'weight_gain', 'volume', 'consistency'])
export const goalStatusSchema = z.enum(['active', 'completed', 'archived'])

// Create Goal Schema
export const createGoalSchema = z.object({
    title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
    description: z.string().max(500, 'Description must be less than 500 characters').optional(),
    goal_type: goalTypeSchema,
    target_value: z.number().positive('Target value must be positive'),
    unit: z.string().min(1).max(20),
    exercise_id: z.string().uuid('Invalid exercise ID').optional(),
    initial_value: z.number().min(0).optional(),
    target_date: z.string().datetime().optional(),
})

// Update Goal Schema
export const updateGoalSchema = createGoalSchema.partial()

// Body Stats Schema
export const createBodyStatSchema = z.object({
    weight_kg: z.number().positive('Weight must be positive').max(500, 'Weight seems unrealistic'),
    measured_at: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    notes: z.string().max(500).optional(),
})

// Workout Schemas
export const createWorkoutSchema = z.object({
    name: z.string().min(1, 'Name is required').max(100),
    description: z.string().max(1000).optional(),
    category: z.string().min(1).max(50).optional(),
    difficulty_level: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
    estimated_duration_minutes: z.number().int().positive().max(300).optional(),
})

export const addExerciseToWorkoutSchema = z.object({
    workout_id: z.string().uuid(),
    exercise_id: z.string().uuid(),
    order_index: z.number().int().min(0),
    sets: z.number().int().positive().max(20).optional(),
    reps: z.number().int().positive().max(500).optional(),
    duration_seconds: z.number().int().positive().max(3600).optional(),
    rest_seconds: z.number().int().min(0).max(600).optional(),
    notes: z.string().max(500).optional(),
})

// Set Log Schema
export const logSetSchema = z.object({
    session_id: z.string().uuid(),
    exercise_id: z.string().uuid(),
    set_number: z.number().int().positive().max(50),
    weight_kg: z.number().min(0).max(1000).optional(),
    reps: z.number().int().positive().max(500).optional(),
    duration_seconds: z.number().int().positive().max(7200).optional(),
    distance_meters: z.number().positive().max(100000).optional(),
    notes: z.string().max(200).optional(),
})

// Profile Update Schema
export const updateProfileSchema = z.object({
    full_name: z.string().min(1).max(100).optional(),
    bio: z.string().max(500).optional(),
    fitness_goals: z.string().max(500).optional(),
    experience_level: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
    avatar_url: z.string().url().optional(),
})

// Type exports
export type CreateGoalInput = z.infer<typeof createGoalSchema>
export type UpdateGoalInput = z.infer<typeof updateGoalSchema>
export type CreateBodyStatInput = z.infer<typeof createBodyStatSchema>
export type CreateWorkoutInput = z.infer<typeof createWorkoutSchema>
export type AddExerciseToWorkoutInput = z.infer<typeof addExerciseToWorkoutSchema>
export type LogSetInput = z.infer<typeof logSetSchema>
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
