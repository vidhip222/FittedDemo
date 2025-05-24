// app/api/auth/[...supabase]/route.ts

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from "next/server"

export const GET = async (req: Request) => {
  const supabase = createRouteHandlerClient({ cookies })
  return NextResponse.json({})
}

export const POST = async (req: NextRequest) => {
  const supabase = createRouteHandlerClient({ cookies })
  return NextResponse.json({})
}
