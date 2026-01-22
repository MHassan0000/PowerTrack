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
            className="bg-[#18181B] rounded-2xl p-6 border border-white/5"
        >
            <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-1">Body Weight Trend</h3>
                <p className="text-sm text-zinc-500">
                    Your body weight over the last {data.length} days
                </p>
            </div>

            <ResponsiveContainer width="100%" height={300}>
                <LineChart
                    data={trendData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    role="img"
                    aria-label="Body weight over time"
                >
                    <title>Body Weight Chart</title>
                    <desc>Line chart showing body weight measurements over time with trend line</desc>

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
                        domain={['dataMin - 2', 'dataMax + 2']}
                        tickLine={false}
                        axisLine={false}
                        label={{ value: 'WEIGHT (KG)', angle: -90, position: 'insideLeft', fill: '#52525B', fontSize: 10, fontWeight: 'bold' }}
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
                        formatter={(value: number | undefined) => [`${value || 0}kg`, 'Weight']}
                    />
                    <Line
                        type="monotone"
                        dataKey="weight"
                        stroke="#10B981"
                        strokeWidth={3}
                        dot={{ fill: '#18181B', stroke: '#10B981', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, fill: '#10B981', stroke: '#FFF', strokeWidth: 2 }}
                        name="Body Weight"
                    />
                    <Line
                        type="monotone"
                        dataKey="trend"
                        stroke="#34D399"
                        strokeOpacity={0.5}
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={false}
                        name="Trend"
                    />
                </LineChart>
            </ResponsiveContainer>

            {/* Stats Summary */}
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/5">
                <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Current</div>
                    <div className="text-xl font-bold text-white">{chartData[chartData.length - 1]?.weight} <span className="text-sm font-normal text-zinc-500">kg</span></div>
                </div>
                <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Highest</div>
                    <div className="text-xl font-bold text-white">{Math.max(...chartData.map(d => d.weight))} <span className="text-sm font-normal text-zinc-500">kg</span></div>
                </div>
                <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Lowest</div>
                    <div className="text-xl font-bold text-white">{Math.min(...chartData.map(d => d.weight))} <span className="text-sm font-normal text-zinc-500">kg</span></div>
                </div>
            </div>
        </motion.div>
    )
}
