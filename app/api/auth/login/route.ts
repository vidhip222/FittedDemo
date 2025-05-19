import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    // Always succeed with a mock user
    const mockUser = {
      id: 1,
      name: "Demo User",
      email: "demo@example.com",
    }

    // Set a dummy cookie
    cookies().set({
      name: "auth_token",
      value: "dummy_token_for_demo",
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return NextResponse.json({
      message: "Login successful",
      user: mockUser,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Failed to login" }, { status: 500 })
  }
}
