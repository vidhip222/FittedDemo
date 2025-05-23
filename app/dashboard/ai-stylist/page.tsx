"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Mic, MicOff, Send, ImageIcon, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import Image from "next/image"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  recommendations?: Array<{
    name: string
    description: string
    price: number
    store: string
    category: string
    style: string
    reasoning: string
    matches_with: string[]
    trending: boolean
    distance: string
    storeLocation: { lat: number; lng: number } | null
    storeRating: number | null
    storePhotos: Array<{ url: string; width: number; height: number }>
  }>
}

interface UserPreferences {
  styleVibes: string[]
  colorPreferences: string[]
  budget: number
  shoppingPreferences: {
    sustainable: boolean
    local: boolean
    thrift: boolean
  }
}

export default function AIStylistPage() {
  const supabase = createClientComponentClient()
  const [user, setUser] = useState<any>(null)
  const [preferences, setPreferences] = useState<UserPreferences | null>(null)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hi there! I'm your AI Stylist. How can I help you today?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Ignore hydration mismatch warnings for fdprocessedid (caused by browser extensions)
    const originalError = console.error;
    console.error = (...args) => {
      if (/hydration mismatch|fdprocessedid/i.test(args[0])) return;
      originalError(...args);
    };

    return () => {
      console.error = originalError; // Restore original console.error
    };
  }, []);

  // Fetch user and preferences
  useEffect(() => {
    const fetchUserAndPreferences = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        // Fetch user preferences
        const { data: preferences } = await supabase
          .from('user_preferences')
          .select('*')
          .eq('user_id', user.id)
          .single()
        if (preferences) {
          setPreferences(preferences)
        }
      }
    }
    fetchUserAndPreferences()
  }, [supabase])

  // Scroll to bottom of messages
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!input.trim() && !isRecording) return

    const userMessage = isRecording ? "What should I wear today?" : input
    const newUserMessage = {
      id: Date.now().toString(),
      role: "user" as const,
      content: userMessage,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, newUserMessage])
    setInput("")
    setIsLoading(true)
    setIsRecording(false)

    try {
      console.log('Sending to AI:', {
        message: userMessage,
        userId: user?.id,
        preferences: preferences?.styleVibes || [],
        style: preferences?.styleVibes[0] || "casual",
        budget: preferences?.budget || 100
      });

      const response = await fetch("/api/ai-stylist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          userId: user?.id,
          preferences: preferences?.styleVibes || [],
          style: preferences?.styleVibes[0] || "casual",
          budget: preferences?.budget || 100,
          location: { lat: 0, lng: 0 }
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('AI API Raw Error:', errorText);
        throw new Error(`API error ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('AI Response:', data);
      
      const aiResponse: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: "Here are my recommendations based on your request:",
        timestamp: new Date(),
        recommendations: data.recommendations
      }

      setMessages((prev) => [...prev, aiResponse])
    } catch (error) {
      console.error('Full Error:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: "I'm sorry, I encountered an error while processing your request. Please try again.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const toggleRecording = () => {
    if (isRecording) {
      // Stop recording and process
      setIsRecording(false)
      handleSendMessage()
    } else {
      // Start recording
      setIsRecording(true)
      // In a real app, this would activate the device microphone
      // For this demo, we'll simulate voice input
      setInput("What should I wear today?")
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">AI Stylist</h2>
          <p className="text-muted-foreground">Chat with your personal AI fashion assistant</p>
        </div>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden">
        <Tabs defaultValue="chat" className="flex-1 flex flex-col h-full">
          <div className="px-4 pt-4 border-b">
            <TabsList>
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="closet">My Closet</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="chat" className="flex-1 flex flex-col h-full">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} gap-2`}
                  >
                    {message.role === "assistant" && (
                      <Avatar>
                        <AvatarImage src="/placeholder.svg?height=40&width=40&text=AI" alt="AI Stylist" />
                        <AvatarFallback>AI</AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`flex flex-col max-w-[80%] ${message.role === "user" ? "items-end" : "items-start"}`}
                    >
                      <div
                        className={`rounded-lg px-4 py-2 ${
                          message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                        }`}
                      >
                        <p>{message.content}</p>
                      </div>

                      {message.recommendations && (
                        <div className="mt-4 space-y-4">
                          {message.recommendations.map((item, index) => (
                            <div key={index} className="rounded-lg overflow-hidden border">
                              <div className="p-4">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h3 className="font-medium">{item.name}</h3>
                                    <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                                  </div>
                                  <Badge variant="secondary">${item.price.toFixed(2)}</Badge>
                                </div>
                                
                                <div className="mt-2 flex flex-wrap gap-1">
                                  <Badge variant="outline">{item.category}</Badge>
                                  <Badge variant="outline">{item.style}</Badge>
                                  {item.trending && <Badge variant="secondary">Trending</Badge>}
                                </div>

                                <div className="mt-3 flex items-center text-sm text-muted-foreground">
                                  <MapPin className="h-4 w-4 mr-1" />
                                  {item.store} ({item.distance})
                                  {item.storeRating && (
                                    <span className="ml-2">★ {item.storeRating.toFixed(1)}</span>
                                  )}
                                </div>

                                <p className="mt-2 text-sm text-muted-foreground">{item.reasoning}</p>

                                {item.matches_with.length > 0 && (
                                  <div className="mt-2">
                                    <p className="text-sm font-medium">Matches with your:</p>
                                    <div className="mt-1 flex flex-wrap gap-1">
                                      {item.matches_with.map((matchId) => (
                                        <Badge key={matchId} variant="secondary">
                                          {matchId}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                <div className="mt-3 flex justify-between">
                                  <Button variant="outline" size="sm">
                                    Save to Wishlist
                                  </Button>
                                  <Button size="sm">
                                    View in Store
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      <span className="text-xs text-muted-foreground mt-1">{formatTime(message.timestamp)}</span>
                    </div>
                    {message.role === "user" && (
                      <Avatar>
                        <AvatarImage src="/placeholder-user.jpg" alt="User" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start gap-2">
                    <Avatar>
                      <AvatarImage src="/placeholder.svg?height=40&width=40&text=AI" alt="AI Stylist" />
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                    <div className="rounded-lg bg-muted px-4 py-2 text-foreground">
                      <div className="flex items-center gap-1">
                        <div className="h-2 w-2 rounded-full bg-current animate-bounce" />
                        <div className="h-2 w-2 rounded-full bg-current animate-bounce [animation-delay:0.2s]" />
                        <div className="h-2 w-2 rounded-full bg-current animate-bounce [animation-delay:0.4s]" />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <div className="p-4 border-t">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className={isRecording ? "bg-red-100 text-red-500" : ""}
                  onClick={toggleRecording}
                >
                  {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </Button>
                <Button type="button" variant="outline" size="icon">
                  <ImageIcon className="h-5 w-5" />
                </Button>
                <Input
                  ref={inputRef}
                  placeholder={isRecording ? "Listening..." : "Ask your AI stylist..."}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1"
                  disabled={isRecording}
                />
                <Button type="submit" size="icon" disabled={(!input.trim() && !isRecording) || isLoading}>
                  <Send className="h-5 w-5" />
                </Button>
              </form>
              <div className="mt-2 flex flex-wrap gap-1">
                <SuggestionChip text="What should I wear today?" onClick={(text) => setInput(text)} />
                <SuggestionChip text="Find me a date night outfit" onClick={(text) => setInput(text)} />
                <SuggestionChip text="I need work clothes" onClick={(text) => setInput(text)} />
                <SuggestionChip text="Show me thrift store finds" onClick={(text) => setInput(text)} />
                <SuggestionChip text="Recommend small business items" onClick={(text) => setInput(text)} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="closet" className="m-0 p-4 data-[state=active]:flex-1 h-full overflow-y-auto">
            {/* Closet content will be added later */}
          </TabsContent>

          <TabsContent value="preferences" className="m-0 p-4 data-[state=active]:flex-1 h-full overflow-y-auto">
            {/* Preferences content will be added later */}
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}

// Helper components
function SuggestionChip({ text, onClick }: { text: string; onClick: (text: string) => void }) {
  return (
    <button 
      className="text-xs bg-muted hover:bg-muted/80 px-3 py-1 rounded-full" 
      onClick={() => onClick(text)}
      suppressHydrationWarning
    >
      {text}
    </button>
  );
}
