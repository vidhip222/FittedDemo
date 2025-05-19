import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import { getCurrentUserId } from "@/lib/auth"

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
  try {
    const userId = await getCurrentUserId()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const color = searchParams.get("color")

    // Build the query
    let sql = "SELECT * FROM closet_items WHERE user_id = $1"
    const params = [userId]

    if (category) {
      sql += " AND category = $2"
      params.push(category)
    }

    if (color) {
      sql += category ? " AND color = $3" : " AND color = $2"
      params.push(color)
    }

    sql += " ORDER BY created_at DESC"

    // Execute the query
    const result = await query(sql, params)

    return NextResponse.json({ items: result.rows })
  } catch (error) {
    console.error("Error fetching closet items:", error)
    return NextResponse.json({ error: "Failed to fetch closet items" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const userId = await getCurrentUserId()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.category) {
      return NextResponse.json({ error: "Name and category are required" }, { status: 400 })
    }

    // In a real app, you would handle image upload to a storage service
    // and get back a URL. For now, we'll use a placeholder
    const imageUrl = `/placeholder.svg?height=200&width=200&text=${encodeURIComponent(body.name)}`

    // Insert the item into the database
    const result = await query(
      `INSERT INTO closet_items 
       (user_id, name, category, color, brand, size, description, image_url) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING id, name, category, color, brand, size, description, image_url, created_at`,
      [
        userId,
        body.name,
        body.category,
        body.color || null,
        body.brand || null,
        body.size || null,
        body.description || null,
        imageUrl,
      ],
    )

    // Log the action for admin tracking
    await query("INSERT INTO admin_logs (user_id, action_type, details) VALUES ($1, $2, $3)", [
      userId,
      "closet_item_added",
      `User added ${body.name} to their closet`,
    ])

    return NextResponse.json({
      success: true,
      message: "Item added to closet",
      item: result.rows[0],
    })
  } catch (error) {
    console.error("Error adding closet item:", error)
    return NextResponse.json({ error: "Failed to add item to closet" }, { status: 500 })
  }
}
