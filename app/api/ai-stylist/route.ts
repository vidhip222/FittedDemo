import { NextResponse } from "next/server"

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
    const body = await request.json()
    const { message, preferences } = body

    // In a real app, this would use AI to generate personalized responses
    // based on the user's message and preferences

    const lowerCaseMessage = message.toLowerCase()
    let response = {
      id: Date.now().toString(),
      role: "assistant",
      content: "I can help you find outfit ideas from your closet or recommend new pieces from nearby stores.",
      timestamp: new Date(),
    }

    // Generate different responses based on user input
    if (lowerCaseMessage.includes("wear") && lowerCaseMessage.includes("today")) {
      response = {
        ...response,
        content: "Based on your closet and today's weather, I recommend this outfit:",
        outfitSuggestion: outfitSuggestions[0],
      }
    } else if (
      lowerCaseMessage.includes("date") ||
      (lowerCaseMessage.includes("wear") && lowerCaseMessage.includes("dinner"))
    ) {
      response = {
        ...response,
        content: "For a date night, I recommend this elegant outfit:",
        outfitSuggestion: outfitSuggestions[1],
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
      response = {
        ...response,
        content:
          "I notice you don't have many professional items in your closet. Here are some recommendations from nearby stores that would work well for the office:",
        storeRecommendations: storeRecommendations.work,
      }
    } else if (lowerCaseMessage.includes("thrift") || lowerCaseMessage.includes("sustainable")) {
      response = {
        ...response,
        content: "Here are some sustainable options from thrift stores near you:",
        storeRecommendations: storeRecommendations.thrift,
      }
    } else if (lowerCaseMessage.includes("budget") || lowerCaseMessage.includes("cheap")) {
      response = {
        ...response,
        content: "Here are some budget-friendly options from retailers near you:",
        storeRecommendations: storeRecommendations.budget,
      }
    } else if (lowerCaseMessage.includes("small business") || lowerCaseMessage.includes("local")) {
      response = {
        ...response,
        content: "Supporting local businesses is great! Here are some items from small boutiques in your area:",
        storeRecommendations: storeRecommendations.smallBusiness,
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    return NextResponse.json({ error: "Failed to process message" }, { status: 500 })
  }
}
