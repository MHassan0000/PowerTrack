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
            className="bg-[#18181B] rounded-2xl p-6 border border-white/5"
        >
            <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-1">Volume Over Time</h3>
                <p className="text-sm text-zinc-500">
                    Total weight lifted per workout session
                </p>
            </div>

            <ResponsiveContainer width="100%" height={300}>
                <LineChart
                    data={chartData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    role="img"
                    aria-label="Volume per workout over time"
                >
                    <title>Workout Volume Chart</title>
                    <desc>Line chart showing total volume lifted per workout session over time</desc>

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
                        label={{ value: 'VOLUME (KG)', angle: -90, position: 'insideLeft', fill: '#52525B', fontSize: 10, fontWeight: 'bold' }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#27272A',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '12px',
                            color: '#FFF',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
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
                    <Legend iconType="circle" />
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

            {/* Data table for accessibility */}
            <details className="mt-4 group">
                <summary className="text-xs font-bold text-zinc-500 cursor-pointer hover:text-[#10B981] transition-colors uppercase tracking-wider flex items-center gap-2 select-none">
                    View Data Table
                </summary>
                <div className="mt-4 overflow-x-auto rounded-lg border border-white/5">
                    <table className="w-full text-sm text-zinc-400">
                        <thead className="bg-[#27272A] text-white">
                            <tr>
                                <th className="text-left py-3 px-4 text-xs font-bold uppercase tracking-wider">Date</th>
                                <th className="text-left py-3 px-4 text-xs font-bold uppercase tracking-wider">Workout</th>
                                <th className="text-right py-3 px-4 text-xs font-bold uppercase tracking-wider">Volume (kg)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {chartData.map((row, index) => (
                                <tr key={index} className="hover:bg-white/5 transition-colors">
                                    <td className="py-2.5 px-4 font-medium">{row.date}</td>
                                    <td className="py-2.5 px-4">{row.workout}</td>
                                    <td className="text-right py-2.5 px-4 font-bold text-white">{row.volume}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </details>
        </motion.div>
    )
}
