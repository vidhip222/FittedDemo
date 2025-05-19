import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Protect this route with service role key (never exposed to client)
const supabase = createClient(
  process.env.SUPABASE_NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || "MOCK_SERVICE_ROLE_KEY_FOR_PREVIEW", // Fallback for preview
  {
    auth: {
      persistSession: false,
    },
  },
)

const ADMIN_EMAIL = "mailtovidhipatra@email.com"

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization")
    const token = authHeader?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // In preview mode, return mock data
    if (process.env.NODE_ENV === "development" || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({
        users: 128,
        chats: 1024,
        uploads: 512,
      })
    }

    const { data: userInfo, error: userError } = await supabase.auth.getUser(token)
    if (userError || userInfo.user?.email !== ADMIN_EMAIL) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const [users, chats, uploads] = await Promise.all([
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase.from("interactions").select("id", { count: "exact", head: true }),
      supabase.from("uploads").select("id", { count: "exact", head: true }),
    ])

    return NextResponse.json({
      users: users.count || 0,
      chats: chats.count || 0,
      uploads: uploads.count || 0,
    })
  } catch (error) {
    console.error("Error in admin metrics API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
