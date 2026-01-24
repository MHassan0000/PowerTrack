'use client'

import { getFileIcon, formatFileSize } from '@/lib/ai/fileProcessor'

interface FilePreviewProps {
    fileName: string
    fileType: string
    fileSize: number
    onRemove?: () => void
    publicUrl?: string
    showDownload?: boolean
}

export function FilePreview({ 
    fileName, 
    fileType, 
    fileSize, 
    onRemove, 
    publicUrl,
    showDownload = false 
}: FilePreviewProps) {
    const icon = getFileIcon(fileType, fileName)
    const isImage = fileType.startsWith('image/')

    return (
        <div className="inline-flex items-center gap-2 px-3 py-2 bg-[#18181B] border border-zinc-800 rounded-lg text-sm group hover:border-[#10B981]/30 transition-all">
            {/* File Icon or Image Thumbnail */}
            {isImage && publicUrl ? (
                <div className="w-8 h-8 rounded overflow-hidden shrink-0">
                    <img 
                        src={publicUrl} 
                        alt={fileName}
                        className="w-full h-full object-cover"
                    />
                </div>
            ) : (
                <span className="text-xl shrink-0">{icon}</span>
            )}

            {/* File Info */}
            <div className="flex flex-col min-w-0">
                <span className="text-zinc-200 truncate max-w-50 text-xs font-medium">
                    {fileName}
                </span>
                <span className="text-zinc-500 text-[11px]">
                    {formatFileSize(fileSize)}
                </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 ml-2">
                {showDownload && publicUrl && (
                    <a
                        href={publicUrl}
                        download={fileName}
                        className="p-1 hover:bg-zinc-700 rounded transition-colors"
                        title="Download file"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                        </svg>
                    </a>
                )}
                
                {onRemove && (
                    <button
                        onClick={onRemove}
                        className="p-1 hover:bg-red-500/20 rounded transition-colors"
                        title="Remove file"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400 hover:text-red-400">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>
                )}
            </div>
        </div>
    )
}
