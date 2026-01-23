import { z } from 'zod'

/**
 * Workout creation/update validation schema
 */
export const workoutSchema = z.object({
    name: z.string()
        .min(1, 'Workout name is required')
        .max(100, 'Workout name must be less than 100 characters')
        .trim(),
    description: z.string()
        .max(500, 'Description must be less than 500 characters')
        .optional()
        .nullable(),
    is_template: z.boolean().default(false)
})

/**
 * Exercise configuration validation schema
 */
export const exerciseConfigSchema = z.object({
    sets: z.number()
        .int('Sets must be a whole number')
        .min(1, 'At least 1 set required')
        .max(20, 'Maximum 20 sets allowed'),
    reps: z.number()
        .int('Reps must be a whole number')
        .min(1, 'At least 1 rep required')
        .max(100, 'Maximum 100 reps allowed')
        .optional()
        .nullable(),
    rest_seconds: z.number()
        .int('Rest time must be in whole seconds')
        .min(0, 'Rest time cannot be negative')
        .max(600, 'Maximum 10 minutes rest'),
    duration_seconds: z.number()
        .int('Duration must be in whole seconds')
        .min(0, 'Duration cannot be negative')
        .max(3600, 'Maximum 1 hour duration')
        .optional()
        .nullable(),
    notes: z.string()
        .max(500, 'Notes must be less than 500 characters')
        .optional()
        .nullable()
})

/**
 * Set log validation schema
 */
export const setLogSchema = z.object({
    reps: z.number()
        .int('Reps must be a whole number')
        .min(0, 'Reps cannot be negative')
        .max(100, 'Maximum 100 reps'),
    weight_kg: z.number()
        .min(0, 'Weight cannot be negative')
        .max(500, 'Maximum 500kg')
})

// Export types
export type WorkoutInput = z.infer<typeof workoutSchema>
export type ExerciseConfigInput = z.infer<typeof exerciseConfigSchema>
export type SetLogInput = z.infer<typeof setLogSchema>
