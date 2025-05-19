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

    const result = await query("SELECT preference_type, preference_value FROM style_preferences WHERE user_id = $1", [
      userId,
    ])

    // Transform the rows into a structured preferences object
    const preferences: any = {
      stylePreferences: [],
      colorPreferences: [],
      priceRange: "mid-range",
      sustainableBrands: false,
      localBusinesses: false,
      thriftStores: false,
    }

    result.rows.forEach((row) => {
      if (row.preference_type === "style") {
        preferences.stylePreferences.push(row.preference_value)
      } else if (row.preference_type === "color") {
        preferences.colorPreferences.push(row.preference_value)
      } else if (row.preference_type === "price_range") {
        preferences.priceRange = row.preference_value
      } else if (row.preference_type === "sustainable_brands") {
        preferences.sustainableBrands = row.preference_value === "true"
      } else if (row.preference_type === "local_businesses") {
        preferences.localBusinesses = row.preference_value === "true"
      } else if (row.preference_type === "thrift_stores") {
        preferences.thriftStores = row.preference_value === "true"
      }
    })

    return NextResponse.json({ preferences })
  } catch (error) {
    console.error("Get preferences error:", error)
    return NextResponse.json({ error: "Failed to get user preferences" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const userId = await getCurrentUserId()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { stylePreferences, colorPreferences, priceRange, sustainableBrands, localBusinesses, thriftStores } =
      await request.json()

    // Start a transaction
    const client = await query("BEGIN")

    try {
      // Delete existing preferences
      await query("DELETE FROM style_preferences WHERE user_id = $1", [userId])

      // Insert style preferences
      if (stylePreferences && stylePreferences.length > 0) {
        for (const style of stylePreferences) {
          await query(
            "INSERT INTO style_preferences (user_id, preference_type, preference_value) VALUES ($1, $2, $3)",
            [userId, "style", style],
          )
        }
      }

      // Insert color preferences
      if (colorPreferences && colorPreferences.length > 0) {
        for (const color of colorPreferences) {
          await query(
            "INSERT INTO style_preferences (user_id, preference_type, preference_value) VALUES ($1, $2, $3)",
            [userId, "color", color],
          )
        }
      }

      // Insert other preferences
      await query("INSERT INTO style_preferences (user_id, preference_type, preference_value) VALUES ($1, $2, $3)", [
        userId,
        "price_range",
        priceRange || "mid-range",
      ])

      await query("INSERT INTO style_preferences (user_id, preference_type, preference_value) VALUES ($1, $2, $3)", [
        userId,
        "sustainable_brands",
        sustainableBrands ? "true" : "false",
      ])

      await query("INSERT INTO style_preferences (user_id, preference_type, preference_value) VALUES ($1, $2, $3)", [
        userId,
        "local_businesses",
        localBusinesses ? "true" : "false",
      ])

      await query("INSERT INTO style_preferences (user_id, preference_type, preference_value) VALUES ($1, $2, $3)", [
        userId,
        "thrift_stores",
        thriftStores ? "true" : "false",
      ])

      // Commit the transaction
      await query("COMMIT")

      // Log the update for admin tracking
      await query("INSERT INTO admin_logs (user_id, action_type, details) VALUES ($1, $2, $3)", [
        userId,
        "preferences_update",
        "User updated their style preferences",
      ])

      return NextResponse.json({ message: "Preferences updated successfully" })
    } catch (error) {
      // Rollback the transaction if there's an error
      await query("ROLLBACK")
      throw error
    }
  } catch (error) {
    console.error("Update preferences error:", error)
    return NextResponse.json({ error: "Failed to update user preferences" }, { status: 500 })
  }
}
