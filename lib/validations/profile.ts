import { z } from 'zod'

export const profileSchema = z.object({
    full_name: z.string().max(100).optional().nullable(),
    avatar_url: z.string().url().optional().nullable(),
    age: z.number().int().positive().max(120).optional().nullable(),
    height_cm: z.number().positive().max(300).optional().nullable(),
    weight_kg: z.number().positive().max(500).optional().nullable(),
    fitness_goal: z.enum(['lose_fat', 'build_muscle', 'maintain', 'endurance', 'strength']).optional().nullable(),
    experience_level: z.enum(['beginner', 'intermediate', 'advanced']).optional().nullable(),
    preferred_units: z.enum(['metric', 'imperial']).optional().nullable(),
    bio: z.string().max(500).optional().nullable(),
    daily_calorie_goal: z.number().nonnegative().optional().nullable(),
    daily_protein_goal_g: z.number().nonnegative().optional().nullable(),
    daily_carbs_goal_g: z.number().nonnegative().optional().nullable(),
    daily_fat_goal_g: z.number().nonnegative().optional().nullable(),
})

export type ProfileUpdates = z.infer<typeof profileSchema>
