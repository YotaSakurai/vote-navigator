'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import ChatInterface from '@/components/chat/ChatInterface'

export default function ChatPage() {
    const searchParams = useSearchParams()
    const initialQuestion = searchParams.get('q')

    return (
        <main className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">教えて！選挙のハテナ？</h1>
            <ChatInterface initialQuestion={initialQuestion} />
        </main>
    )
} 