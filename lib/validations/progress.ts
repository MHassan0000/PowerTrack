import { z } from 'zod'

export const bodyStatSchema = z.object({
    weight_kg: z.number().positive('Weight must be positive').max(500, 'Weight seems realistic?'),
    measured_at: z.string(),
    notes: z.string().max(500).optional().nullable(),
})

export const updateBodyStatSchema = z.object({
    weight_kg: z.number().positive('Weight must be positive').max(500).optional(),
    notes: z.string().max(500).optional().nullable(),
})

export type CreateBodyStatInput = z.infer<typeof bodyStatSchema>
