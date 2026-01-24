/**
 * File processor for extracting content from uploaded files
 * Supports text files, PDFs, and image metadata
 */

export interface ProcessedFile {
    fileName: string
    fileType: string
    fileSize: number
    extractedContent: string
    contentType: 'text' | 'image' | 'document'
}

const MAX_CONTENT_LENGTH = 10000 // Limit content to prevent token overflow

/**
 * Process uploaded file and extract content for AI
 */
export async function processFile(file: File): Promise<ProcessedFile> {
    const fileName = file.name
    const fileType = file.type
    const fileSize = file.size

    let extractedContent = ''
    let contentType: 'text' | 'image' | 'document' = 'document'

    // Process based on file type
    if (fileType.startsWith('text/') || fileType === 'application/json') {
        contentType = 'text'
        extractedContent = await extractTextContent(file)
    } else if (fileType === 'text/markdown' || fileName.endsWith('.md')) {
        contentType = 'text'
        extractedContent = await extractTextContent(file)
    } else if (fileType === 'text/csv') {
        contentType = 'text'
        extractedContent = await extractCSVContent(file)
    } else if (fileType.startsWith('image/')) {
        contentType = 'image'
        extractedContent = `Image file: ${fileName} (${formatFileSize(fileSize)})`
    } else if (fileType === 'application/pdf') {
        contentType = 'document'
        extractedContent = `PDF document: ${fileName} (${formatFileSize(fileSize)})`
    } else {
        extractedContent = `File: ${fileName} (${formatFileSize(fileSize)})`
    }

    // Truncate if too long
    if (extractedContent.length > MAX_CONTENT_LENGTH) {
        extractedContent = extractedContent.substring(0, MAX_CONTENT_LENGTH) + '\n\n[Content truncated...]'
    }

    return {
        fileName,
        fileType,
        fileSize,
        extractedContent,
        contentType,
    }
}

/**
 * Extract text content from text-based files
 */
async function extractTextContent(file: File): Promise<string> {
    try {
        const text = await file.text()
        return `File: ${file.name}\n\n${text}`
    } catch (error) {
        console.error('Error extracting text:', error)
        return `[Unable to extract content from ${file.name}]`
    }
}

/**
 * Extract and format CSV content
 */
async function extractCSVContent(file: File): Promise<string> {
    try {
        const text = await file.text()
        const lines = text.split('\n').slice(0, 50) // First 50 lines
        
        return `CSV File: ${file.name}\n\n${lines.join('\n')}${
            text.split('\n').length > 50 ? '\n\n[Showing first 50 rows...]' : ''
        }`
    } catch (error) {
        console.error('Error extracting CSV:', error)
        return `[Unable to extract content from ${file.name}]`
    }
}

/**
 * Format file size to human-readable string
 */
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes'
    
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Get file icon based on file type
 */
export function getFileIcon(fileType: string, fileName: string): string {
    if (fileType.startsWith('image/')) return '🖼️'
    if (fileType === 'application/pdf') return '📄'
    if (fileType === 'application/json') return '📊'
    if (fileType === 'text/csv') return '📊'
    if (fileType.startsWith('text/') || fileName.endsWith('.md')) return '📝'
    return '📎'
}

/**
 * Validate file type
 */
export function isValidFileType(fileType: string, fileName: string): boolean {
    const validTypes = [
        'text/plain',
        'text/markdown',
        'text/csv',
        'application/json',
        'application/pdf',
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
    ]
    
    const validExtensions = ['.txt', '.md', '.csv', '.json', '.pdf', '.jpg', '.jpeg', '.png', '.gif', '.webp']
    
    return validTypes.includes(fileType) || validExtensions.some(ext => fileName.toLowerCase().endsWith(ext))
}

/**
 * Format files for AI context
 */
export function formatFilesForAI(files: ProcessedFile[]): string {
    if (files.length === 0) return ''
    
    let context = '\n\n# Attached Files\n'
    context += `The user has attached ${files.length} file(s) to this message:\n\n`
    
    files.forEach((file, index) => {
        context += `## File ${index + 1}: ${file.fileName}\n`
        context += `Type: ${file.contentType}\n`
        context += `Size: ${formatFileSize(file.fileSize)}\n\n`
        
        if (file.extractedContent) {
            context += `Content:\n${file.extractedContent}\n\n`
        }
    })
    
    context += '\nPlease reference these files when providing your response.\n'
    
    return context
}
