'use client'

import { getFileIcon, formatFileSize } from '@/lib/ai/fileProcessor'

interface FilePreviewProps {
    fileName: string
    fileType: string
    fileSize: number
    onRemove?: () => void
}

export function FilePreview({ 
    fileName, 
    fileType, 
    fileSize, 
    onRemove
}: FilePreviewProps) {
    const icon = getFileIcon(fileType, fileName)

    return (
        <div className="inline-flex items-center gap-2 px-3 py-2 bg-[#18181B] border border-zinc-800 rounded-lg text-sm group hover:border-[#10B981]/30 transition-all">
            {/* File Icon */}
            <span className="text-xl shrink-0">{icon}</span>

            {/* File Info */}
            <div className="flex flex-col min-w-0">
                <span className="text-zinc-200 truncate max-w-50 text-xs font-medium">
                    {fileName}
                </span>
                <span className="text-zinc-500 text-[11px]">
                    {formatFileSize(fileSize)}
                </span>
            </div>

            {/* Remove Button */}
            {onRemove && (
                <button
                    onClick={onRemove}
                    className="p-1 hover:bg-red-500/20 rounded transition-colors ml-2"
                    title="Remove file"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400 hover:text-red-400">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                </button>
            )}
        </div>
    )
}
