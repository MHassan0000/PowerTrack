import { ChatInterface } from '@/components/ai/ChatInterface'

export default function AICoachPage() {
    return (
        <div className="fixed inset-0 lg:left-72 h-dvh flex flex-col bg-[#0F0F10]">
            {/* Minimal Header */}
            <div className="shrink-0 px-6 py-4 border-b border-white/5 bg-[#0F0F10]">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#10B981]/10 flex items-center justify-center border border-[#10B981]/20">
                         {/* Abstract Green Logo */}
                         <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M2 17L12 22L22 17" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M2 12L12 17L22 12" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-lg font-semibold text-white tracking-tight">
                            PowerTrack AI
                        </h1>
                    </div>
                </div>
            </div>

            {/* Chat Interface - Takes remaining space */}
            <div className="flex-1 overflow-hidden">
                <ChatInterface />
            </div>
        </div>
    )
}
