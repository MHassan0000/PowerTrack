'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { BodyStat } from '@/lib/actions/progress'
import { motion } from 'framer-motion'

interface BodyWeightChartProps {
    data: BodyStat[]
}

export function BodyWeightChart({ data }: BodyWeightChartProps) {
    // Format the data for the chart
    const chartData = data.map(stat => ({
        date: new Date(stat.measured_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        weight: Number(stat.weight_kg),
    }))

    if (chartData.length === 0) {
        return (
            <div className="bg-[rgb(var(--card))] rounded-xl p-8 text-center glow-border">
                <p className="text-[rgb(var(--foreground-muted))]">
                    No body weight data yet. Add your first measurement to start tracking!
                </p>
            </div>
        )
    }

    // Calculate trend (simple moving average)
    const windowSize = Math.min(7, chartData.length)
    const trendData = chartData.map((point, index) => {
        const start = Math.max(0, index - windowSize + 1)
        const values = chartData.slice(start, index + 1).map(d => d.weight)
        const avg = values.reduce((sum, val) => sum + val, 0) / values.length
        return { ...point, trend: Number(avg.toFixed(1)) }
    })

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[rgb(var(--card))] rounded-xl p-6 glow-border"
        >
            <h3 className="text-xl font-bold mb-4">Body Weight Trend</h3>
            <p className="text-sm text-[rgb(var(--foreground-muted))] mb-6">
                Your body weight over the last {data.length} days
            </p>

            <ResponsiveContainer width="100%" height={300}>
                <LineChart
                    data={trendData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    role="img"
                    aria-label="Body weight over time"
                >
                    <title>Body Weight Chart</title>
                    <desc>Line chart showing body weight measurements over time with trend line</desc>

                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(var(--border), 0.3)" />
                    <XAxis
                        dataKey="date"
                        stroke="rgb(var(--foreground-muted))"
                        style={{ fontSize: '12px' }}
                    />
                    <YAxis
                        stroke="rgb(var(--foreground-muted))"
                        style={{ fontSize: '12px' }}
                        domain={['dataMin - 2', 'dataMax + 2']}
                        label={{ value: 'Weight (kg)', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgb(var(--card))',
                            border: '1px solid rgb(var(--border))',
                            borderRadius: '8px',
                            color: 'rgb(var(--foreground))',
                        }}
                        formatter={(value: number | undefined) => [`${value || 0}kg`, 'Weight']}
                    />
                    <Line
                        type="monotone"
                        dataKey="weight"
                        stroke="rgb(var(--primary))"
                        strokeWidth={2}
                        dot={{ fill: 'rgb(var(--primary))', r: 4 }}
                        activeDot={{ r: 6 }}
                        name="Body Weight"
                    />
                    <Line
                        type="monotone"
                        dataKey="trend"
                        stroke="rgba(var(--primary), 0.4)"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={false}
                        name="Trend"
                    />
                </LineChart>
            </ResponsiveContainer>

            {/* Stats Summary */}
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-[rgb(var(--border))]">
                <div>
                    <div className="text-xs text-[rgb(var(--foreground-muted))] mb-1">Current</div>
                    <div className="text-lg font-bold">{chartData[chartData.length - 1]?.weight}kg</div>
                </div>
                <div>
                    <div className="text-xs text-[rgb(var(--foreground-muted))] mb-1">Highest</div>
                    <div className="text-lg font-bold">{Math.max(...chartData.map(d => d.weight))}kg</div>
                </div>
                <div>
                    <div className="text-xs text-[rgb(var(--foreground-muted))] mb-1">Lowest</div>
                    <div className="text-lg font-bold">{Math.min(...chartData.map(d => d.weight))}kg</div>
                </div>
            </div>
        </motion.div>
    )
}
