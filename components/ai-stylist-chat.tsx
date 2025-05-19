"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Send, Sparkles, ShoppingBag } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  outfitSuggestion?: any
  storeRecommendations?: any[]
}

export function AIStylistChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hi there! I'm your AI stylist. How can I help with your fashion needs today?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/ai-stylist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input,
          preferences: {
            style: "casual",
            colors: ["blue", "black", "white"],
            budget: "medium",
          },
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response from AI stylist")
      }

      const data = await response.json()
      setMessages((prev) => [...prev, data])
    } catch (error) {
      console.error("AI Stylist error:", error)
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-[600px] max-h-[80vh]">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`flex gap-3 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : ""}`}>
              <Avatar className="h-8 w-8">
                {message.role === "assistant" ? (
                  <>
                    <AvatarImage src="/placeholder.svg?height=32&width=32&text=AI" />
                    <AvatarFallback>
                      <Sparkles className="h-4 w-4" />
                    </AvatarFallback>
                  </>
                ) : (
                  <>
                    <AvatarImage src="/placeholder.svg?height=32&width=32&text=You" />
                    <AvatarFallback>You</AvatarFallback>
                  </>
                )}
              </Avatar>
              <div>
                <Card className={`${message.role === "assistant" ? "bg-muted" : "bg-primary text-primary-foreground"}`}>
                  <CardContent className="p-3">
                    <p>{message.content}</p>
                  </CardContent>
                </Card>

                {message.outfitSuggestion && (
                  <Card className="mt-2 overflow-hidden">
                    <CardContent className="p-3">
                      <h4 className="font-medium">{message.outfitSuggestion.name}</h4>
                      <div className="aspect-video relative mt-2 rounded-md overflow-hidden">
                        <img
                          src={message.outfitSuggestion.image || "/placeholder.svg"}
                          alt={message.outfitSuggestion.name}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="mt-2">
                        <h5 className="text-sm font-medium">Items:</h5>
                        <ul className="text-sm">
                          {message.outfitSuggestion.items.map((item: any) => (
                            <li key={item.id}>{item.name}</li>
                          ))}
                        </ul>
                      </div>
                      <Button size="sm" className="mt-2">
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        Shop This Look
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {message.storeRecommendations && message.storeRecommendations.length > 0 && (
                  <div className="mt-2 grid gap-2">
                    <h4 className="font-medium">Recommended Items:</h4>
                    {message.storeRecommendations.map((item: any) => (
                      <Card key={item.id} className="overflow-hidden">
                        <CardContent className="p-3">
                          <div className="flex gap-3">
                            <div className="h-16 w-16 rounded-md overflow-hidden">
                              <img
                                src={item.image || "/placeholder.svg"}
                                alt={item.name}
                                className="object-cover w-full h-full"
                              />
                            </div>
                            <div className="flex-1">
                              <h5 className="font-medium">{item.name}</h5>
                              <p className="text-sm">
                                ${item.price.toFixed(2)} - {item.store}
                              </p>
                              <p className="text-xs text-muted-foreground">{item.distance}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t p-4">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            placeholder="Ask about outfits, style advice, or shopping recommendations..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            {isLoading ? "Thinking..." : <Send className="h-4 w-4" />}
          </Button>
        </form>
      </div>
    </div>
  )
}
