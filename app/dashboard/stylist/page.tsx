"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Trash2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useChat } from "@/lib/hooks/useChat"
import { cn } from "@/lib/utils"

export default function StylistPage() {
  const [input, setInput] = useState("")
  const { messages, isLoading, error, sendMessage, clearMessages } = useChat()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    await sendMessage(input)
    setInput("")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">AI Stylist</h2>
          <p className="text-muted-foreground">Get personalized fashion advice from your AI stylist</p>
        </div>
        <Button variant="outline" onClick={clearMessages}>
          <Trash2 className="mr-2 h-4 w-4" />
          Clear Chat
        </Button>
      </div>

      <Card className="flex flex-col h-[600px]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Chat with your AI Stylist
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "flex w-max max-w-[80%] rounded-lg px-4 py-2",
                  message.role === "user"
                    ? "ml-auto bg-primary text-primary-foreground"
                    : "bg-muted"
                )}
              >
                {message.content}
              </div>
            ))}
            {isLoading && (
              <div className="flex w-max max-w-[80%] rounded-lg px-4 py-2 bg-muted">
                Thinking...
              </div>
            )}
            {error && (
              <div className="text-destructive text-sm">
                Error: {error}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              placeholder="Ask your stylist anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 