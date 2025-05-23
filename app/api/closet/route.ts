import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: Request) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const color = searchParams.get("color")
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Build the query
    let query = supabase
      .from("closet_items")
      .select("*")
      .eq("user_id", userId)

    // Add filters if provided
    if (category) {
      query = query.eq("category", category)
    }

    if (color) {
      query = query.eq("color", color)
    }

    // Execute the query
    const { data: items, error } = await query

    if (error) {
      throw error
    }

    return NextResponse.json({ items })
  } catch (error) {
    console.error("Error fetching closet items:", error)
    return NextResponse.json({ error: "Failed to fetch closet items" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const item = await request.json()
    const { data, error } = await supabase
      .from("closet_items")
      .insert([item])
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error("Error adding closet item:", error)
    return NextResponse.json({ error: "Failed to add closet item" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const item = await request.json()
    const { data, error } = await supabase
      .from("closet_items")
      .update(item)
      .eq("id", item.id)
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error updating closet item:", error)
    return NextResponse.json({ error: "Failed to update closet item" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Item ID is required" }, { status: 400 })
    }

    const { error } = await supabase
      .from("closet_items")
      .delete()
      .eq("id", id)

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting closet item:", error)
    return NextResponse.json({ error: "Failed to delete closet item" }, { status: 500 })
  }
}
