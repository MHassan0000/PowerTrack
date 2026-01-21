import { getPersonalRecords, getVolumeChartData, getBodyStats } from '@/lib/actions/progress'
import { VolumeChart } from '@/components/progress/VolumeChart'
import { BodyWeightChart } from '@/components/progress/BodyWeightChart'
import { PRGrid } from '@/components/progress/PRCard'
import { BodyWeightInput } from '@/components/progress/BodyWeightInput'
import { TrendingUp, Award, BarChart3 } from 'lucide-react'

export const metadata = {
    title: 'Progress | PowerTrack',
    description: 'Track your fitness progress, personal records, and body stats',
}

export default async function ProgressPage() {
    // Fetch all data server-side
    const [prsResult, volumeResult, bodyStatsResult] = await Promise.all([
        getPersonalRecords(),
        getVolumeChartData(90),
        getBodyStats(90),
    ])

    const prs = prsResult.data || []
    const volumeData = volumeResult.data || []
    const bodyStats = bodyStatsResult.data || []

    return (
        <div className="container mx-auto px-4 py-6 space-y-8">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">Progress Tracking</h1>
                <p className="text-[rgb(var(--foreground-muted))]">
                    Monitor your fitness journey and celebrate your achievements
                </p>
            </div>

            {/* Body Weight Section */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="w-6 h-6 text-[rgb(var(--primary))]" />
                        <h2 className="text-2xl font-bold">Body Weight</h2>
                    </div>
                    <BodyWeightInput />
                </div>
                <BodyWeightChart data={bodyStats} />
            </section>

            {/* Personal Records Section */}
            <section>
                <div className="flex items-center gap-2 mb-4">
                    <Award className="w-6 h-6 text-[rgb(var(--primary))]" />
                    <h2 className="text-2xl font-bold">Personal Records</h2>
                </div>
                <PRGrid prs={prs} />
            </section>

            {/* Volume Over Time Section */}
            <section>
                <div className="flex items-center gap-2 mb-4">
                    <BarChart3 className="w-6 h-6 text-[rgb(var(--primary))]" />
                    <h2 className="text-2xl font-bold">Volume Over Time</h2>
                </div>
                <VolumeChart data={volumeData} />
            </section>
        </div>
    )
}
