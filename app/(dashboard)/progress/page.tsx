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
        <div className="space-y-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Progress Tracking</h1>
                <p className="text-zinc-400">
                    Monitor your fitness journey and celebrate your achievements
                </p>
            </div>

            {/* Body Weight Section */}
            <section>
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#10B981]/10 rounded-lg">
                            <TrendingUp className="w-5 h-5 text-[#10B981]" />
                        </div>
                        <h2 className="text-xl font-bold text-white">Body Weight</h2>
                    </div>
                    <BodyWeightInput />
                </div>
                <BodyWeightChart data={bodyStats} />
            </section>

            {/* Personal Records Section */}
            <section>
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-yellow-500/10 rounded-lg">
                        <Award className="w-5 h-5 text-yellow-500" />
                    </div>
                    <h2 className="text-xl font-bold text-white">Personal Records</h2>
                </div>
                <PRGrid prs={prs} />
            </section>

            {/* Volume Over Time Section */}
            <section>
                <div className="flex items-center gap-3 mb-6">
                     <div className="p-2 bg-blue-500/10 rounded-lg">
                        <BarChart3 className="w-5 h-5 text-blue-500" />
                    </div>
                    <h2 className="text-xl font-bold text-white">Volume Over Time</h2>
                </div>
                <VolumeChart data={volumeData} />
            </section>
        </div>
    )
}
