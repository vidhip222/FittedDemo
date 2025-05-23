import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("gifts")
      .select("*")
      .eq("user_id", userId)
      .order("next_delivery", { ascending: true })

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching gifts:", error)
    return NextResponse.json({ error: "Failed to fetch gifts" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const gift = await request.json()
    const { data, error } = await supabase
      .from("gifts")
      .insert([gift])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error("Error creating gift:", error)
    return NextResponse.json({ error: "Failed to create gift" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const gift = await request.json()
    const { data, error } = await supabase
      .from("gifts")
      .update(gift)
      .eq("id", gift.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error updating gift:", error)
    return NextResponse.json({ error: "Failed to update gift" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Gift ID is required" }, { status: 400 })
    }

    const { error } = await supabase
      .from("gifts")
      .delete()
      .eq("id", id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting gift:", error)
    return NextResponse.json({ error: "Failed to delete gift" }, { status: 500 })
  }
}
