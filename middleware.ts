// middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { createMiddlewareSupabaseClient } from '@supabase/auth-helpers-nextjs'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareSupabaseClient({ req, res })
  // this will parse the cookie (if any) and hydrate the auth state
  await supabase.auth.getSession()
  return res
}

export const config = {
  // secure all routes under /dashboard and /settings (and anything else you protect)
  matcher: ['/dashboard/:path*', '/settings', '/auth/callback'],
}
