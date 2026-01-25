import { z } from 'zod'

// --- Set Log Schemas ---
export const setLogSchema = z.object({
    exercise_id: z.string().uuid(),
    set_number: z.number().int().positive(),
    reps: z.number().int().nonnegative().optional().nullable(),
    weight_kg: z.number().nonnegative().optional().nullable(),
    duration_seconds: z.number().nonnegative().optional().nullable(),
    rest_seconds: z.number().nonnegative().optional().nullable(),
    rpe: z.number().min(1).max(10).optional().nullable(),
    is_warmup: z.boolean().optional(),
    is_failure: z.boolean().optional(),
    notes: z.string().max(500).optional().nullable(),
})

export type SetData = z.infer<typeof setLogSchema>

// --- Workout Session Schemas ---
export const startSessionSchema = z.object({
    workoutId: z.string().uuid().nullable().optional(),
    workoutName: z.string().min(1, 'Workout name is required').max(100)
})

export const completeSessionSchema = z.object({
    sessionId: z.string().uuid(),
    notes: z.string().max(1000).optional()
})

// --- Workout Management Schemas ---

// Exercise config within a workout
export const workoutExerciseSchema = z.object({
    exercise_id: z.string().uuid(),
    sets: z.number().int().positive('Sets must be positive'),
    reps: z.number().int().nonnegative().optional(),
    duration_seconds: z.number().nonnegative().optional(),
    rest_seconds: z.number().nonnegative(),
    weight_kg: z.number().nonnegative().optional(),
    notes: z.string().max(500).optional()
})

// Schema for updating a workout exercise
export const updateWorkoutExerciseSchema = workoutExerciseSchema.partial().omit({ exercise_id: true })

// Schema for creating a workout
// Note: We might need to handle FormData parsing separately or use z.preprocess if we were validating FormData directly.
// For now, assuming we validate the objects extracted from FormData or passed directly.
export const createWorkoutSchema = z.object({
    name: z.string().min(1, 'Name is required').max(100),
    description: z.string().max(1000).optional().nullable(),
    is_template: z.boolean().optional(),
    scheduled_date: z.string().optional().nullable(),
    notes: z.string().max(1000).optional().nullable(),
})

export const updateWorkoutSchema = createWorkoutSchema.partial()
