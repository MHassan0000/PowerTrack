import { ChatInterface } from '@/components/ai/ChatInterface'
import { Sparkles } from 'lucide-react'

export default function AICoachPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-white">AI Fitness Coach</h1>
                    <p className="text-zinc-400">
                        Your personal trainer powered by AI
                    </p>
                </div>
            </div>

            {/* Chat Interface */}
            <div className="bg-[#18181B] rounded-2xl border border-white/5 overflow-hidden">
                <ChatInterface />
            </div>
        </div>
    )
}
