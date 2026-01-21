import { Suspense } from 'react'
import { DashboardSkeleton } from '@/components/dashboard/DashboardSkeleton'
import DashboardContent from './DashboardContent'

export default function DashboardPage() {
    return (
        <Suspense fallback={<DashboardSkeleton />}>
            <DashboardContent />
        </Suspense>
    )
}
