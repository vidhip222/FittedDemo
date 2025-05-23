// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

// Validate environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error(`
    Missing Supabase environment variables!
    Check your .env.local file for:
    NEXT_PUBLIC_SUPABASE_URL
    NEXT_PUBLIC_SUPABASE_ANON_KEY
  `)
}

// Create and export the Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
  global: {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    }
  }
})

// Helper types for better intellisense
export type SupabaseClient = typeof supabase
export type SupabaseSession = Awaited<ReturnType<typeof supabase.auth.getSession>>