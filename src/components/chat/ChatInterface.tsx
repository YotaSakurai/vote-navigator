'use client'

import { useState, useRef, useEffect } from 'react'
import { ChatMessage } from '@/lib/types'
import ReactMarkdown from 'react-markdown'
import type { Components } from 'react-markdown'

interface ChatInterfaceProps {
    initialQuestion?: string | null
}

export default function ChatInterface({ initialQuestion }: ChatInterfaceProps) {
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const initialQuestionSent = useRef(false)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    useEffect(() => {
        if (initialQuestion && !initialQuestionSent.current) {
            initialQuestionSent.current = true
            handleSubmit(undefined, initialQuestion)
        }
    }, [initialQuestion])

    const handleSubmit = async (e?: React.FormEvent, questionText?: string) => {
        e?.preventDefault()
        const messageText = questionText || input
        if (!messageText.trim() || isLoading) return

        const userMessage: ChatMessage = {
            role: 'user',
            content: messageText.trim()
        }

        setMessages(prev => [...prev, userMessage])
        setInput('')
        setIsLoading(true)
        setError(null)

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: userMessage.content }),
            })

            const data = await response.json()

            if (!response.ok) {
                let errorMessage = 'APIリクエストに失敗しました'
                if (response.status === 429) {
                    errorMessage = 'アクセスが集中しています。しばらく待ってから再度お試しください。'
                } else if (data.error) {
                    errorMessage = data.error
                }
                throw new Error(errorMessage)
            }

            const assistantMessage: ChatMessage = {
                role: 'assistant',
                content: data.message
            }

            setMessages(prev => [...prev, assistantMessage])
        } catch (error) {
            console.error('Error:', error)
            setError(error instanceof Error ? error.message : 'エラーが発生しました。しばらく待ってから再度お試しください。')
        } finally {
            setIsLoading(false)
        }
    }

    const markdownComponents: Components = {
        a: ({ ...props }) => (
            <a
                {...props}
                className="text-blue-600 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
            />
        ),
        ul: ({ ...props }) => (
            <ul {...props} className="list-disc pl-4 mt-2" />
        ),
        ol: ({ ...props }) => (
            <ol {...props} className="list-decimal pl-4 mt-2" />
        ),
    }

    return (
        <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6 mb-4 min-h-[400px] max-h-[600px] overflow-y-auto">
                {messages.length === 0 && (
                    <div className="text-center text-gray-500 my-8">
                        <p className="mb-4">👋 こんにちは！</p>
                        <p className="mb-2">選挙や政治について、気になることを質問してください。</p>
                        <p className="text-sm">
                            例：
                            <button
                                onClick={() => setInput('選挙に行く意味はありますか？')}
                                className="text-blue-500 hover:underline mx-2"
                            >
                                選挙に行く意味はありますか？
                            </button>
                        </p>
                    </div>
                )}
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`mb-6 ${message.role === 'user' ? 'flex justify-end' : 'flex justify-start'}`}
                    >
                        <div
                            className={`max-w-[80%] rounded-lg ${message.role === 'user'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 text-gray-800'
                                } p-4`}
                        >
                            {message.role === 'assistant' ? (
                                <div className="prose prose-sm max-w-none">
                                    <ReactMarkdown components={markdownComponents}>
                                        {message.content}
                                    </ReactMarkdown>
                                </div>
                            ) : (
                                <div>{message.content}</div>
                            )}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex items-center justify-center text-gray-500 my-4">
                        <div className="animate-pulse">回答を生成中...</div>
                    </div>
                )}
                {error && (
                    <div className="text-center text-red-500 p-3 bg-red-50 rounded-lg mt-4">
                        {error}
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="選挙について質問してみましょう"
                    className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                    disabled={isLoading}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault()
                            handleSubmit(e)
                        }
                    }}
                />
                <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition-colors duration-200"
                >
                    送信
                </button>
            </form>
        </div>
    )
} 