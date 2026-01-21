export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            users: {
                Row: {
                    id: string
                    email: string
                    full_name: string | null
                    avatar_url: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    email: string
                    full_name?: string | null
                    avatar_url?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    email?: string
                    full_name?: string | null
                    avatar_url?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            workouts: {
                Row: {
                    id: string
                    user_id: string
                    title: string
                    description: string | null
                    duration_minutes: number | null
                    calories_burned: number | null
                    completed_at: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    title: string
                    description?: string | null
                    duration_minutes?: number | null
                    calories_burned?: number | null
                    completed_at?: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    title?: string
                    description?: string | null
                    duration_minutes?: number | null
                    calories_burned?: number | null
                    completed_at?: string
                    created_at?: string
                }
            }
            exercises: {
                Row: {
                    id: string
                    workout_id: string
                    name: string
                    sets: number | null
                    reps: number | null
                    weight_kg: number | null
                    notes: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    workout_id: string
                    name: string
                    sets?: number | null
                    reps?: number | null
                    weight_kg?: number | null
                    notes?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    workout_id?: string
                    name?: string
                    sets?: number | null
                    reps?: number | null
                    weight_kg?: number | null
                    notes?: string | null
                    created_at?: string
                }
            }
            nutrition_logs: {
                Row: {
                    id: string
                    user_id: string
                    meal_type: string
                    food_item: string
                    calories: number | null
                    protein_g: number | null
                    carbs_g: number | null
                    fat_g: number | null
                    logged_at: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    meal_type: string
                    food_item: string
                    calories?: number | null
                    protein_g?: number | null
                    carbs_g?: number | null
                    fat_g?: number | null
                    logged_at?: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    meal_type?: string
                    food_item?: string
                    calories?: number | null
                    protein_g?: number | null
                    carbs_g?: number | null
                    fat_g?: number | null
                    logged_at?: string
                    created_at?: string
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
    }
}
