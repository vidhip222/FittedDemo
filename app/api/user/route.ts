import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"

// Helper function to get the current user ID from the token
async function getCurrentUserId() {
  const token = cookies().get("auth_token")?.value

  if (!token) {
    return null
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret")
    return (decoded as any).id
  } catch (error) {
    return null
  }
}

export async function GET() {
  try {
    const userId = await getCurrentUserId()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const result = await query(
      "SELECT id, name, email, phone, bio, address, city, state, zip, location, created_at FROM users WHERE id = $1",
      [userId],
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ user: result.rows[0] })
  } catch (error) {
    console.error("Get user error:", error)
    return NextResponse.json({ error: "Failed to get user data" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const userId = await getCurrentUserId()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, phone, bio, address, city, state, zip, location } = await request.json()

    // Update user data
    await query(
      `UPDATE users 
       SET name = $1, phone = $2, bio = $3, address = $4, city = $5, state = $6, zip = $7, location = $8
       WHERE id = $9`,
      [name, phone, bio, address, city, state, zip, location, userId],
    )

    // Log the update for admin tracking
    await query("INSERT INTO admin_logs (user_id, action_type, details) VALUES ($1, $2, $3)", [
      userId,
      "profile_update",
      "User updated their profile",
    ])

    return NextResponse.json({ message: "User updated successfully" })
  } catch (error) {
    console.error("Update user error:", error)
    return NextResponse.json({ error: "Failed to update user data" }, { status: 500 })
  }
}
