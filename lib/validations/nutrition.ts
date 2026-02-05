import { z } from 'zod'

export const mealTypeSchema = z.enum(['breakfast', 'lunch', 'dinner', 'snack', 'other'])

export const createNutritionLogSchema = z.object({
    meal_type: mealTypeSchema,
    food_item: z.string().min(1, 'Food item name is required').max(100, 'Food item name is too long'),
    calories: z.number().nonnegative('Calories cannot be negative').max(100000, 'Calories cannot exceed 100,000 per item').optional().nullable(),
    protein_g: z.number().nonnegative('Protein cannot be negative').max(1000, 'Protein cannot exceed 1,000g per item').optional().nullable(),
    carbs_g: z.number().nonnegative('Carbs cannot be negative').max(1000, 'Carbs cannot exceed 1,000g per item').optional().nullable(),
    fat_g: z.number().nonnegative('Fat cannot be negative').max(1000, 'Fat cannot exceed 1,000g per item').optional().nullable(),
    fiber_g: z.number().nonnegative('Fiber cannot be negative').max(100, 'Fiber cannot exceed 100g per item').optional().nullable(),
    sugar_g: z.number().nonnegative('Sugar cannot be negative').max(1000, 'Sugar cannot exceed 1,000g per item').optional().nullable(),
    notes: z.string().max(60, 'Notes are too long (max 60 chars)').optional().nullable(),
    logged_at: z.string().optional(),
})

export const updateNutritionLogSchema = createNutritionLogSchema.partial()

export type CreateNutritionLogInput = z.infer<typeof createNutritionLogSchema>
export type UpdateNutritionLogInput = z.infer<typeof updateNutritionLogSchema>
