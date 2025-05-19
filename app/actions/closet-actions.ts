"use server"

import { revalidatePath } from "next/cache"
import { query } from "@/lib/db"
import { getCurrentUserId } from "@/lib/auth"

export async function addClosetItem(formData: FormData) {
  try {
    const userId = await getCurrentUserId()

    if (!userId) {
      return { error: "You must be logged in to add items to your closet" }
    }

    const name = formData.get("name") as string
    const category = formData.get("category") as string
    const color = formData.get("color") as string
    const brand = formData.get("brand") as string
    const size = formData.get("size") as string
    const description = formData.get("description") as string

    // In a real app, you would handle image upload to a storage service
    // and get back a URL. For now, we'll use a placeholder
    const imageUrl = `/placeholder.svg?height=200&width=200&text=${encodeURIComponent(name)}`

    // Validate required fields
    if (!name || !category) {
      return { error: "Name and category are required" }
    }

    // Insert the item into the database
    const result = await query(
      `INSERT INTO closet_items 
       (user_id, name, category, color, brand, size, description, image_url) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING id`,
      [userId, name, category, color, brand, size, description, imageUrl],
    )

    // Log the action for admin tracking
    await query("INSERT INTO admin_logs (user_id, action_type, details) VALUES ($1, $2, $3)", [
      userId,
      "closet_item_added",
      `User added ${name} to their closet`,
    ])

    // Revalidate the closet page to show the new item
    revalidatePath("/dashboard/closet")

    return {
      success: true,
      message: "Item added to closet successfully",
      id: result.rows[0].id,
    }
  } catch (error) {
    console.error("Error adding closet item:", error)
    return { error: "Failed to add item to closet" }
  }
}

export async function getClosetItems() {
  try {
    const userId = await getCurrentUserId()

    if (!userId) {
      return { error: "You must be logged in to view your closet" }
    }

    const result = await query(
      `SELECT * FROM closet_items 
       WHERE user_id = $1 
       ORDER BY created_at DESC`,
      [userId],
    )

    return { items: result.rows }
  } catch (error) {
    console.error("Error fetching closet items:", error)
    return { error: "Failed to fetch closet items" }
  }
}

export async function getClosetItemsByCategory(category: string) {
  try {
    const userId = await getCurrentUserId()

    if (!userId) {
      return { error: "You must be logged in to view your closet" }
    }

    const result = await query(
      `SELECT * FROM closet_items 
       WHERE user_id = $1 AND category = $2
       ORDER BY created_at DESC`,
      [userId, category],
    )

    return { items: result.rows }
  } catch (error) {
    console.error("Error fetching closet items by category:", error)
    return { error: "Failed to fetch closet items" }
  }
}
