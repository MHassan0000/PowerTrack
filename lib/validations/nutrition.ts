import { z } from 'zod'

export const mealTypeSchema = z.enum(['breakfast', 'lunch', 'dinner', 'snack', 'other'])

export const createNutritionLogSchema = z.object({
    meal_type: mealTypeSchema,
    food_item: z.string().min(1, 'Food item name is required').max(100, 'Food item name is too long'),
    calories: z.number().nonnegative('Calories cannot be negative').optional().nullable(),
    protein_g: z.number().nonnegative('Protein cannot be negative').optional().nullable(),
    carbs_g: z.number().nonnegative('Carbs cannot be negative').optional().nullable(),
    fat_g: z.number().nonnegative('Fat cannot be negative').optional().nullable(),
    fiber_g: z.number().nonnegative('Fiber cannot be negative').optional().nullable(),
    sugar_g: z.number().nonnegative('Sugar cannot be negative').optional().nullable(),
    notes: z.string().max(500, 'Notes are too long').optional().nullable(),
    logged_at: z.string().optional(),
})

export const updateNutritionLogSchema = createNutritionLogSchema.partial()

export type CreateNutritionLogInput = z.infer<typeof createNutritionLogSchema>
export type UpdateNutritionLogInput = z.infer<typeof updateNutritionLogSchema>
