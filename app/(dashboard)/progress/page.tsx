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
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight text-white mb-2">Track Progress</h1>
                    <p className="text-zinc-400">
                        Monitor your body metrics and strength gains over time
                    </p>
                </div>
                <BodyWeightInput />
            </div>

            {/* Main Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Column: Body Weight & Volume */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Body Weight Chart Card */}
                    <div className="bg-[#18181B] rounded-2xl p-6 border border-white/5">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-2 h-2 rounded-full bg-[#10B981]" />
                            <h2 className="text-zinc-400 font-bold text-xs uppercase tracking-widest">Body Weight Trend</h2>
                        </div>
                        <BodyWeightChart data={bodyStats} />
                    </div>

                    {/* Volume Chart Card */}
                    <div className="bg-[#18181B] rounded-2xl p-6 border border-white/5">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-2 h-2 rounded-full bg-[#10B981]" />
                            <h2 className="text-zinc-400 font-bold text-xs uppercase tracking-widest">Volume Consistency</h2>
                        </div>
                        <VolumeChart data={volumeData} />
                    </div>
                </div>

                {/* Right Column: PRs */}
                <div className="space-y-6">
                    <div className="bg-[#18181B] rounded-2xl p-6 border border-white/5 h-full">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-[#10B981]" />
                                <h2 className="text-zinc-400 font-bold text-xs uppercase tracking-widest">Personal Records</h2>
                            </div>
                        </div>
                        <PRGrid prs={prs} />
                    </div>
                </div>
            </div>
        </div>
    )
}
