// app/api/auth/callback/route.ts

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get("code")

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          async get(name: string) {
            return (await cookieStore.get(name))?.value
          },
          async set(name: string, value: string, options: any) {
            await cookieStore.set({ name, value, ...options })
          },
          async remove(name: string, options: any) {
            await cookieStore.delete({ name, ...options })
          },
        },
      }
    )

    try {
      await supabase.auth.exchangeCodeForSession(code)
    } catch (error) {
      console.error("Error exchanging code for session:", error)
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  // After exchanging, redirect into your app
  return NextResponse.redirect(new URL("/dashboard", request.url))
}
