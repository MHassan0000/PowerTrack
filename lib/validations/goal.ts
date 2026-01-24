import { z } from 'zod'

/**
 * Goal type enum
 */
export const goalTypeEnum = z.enum([
    'weight_loss',
    'muscle_gain',
    'strength',
    'endurance',
    'custom'
])

/** 
 * Goal creation validation schema
 */
export const goalSchema = z.object({
    title: z.string()
        .min(1, 'Goal title is required')
        .max(100, 'Title must be less than 100 characters')
        .trim(),
    description: z.string()
        .max(500, 'Description must be less than 500 characters')
        .optional()
        .nullable(),
    goal_type: goalTypeEnum,
    target_value: z.number()
        .positive('Target value must be positive')
        .max(10000, 'Target value too large'),
    current_value: z.number()
        .nonnegative('Current value cannot be negative')
        .max(10000, 'Current value too large')
        .default(0),
    unit: z.string()
        .min(1, 'Unit is required')
        .max(20, 'Unit must be less than 20 characters'),
    target_date: z.string()
        .refine((date) => !isNaN(Date.parse(date)), 'Invalid date format')
        .refine((date) => new Date(date) > new Date(), 'Target date must be in the future'),
    exercise_id: z.string()
        .uuid('Invalid exercise ID')
        .optional()
        .nullable()
})

/**
 * Goal update validation schema (allows current_value in past)
 */
export const goalUpdateSchema = goalSchema.extend({
    target_date: z.string()
        .refine((date) => !isNaN(Date.parse(date)), 'Invalid date format')
        // Remove future date requirement for updates
})

// Export types
export type GoalInput = z.infer<typeof goalSchema>
export type GoalUpdateInput = z.infer<typeof goalUpdateSchema>
export type GoalType = z.infer<typeof goalTypeEnum>
