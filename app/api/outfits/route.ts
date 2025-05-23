// app/api/outfits/route.ts
import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();
    
    // Verify user exists
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Invalid user' },
        { status: 401 }
      );
    }

    // Get user's closet items
    const { data: closetItems } = await supabase
      .from('closet_items')
      .select('id, name, type, image_url, color, brand')
      .eq('user_id', userId);

    // Generate AI recommendations
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `Create 3 complete outfits using these items: ${JSON.stringify(closetItems)}. 
    For each outfit include: 
    - Top with image
    - Bottom with image  
    - Shoes with image
    - Optional accessories
    Format response as JSON with:
    {
      outfits: [{
        id: string,
        name: string, 
        pieces: [{
          type: string,
          name: string,
          image: string,
          price?: string,
          store?: string,
          link?: string,
          isFromCloset: boolean
        }]
      }]
    }`;

    const result = await model.generateContent(prompt);
    const { outfits } = JSON.parse(result.response.text());

    return NextResponse.json({ outfits });

  } catch (error) {
    console.error('Outfit generation failed:', error);
    return NextResponse.json(
      { error: 'Failed to generate outfits', details: String(error) },
      { status: 500 }
    );
  }
}