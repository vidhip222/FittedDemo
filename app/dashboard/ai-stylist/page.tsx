"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AIStylistChat } from "@/components/ai-stylist-chat"

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
  const scrollAreaRef = useRef<HTMLDivElement>(null)

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
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
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
    <div className="container py-6 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">AI Stylist</h1>
        <p className="text-muted-foreground">
          Chat with your personal AI stylist for outfit recommendations and fashion advice.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
        <Card className="md:order-1">
          <CardHeader>
            <CardTitle>Chat with Your Stylist</CardTitle>
            <CardDescription>Ask about outfit ideas, style advice, or shopping recommendations.</CardDescription>
          </CardHeader>
          <CardContent>
            <AIStylistChat />
          </CardContent>
        </Card>

        <div className="space-y-6 md:order-2">
          <Card>
            <CardHeader>
              <CardTitle>Style Preferences</CardTitle>
              <CardDescription>Your AI stylist uses these preferences to personalize recommendations.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Favorite Styles</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {["Casual", "Minimalist", "Streetwear"].map((style) => (
                      <div key={style} className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm">
                        {style}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium">Color Palette</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {["Black", "White", "Blue", "Gray"].map((color) => (
                      <div key={color} className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm">
                        {color}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium">Budget</h3>
                  <div className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm inline-block mt-2">
                    Medium ($50-$150)
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Conversation Starters</CardTitle>
              <CardDescription>Try asking your AI stylist these questions.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  "What should I wear to a casual dinner?",
                  "Help me create an outfit for a job interview.",
                  "What are the trending styles this season?",
                  "Can you recommend sustainable fashion brands?",
                  "How can I style a white t-shirt?",
                ].map((question, index) => (
                  <div key={index} className="p-2 rounded-md hover:bg-muted cursor-pointer">
                    {question}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
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
