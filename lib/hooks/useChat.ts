import { useState } from "react"

interface Message {
  role: "user" | "assistant"
  content: string
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendMessage = async (content: string) => {
    try {
      setIsLoading(true)
      setError(null)

      // Add user message
      const userMessage: Message = { role: "user", content }
      setMessages((prev) => [...prev, userMessage])

      // Get AI response
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const data = await response.json()
      
      // Add assistant message
      const assistantMessage: Message = { role: "assistant", content: data.response }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const clearMessages = () => {
    setMessages([])
    setError(null)
  }

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
  }
} 