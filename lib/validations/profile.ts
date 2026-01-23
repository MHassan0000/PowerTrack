import { z } from 'zod'

/**
 * Nutrition entry validation schema
 */
export const nutritionSchema = z.object({
    food_item: z.string()
        .min(1, 'Food item is required')
        .max(100, 'Food item name must be less than 100 characters')
        .trim(),
    calories: z.string()
        .regex(/^\d+$/, 'Calories must be a number')
        .transform(Number)
        .pipe(z.number().min(0, 'Calories cannot be negative').max(10000, 'Calories too high')),
    protein_g: z.string()
        .regex(/^\d+(\.\d+)?$/, 'Protein must be a number')
        .transform(Number)
        .pipe(z.number().min(0, 'Protein cannot be negative').max(500, 'Protein too high')),
    carbs_g: z.string()
        .regex(/^\d+(\.\d+)?$/, 'Carbs must be a number')
        .transform(Number)
        .pipe(z.number().min(0, 'Carbs cannot be negative').max(1000, 'Carbs too high')),
    fat_g: z.string()
        .regex(/^\d+(\.\d+)?$/, 'Fat must be a number')
        .transform(Number)
        .pipe(z.number().min(0, 'Fat cannot be negative').max(500, 'Fat too high')),
    notes: z.string()
        .max(500, 'Notes must be less than 500 characters')
        .optional()
        .nullable()
})

/**
 * Profile update validation schema
 */
export const profileSchema = z.object({
    full_name: z.string()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name must be less than 100 characters')
        .trim()
        .optional(),
    weight_kg: z.number()
        .positive('Weight must be positive')
        .max(500, 'Weight too high')
        .optional()
        .nullable(),
    height_cm: z.number()
        .positive('Height must be positive')
        .min(50, 'Height too low')
        .max(300, 'Height too high')
        .optional()
        .nullable(),
    date_of_birth: z.string()
        .refine((date) => !isNaN(Date.parse(date)), 'Invalid date format')
        .refine((date) => new Date(date) < new Date(), 'Birth date must be in the past')
        .optional()
        .nullable()
})

// Export types
export type NutritionInput = z.infer<typeof nutritionSchema>
export type ProfileInput = z.infer<typeof profileSchema>
