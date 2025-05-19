import { NextResponse } from "next/server"
import { getOpenAI } from "@/lib/openai"

// Mock data for AI stylist responses
const outfitSuggestions = [
  {
    id: 1,
    name: "Casual Day Out",
    items: [
      { id: 1, name: "White T-Shirt", category: "tops" },
      { id: 2, name: "Blue Jeans", category: "bottoms" },
      { id: 4, name: "Leather Jacket", category: "outerwear" },
      { id: 5, name: "Sneakers", category: "shoes" },
    ],
    image: "/placeholder.svg?height=300&width=400&text=Casual+Day+Out",
  },
  {
    id: 2,
    name: "Date Night",
    items: [
      { id: 3, name: "Black Dress", category: "dresses" },
      { id: 6, name: "Gold Necklace", category: "accessories" },
    ],
    image: "/placeholder.svg?height=300&width=400&text=Date+Night",
  },
  {
    id: 3,
    name: "Work Meeting",
    items: [
      { id: 7, name: "White Button-Up", category: "tops" },
      { id: 8, name: "Black Slacks", category: "bottoms" },
      { id: 9, name: "Blazer", category: "outerwear" },
    ],
    image: "/placeholder.svg?height=300&width=400&text=Work+Meeting",
  },
]

const storeRecommendations = {
  thrift: [
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
      name: "Corduroy Pants",
      price: 18.5,
      store: "Goodwill",
      distance: "2.8 miles",
      image: "/placeholder.svg?height=100&width=100&text=Corduroy+Pants",
      tags: ["thrift", "sustainable"],
    },
  ],
  budget: [
    {
      id: 1,
      name: "Graphic Tee",
      price: 12.99,
      store: "H&M",
      distance: "1.5 miles",
      image: "/placeholder.svg?height=100&width=100&text=Graphic+Tee",
      tags: ["budget"],
    },
    {
      id: 2,
      name: "Basic Hoodie",
      price: 24.99,
      store: "Uniqlo",
      distance: "2.0 miles",
      image: "/placeholder.svg?height=100&width=100&text=Hoodie",
      tags: ["budget"],
    },
  ],
  smallBusiness: [
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
  work: [
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

export async function POST(request: Request) {
  try {
    const openai = getOpenAI()

    if (!openai) {
      return NextResponse.json({ error: "OpenAI client not initialized" }, { status: 500 })
    }

    const body = await request.json()
    const { message, preferences, closetItems } = body

    // Create a system message that defines the AI stylist's behavior
    const systemMessage = `You are an AI fashion stylist named Fitted. 
    You provide personalized fashion advice, outfit recommendations, and shopping suggestions.
    ${preferences ? `Consider these user preferences: ${JSON.stringify(preferences)}` : ""}
    ${closetItems ? `The user has these items in their closet: ${JSON.stringify(closetItems)}` : ""}
    Be friendly, professional, and knowledgeable about current fashion trends.
    When recommending outfits, be specific about items, colors, and how to style them.
    If asked about where to buy items, suggest both online and local stores when appropriate.`

    // Generate a response using OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: message },
      ],
      max_tokens: 500,
    })

    const aiResponse = completion.choices[0].message.content

    // Format the response
    const response = {
      id: Date.now().toString(),
      role: "assistant",
      content: aiResponse,
      timestamp: new Date(),
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("AI Stylist error:", error)
    return NextResponse.json({ error: "Failed to process message" }, { status: 500 })
  }
}
