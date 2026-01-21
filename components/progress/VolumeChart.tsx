'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import type { VolumeDataPoint } from '@/lib/actions/progress'
import { motion } from 'framer-motion'

interface VolumeChartProps {
    data: VolumeDataPoint[]
}

export function VolumeChart({ data }: VolumeChartProps) {
    // Format the data for the chart
    const chartData = data.map(point => ({
        date: new Date(point.workout_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        volume: Number(point.total_volume),
        workout: point.workout_name,
    }))

    if (chartData.length === 0) {
        return (
            <div className="bg-[rgb(var(--card))] rounded-xl p-8 text-center glow-border">
                <p className="text-[rgb(var(--foreground-muted))]">
                    No workout data available. Complete some workouts to see your progress!
                </p>
            </div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[rgb(var(--card))] rounded-xl p-6 glow-border"
        >
            <h3 className="text-xl font-bold mb-4">Volume Over Time</h3>
            <p className="text-sm text-[rgb(var(--foreground-muted))] mb-6">
                Total weight lifted per workout session
            </p>

            <ResponsiveContainer width="100%" height={300}>
                <LineChart
                    data={chartData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    role="img"
                    aria-label="Volume per workout over time"
                >
                    <title>Workout Volume Chart</title>
                    <desc>Line chart showing total volume lifted per workout session over time</desc>

                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(var(--border), 0.3)" />
                    <XAxis
                        dataKey="date"
                        stroke="rgb(var(--foreground-muted))"
                        style={{ fontSize: '12px' }}
                    />
                    <YAxis
                        stroke="rgb(var(--foreground-muted))"
                        style={{ fontSize: '12px' }}
                        label={{ value: 'Volume (kg)', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgb(var(--card))',
                            border: '1px solid rgb(var(--border))',
                            borderRadius: '8px',
                            color: 'rgb(var(--foreground))',
                        }}
                        formatter={(value: number | undefined) => [`${value || 0}kg`, 'Volume']}
                        labelFormatter={(label: string, payload: readonly any[]) => {
                            if (payload && payload[0]) {
                                return `${label} - ${payload[0].payload.workout}`
                            }
                            return label
                        }}
                    />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey="volume"
                        stroke="rgb(var(--primary))"
                        strokeWidth={2}
                        dot={{ fill: 'rgb(var(--primary))', r: 4 }}
                        activeDot={{ r: 6 }}
                        name="Total Volume"
                    />
                </LineChart>
            </ResponsiveContainer>

            {/* Data table for accessibility */}
            <details className="mt-4">
                <summary className="text-sm text-[rgb(var(--primary))] cursor-pointer hover:underline">
                    View data as table
                </summary>
                <div className="mt-3 overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-[rgb(var(--border))]">
                                <th className="text-left py-2">Date</th>
                                <th className="text-left py-2">Workout</th>
                                <th className="text-right py-2">Volume (kg)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {chartData.map((row, index) => (
                                <tr key={index} className="border-b border-[rgb(var(--border))]/50">
                                    <td className="py-2">{row.date}</td>
                                    <td className="py-2">{row.workout}</td>
                                    <td className="text-right py-2">{row.volume}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </details>
        </motion.div>
    )
}
