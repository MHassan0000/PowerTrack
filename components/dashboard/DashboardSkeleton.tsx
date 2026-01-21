'use client'

import { Skeleton } from "@/components/ui/Skeleton"
import { motion } from "framer-motion"

export function DashboardSkeleton() {
    return (
        <div className="space-y-8 animate-pulse">
            {/* Profile Card Skeleton */}
            <div className="rounded-xl bg-[rgb(var(--card))] p-6 glow-border h-50">
                <div className="flex items-center gap-6">
                    <Skeleton className="w-24 h-24 rounded-full" />
                    <div className="space-y-4 flex-1">
                        <Skeleton className="h-8 w-1/3" />
                        <Skeleton className="h-4 w-1/4" />
                    </div>
                </div>
            </div>

            {/* Stats Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="rounded-xl bg-[rgb(var(--card))] p-6 glow-border h-30">
                        <Skeleton className="h-4 w-1/2 mb-4" />
                        <Skeleton className="h-10 w-1/3" />
                    </div>
                ))}
            </div>

            {/* Recent Activity Skeleton */}
            <div className="rounded-2xl bg-[rgb(var(--card))] p-8 glow-border h-75">
                <Skeleton className="h-8 w-1/4 mb-6" />
                <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="h-16 w-full rounded-lg" />
                    ))}
                </div>
            </div>
        </div>
    )
}
