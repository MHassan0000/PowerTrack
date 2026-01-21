import { Database } from "./supabase"

export type User = Database['public']['Tables']['users']['Row']
export type Workout = Database['public']['Tables']['workouts']['Row']
export type Exercise = Database['public']['Tables']['exercises']['Row']
export type NutritionLog = Database['public']['Tables']['nutrition_logs']['Row']

// Auth types
export interface AuthUser {
    id: string
    email?: string
    user_metadata?: {
        full_name?: string
        avatar_url?: string
    }
}

// Form types
export interface LoginFormData {
    email: string
    password: string
}

export interface SignupFormData {
    email: string
    password: string
    confirmPassword: string
    fullName?: string
}

// Profile types
export interface UserProfile {
    id: string
    email: string
    full_name: string | null
    age: number | null
    height_cm: number | null
    weight_kg: number | null
    fitness_goal: 'lose_fat' | 'build_muscle' | 'maintain' | 'endurance' | 'strength' | null
    experience_level: 'beginner' | 'intermediate' | 'advanced' | null
    preferred_units: 'metric' | 'imperial' | null
    bio: string | null
    avatar_url: string | null
    created_at: string
    updated_at: string
}

// Exercise Library types
export interface LibraryExercise {
    id: string
    name: string
    description: string | null
    primary_muscle: string
    secondary_muscles: string[] | null
    equipment: string
    difficulty: 'beginner' | 'intermediate' | 'advanced'
    media_url: string | null
    instructions: string | null
    tips: string | null
    created_at: string
    updated_at: string
}

export const FITNESS_GOALS = {
    lose_fat: 'Lose Fat',
    build_muscle: 'Build Muscle',
    maintain: 'Maintain',
    endurance: 'Improve Endurance',
    strength: 'Build Strength',
} as const

export const EXPERIENCE_LEVELS = {
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
} as const
