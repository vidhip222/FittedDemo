// app/api/outfits/save/route.ts
import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const { userId, outfit } = await request.json();
    
    const { error } = await supabase
      .from('saved_outfits')
      .upsert({
        user_id: userId,
        outfit_id: outfit.id,
        outfit_data: outfit,
        saved_at: new Date().toISOString()
      });

    if (error) throw error;
    return NextResponse.json({ success: true });

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to save outfit' },
      { status: 500 }
    );
  }
}