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
            <div className="bg-[rgb(var(--card))] rounded-xl p-8 text-center">
                <p className="text-[rgb(var(--foreground-muted))]">
                    No workout data available. Complete some workouts to see your progress!
                </p>
            </div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full"
        >
            <ResponsiveContainer width="100%" height={300}>
                <LineChart
                    data={chartData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255, 0.05)" vertical={false} />
                    <XAxis
                        dataKey="date"
                        stroke="#52525B"
                        style={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}
                        tickLine={false}
                        axisLine={false}
                        dy={10}
                    />
                    <YAxis
                        stroke="#52525B"
                        style={{ fontSize: '10px', fontWeight: 'bold' }}
                        tickLine={false}
                        axisLine={false}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#18181B',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '12px',
                            color: '#FFF',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)'
                        }}
                        itemStyle={{ color: '#10B981' }}
                        formatter={(value: number | undefined) => [`${value || 0}kg`, 'Volume']}
                        labelFormatter={(label: string, payload: readonly any[]) => {
                            if (payload && payload[0]) {
                                return `${label} • ${payload[0].payload.workout}`
                            }
                            return label
                        }}
                    />
                    <Line
                        type="monotone"
                        dataKey="volume"
                        stroke="#10B981"
                        strokeWidth={3}
                        dot={{ fill: '#18181B', stroke: '#10B981', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, fill: '#10B981', stroke: '#FFF', strokeWidth: 2 }}
                        name="Total Volume"
                    />
                </LineChart>
            </ResponsiveContainer>
        </motion.div>
    )
}
