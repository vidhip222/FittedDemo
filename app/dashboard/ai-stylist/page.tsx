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
import Link from "next/link"

export default function AIStylistPage() {
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

  // Mock closet data
  const closetItems = [
    { id: 1, name: "White T-Shirt", category: "tops", color: "white" },
    { id: 2, name: "Blue Jeans", category: "bottoms", color: "blue" },
    { id: 3, name: "Black Dress", category: "dresses", color: "black" },
    { id: 4, name: "Leather Jacket", category: "outerwear", color: "brown" },
    { id: 5, name: "Sneakers", category: "shoes", color: "white" },
    { id: 6, name: "Gold Necklace", category: "accessories", color: "gold" },
  ]

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

    // Simulate AI processing
    setTimeout(() => {
      generateAIResponse(userMessage)
    }, 1500)
  }

  const generateAIResponse = (userMessage: string) => {
    const lowerCaseMessage = userMessage.toLowerCase()
    let aiResponse: Message

    // Generate different responses based on user input
    if (lowerCaseMessage.includes("wear") && lowerCaseMessage.includes("today")) {
      aiResponse = {
        id: Date.now().toString(),
        role: "assistant",
        content: "Based on your closet and today's weather, I recommend this outfit:",
        timestamp: new Date(),
        outfitSuggestion: {
          name: "Casual Day Out",
          items: [
            { id: 1, name: "White T-Shirt", category: "tops" },
            { id: 2, name: "Blue Jeans", category: "bottoms" },
            { id: 4, name: "Leather Jacket", category: "outerwear" },
            { id: 5, name: "Sneakers", category: "shoes" },
          ],
          image: "/placeholder.svg?height=300&width=400&text=Outfit+Suggestion",
        },
      }
    } else if (
      lowerCaseMessage.includes("date") ||
      (lowerCaseMessage.includes("wear") && lowerCaseMessage.includes("dinner"))
    ) {
      aiResponse = {
        id: Date.now().toString(),
        role: "assistant",
        content: "For a date night, I recommend this elegant outfit:",
        timestamp: new Date(),
        outfitSuggestion: {
          name: "Date Night",
          items: [
            { id: 3, name: "Black Dress", category: "dresses" },
            { id: 6, name: "Gold Necklace", category: "accessories" },
          ],
          image: "/placeholder.svg?height=300&width=400&text=Date+Night+Outfit",
        },
        storeRecommendations: [
          {
            id: 1,
            name: "Heels",
            price: 89.99,
            store: "Aldo",
            distance: "3.0 miles",
            image: "/placeholder.svg?height=100&width=100&text=Heels",
          },
        ],
      }
    } else if (
      lowerCaseMessage.includes("work") ||
      lowerCaseMessage.includes("office") ||
      lowerCaseMessage.includes("professional")
    ) {
      aiResponse = {
        id: Date.now().toString(),
        role: "assistant",
        content:
          "I notice you don't have many professional items in your closet. Here are some recommendations from nearby stores that would work well for the office:",
        timestamp: new Date(),
        storeRecommendations: [
          {
            id: 1,
            name: "White Button-Up Shirt",
            price: 45.99,
            store: "Banana Republic",
            distance: "1.8 miles",
            image: "/placeholder.svg?height=100&width=100&text=Button+Up",
          },
          {
            id: 2,
            name: "Black Slacks",
            price: 65.0,
            store: "J.Crew",
            distance: "2.2 miles",
            image: "/placeholder.svg?height=100&width=100&text=Slacks",
          },
          {
            id: 3,
            name: "Blazer",
            price: 120.0,
            store: "Zara",
            distance: "2.5 miles",
            image: "/placeholder.svg?height=100&width=100&text=Blazer",
          },
        ],
      }
    } else if (lowerCaseMessage.includes("thrift") || lowerCaseMessage.includes("budget")) {
      aiResponse = {
        id: Date.now().toString(),
        role: "assistant",
        content: "Here are some affordable options from thrift stores and budget-friendly retailers near you:",
        timestamp: new Date(),
        storeRecommendations: [
          {
            id: 1,
            name: "Vintage Denim Jacket",
            price: 25.0,
            store: "Local Thrift",
            distance: "3.1 miles",
            image: "/placeholder.svg?height=100&width=100&text=Vintage+Jacket",
            tags: ["thrift", "sustainable"],
          },
          {
            id: 2,
            name: "Graphic Tee",
            price: 12.99,
            store: "H&M",
            distance: "1.5 miles",
            image: "/placeholder.svg?height=100&width=100&text=Graphic+Tee",
            tags: ["budget"],
          },
          {
            id: 3,
            name: "Corduroy Pants",
            price: 18.5,
            store: "Goodwill",
            distance: "2.8 miles",
            image: "/placeholder.svg?height=100&width=100&text=Corduroy+Pants",
            tags: ["thrift", "sustainable"],
          },
        ],
      }
    } else if (lowerCaseMessage.includes("small business") || lowerCaseMessage.includes("local")) {
      aiResponse = {
        id: Date.now().toString(),
        role: "assistant",
        content: "Supporting local businesses is great! Here are some items from small boutiques in your area:",
        timestamp: new Date(),
        storeRecommendations: [
          {
            id: 1,
            name: "Handmade Scarf",
            price: 35.0,
            store: "Artisan Collective",
            distance: "1.2 miles",
            image: "/placeholder.svg?height=100&width=100&text=Handmade+Scarf",
            tags: ["small business", "handmade"],
          },
          {
            id: 2,
            name: "Locally Designed Earrings",
            price: 28.0,
            store: "Neighborhood Gems",
            distance: "0.8 miles",
            image: "/placeholder.svg?height=100&width=100&text=Earrings",
            tags: ["small business", "handmade"],
          },
        ],
      }
    } else {
      aiResponse = {
        id: Date.now().toString(),
        role: "assistant",
        content:
          "I can help you find outfit ideas from your closet or recommend new pieces from nearby stores. Try asking me what to wear today, what would look good for a date night, or if I can recommend some work clothes.",
        timestamp: new Date(),
      }
    }

    setMessages((prev) => [...prev, aiResponse])
    setIsLoading(false)
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
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">AI Stylist</h2>
          <p className="text-muted-foreground">Chat with your personal AI fashion assistant</p>
        </div>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden">
        <Tabs defaultValue="chat" className="flex-1 flex flex-col">
          <div className="px-4 pt-4 border-b">
            <TabsList>
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="closet">My Closet</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="chat" className="flex-1 flex flex-col m-0 data-[state=active]:flex-1">
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
                      {message.outfitSuggestion && (
                        <div className="mt-2 rounded-lg overflow-hidden border">
                          <div className="aspect-[4/3] relative">
                            <Image
                              src={message.outfitSuggestion.image || "/placeholder.svg"}
                              alt={message.outfitSuggestion.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="p-3">
                            <h3 className="font-medium">{message.outfitSuggestion.name}</h3>
                            <div className="mt-2 flex flex-wrap gap-1">
                              {message.outfitSuggestion.items.map((item) => (
                                <Badge key={item.id} variant="secondary">
                                  {item.name}
                                </Badge>
                              ))}
                            </div>
                            <div className="mt-3 flex justify-between">
                              <Button variant="outline" size="sm">
                                Save Outfit
                              </Button>
                              <Button size="sm">Try On</Button>
                            </div>
                          </div>
                        </div>
                      )}
                      {message.storeRecommendations && (
                        <div className="mt-2 space-y-2">
                          <h3 className="text-sm font-medium">Recommended Items:</h3>
                          <div className="flex gap-2 overflow-x-auto pb-2">
                            {message.storeRecommendations.map((item) => (
                              <div key={item.id} className="min-w-[200px] rounded-lg overflow-hidden border">
                                <div className="aspect-square relative">
                                  <Image
                                    src={item.image || "/placeholder.svg"}
                                    alt={item.name}
                                    fill
                                    className="object-cover"
                                  />
                                  {item.tags && (
                                    <div className="absolute top-2 right-2">
                                      {item.tags.includes("thrift") && (
                                        <Badge className="bg-green-500 text-white mb-1">Thrift</Badge>
                                      )}
                                      {item.tags.includes("small business") && (
                                        <Badge className="bg-blue-500 text-white mb-1">Small Business</Badge>
                                      )}
                                    </div>
                                  )}
                                </div>
                                <div className="p-3">
                                  <h4 className="font-medium">{item.name}</h4>
                                  <p className="text-sm font-bold">${item.price.toFixed(2)}</p>
                                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                                    <MapPin className="h-3 w-3 mr-1" />
                                    {item.store} ({item.distance})
                                  </div>
                                  <Button size="sm" className="w-full mt-2">
                                    Get It
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
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

          <TabsContent value="closet" className="m-0 p-4 data-[state=active]:flex-1">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {closetItems.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="aspect-square relative">
                      <Image
                        src={`/placeholder.svg?height=200&width=200&text=${item.name}`}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-2">
                      <h3 className="font-medium text-sm">{item.name}</h3>
                      <p className="text-xs text-muted-foreground capitalize">{item.category}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-4 flex justify-center">
              <Link href="/dashboard/closet">
                <Button>View Full Closet</Button>
              </Link>
            </div>
          </TabsContent>

          <TabsContent value="preferences" className="m-0 p-4 data-[state=active]:flex-1">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Style Preferences</h3>
                <div className="flex flex-wrap gap-2">
                  <StylePreferenceChip text="Casual" selected />
                  <StylePreferenceChip text="Formal" />
                  <StylePreferenceChip text="Streetwear" selected />
                  <StylePreferenceChip text="Vintage" />
                  <StylePreferenceChip text="Minimalist" selected />
                  <StylePreferenceChip text="Bohemian" />
                  <StylePreferenceChip text="Athletic" />
                  <StylePreferenceChip text="Preppy" />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Shopping Preferences</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Price Range</span>
                    <Badge>$$-$$$</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Prefer Sustainable Brands</span>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Yes
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Include Thrift/Second-hand</span>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Yes
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Prefer Local Businesses</span>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Yes
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex justify-center">
                <Link href="/dashboard/settings">
                  <Button>Edit Preferences</Button>
                </Link>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}

// Helper components
function SuggestionChip({ text, onClick }: { text: string; onClick: (text: string) => void }) {
  return (
    <button className="text-xs bg-muted hover:bg-muted/80 px-3 py-1 rounded-full" onClick={() => onClick(text)}>
      {text}
    </button>
  )
}

function StylePreferenceChip({ text, selected = false }: { text: string; selected?: boolean }) {
  return (
    <div
      className={`px-3 py-1 rounded-full text-sm ${
        selected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
      }`}
    >
      {text}
    </div>
  )
}

// Types
interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  outfitSuggestion?: {
    name: string
    items: Array<{
      id: number
      name: string
      category: string
    }>
    image: string
  }
  storeRecommendations?: Array<{
    id: number
    name: string
    price: number
    store: string
    distance: string
    image: string
    tags?: string[]
  }>
}
