// チャットメッセージの型定義
export interface ChatMessage {
    role: 'user' | 'assistant'
    content: string
}

// API レスポンスの型定義
export interface ApiResponse {
    message: string
    error?: string
} 