import { getNutritionLogsByMeal, getDailyNutritionSummary } from '@/lib/actions/nutrition'
import { NutritionPageContent } from '@/components/nutrition/NutritionPageContent'

interface NutritionPageProps {
    searchParams: Promise<{ date?: string }>
}

export default async function NutritionPage({ searchParams }: NutritionPageProps) {
    const params = await searchParams
    const dateStr = params.date || new Date().toISOString().split('T')[0]
    
    const [logsResult, summaryResult] = await Promise.all([
        getNutritionLogsByMeal(dateStr),
        getDailyNutritionSummary(dateStr),
    ])

    return (
        <NutritionPageContent 
            initialLogs={logsResult.data}
            initialSummary={summaryResult.data}
            initialDate={dateStr}
        />
    )
}
