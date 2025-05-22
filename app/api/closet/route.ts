import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Mock data for closet items
const closetItems = [
  { id: 1, name: "White T-Shirt", category: "tops", color: "white" },
  { id: 2, name: "Blue Jeans", category: "bottoms", color: "blue" },
  { id: 3, name: "Black Dress", category: "dresses", color: "black" },
  { id: 4, name: "Leather Jacket", category: "outerwear", color: "brown" },
  { id: 5, name: "Sneakers", category: "shoes", color: "white" },
  { id: 6, name: "Gold Necklace", category: "accessories", color: "gold" },
  { id: 7, name: "Striped Shirt", category: "tops", color: "multi" },
  { id: 8, name: "Black Pants", category: "bottoms", color: "black" },
  { id: 9, name: "Denim Jacket", category: "outerwear", color: "blue" },
  { id: 10, name: "Ankle Boots", category: "shoes", color: "black" },
  { id: 11, name: "Floral Dress", category: "dresses", color: "multi" },
  { id: 12, name: "Silver Earrings", category: "accessories", color: "silver" },
]

export async function GET(request: Request) {
  // Get query parameters
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category")
  const color = searchParams.get("color")

  // Filter items based on query parameters
  let filteredItems = [...closetItems]

  if (category) {
    filteredItems = filteredItems.filter((item) => item.category === category)
  }

  if (color) {
    filteredItems = filteredItems.filter((item) => item.color === color)
  }

  return NextResponse.json({ items: filteredItems })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const { data, error } = await supabase.from("closet_items").insert(body).select()
    if (error) throw error
    return NextResponse.json({ success: true, message: "Item added to closet", item: data[0] })
  } catch (error) {
    return NextResponse.json({ error: "Failed to add item to closet" }, { status: 500 })
  }
}
