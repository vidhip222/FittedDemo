// app/api/ai-stylist/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { TextServiceClient } from '@google-ai/generativelanguage'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const ai = new TextServiceClient({
  apiKey: process.env.GOOGLE_AI_API_KEY!,
})

async function getPinterestStylePins(userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('pinterest_style_pins')
    .select('description')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(5)
  return error || !data ? [] : data.map((r: any) => r.description)
}

async function getUserCloset(userId: string) {
  const { data, error } = await supabase
    .from('closet_items')
    .select('name,category,color,style')
    .eq('user_id', userId)
  return error || !data ? [] : data
}

async function getChatHistory(userId: string) {
  const { data, error } = await supabase
    .from('chat_history')
    .select('message')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(10)
  return error || !data ? [] : data.map((r: any) => r.message)
}

export async function POST(req: NextRequest) {
  try {
    const { message, userId, occasion, style, budget, location } = await req.json()

    // 1) Ask for vibe/mood if missing
    if (!message?.trim()) {
      return NextResponse.json(
        { followUp: 'What vibe or mood are you looking for today? (e.g., casual weekend, business meeting)' },
        { status: 200 }
      )
    }

    // 2) Ask for occasion if missing
    if (!occasion) {
      return NextResponse.json(
        { followUp: 'Great—what’s the occasion or setting for your date night?' },
        { status: 200 }
      )
    }

    // 3) Gather context in parallel
    const [pins, closet, history, prefRow] = await Promise.all([
      userId ? getPinterestStylePins(userId) : Promise.resolve([]),
      userId ? getUserCloset(userId) : Promise.resolve([]),
      userId ? getChatHistory(userId) : Promise.resolve([]),
      userId
        ? supabase
            .from('user_preferences')
            .select('style, colorPreferences, budget, shoppingPreferences')
            .eq('user_id', userId)
            .single()
            .then(({ data }) => data || {})
        : Promise.resolve({}),
    ])

    // 4) Build the prompt
    const prompt = `
You are a professional fashion stylist.
User Vibe: "${message}"
Occasion: ${occasion}

Style Inspiration:
${pins.length ? pins.map(p => `- ${p}`).join('\n') : '- none'}

Existing Wardrobe:
${closet.length ? closet.map(i => `- ${i.name}`).join('\n') : '- none'}

Past Recommendations:
${history.length ? history.map(m => `- ${m}`).join('\n') : '- none'}

User Preferences:
${JSON.stringify({ style, budget, ...prefRow }, null, 2)}

Generate 3 distinct outfits. For each include:
1. Full description
2. Color palette
3. Key pieces with price range & store/link
4. Why it matches the vibe
5. Which existing items are used
6. Occasion suitability
7. Confidence score (1–10)

Return valid JSON: 
{
  "outfits": [
    {
      "description": "...",
      "color_palette": ["...", "..."],
      "pieces": [
        { "name":"...", "type":"...", "price_range":"...", "store":"...", "url":"..." }
      ],
      "vibe_match":"...",
      "existing_items_used":["..."],
      "occasion":"...",
      "confidence":0
    },
    … 
  ]
}`

    // 5) Call the AI
    const [aiResponse] = await ai.generateText({
      model: 'models/text-bison-001',
      prompt: { text: prompt },
      temperature: 0.7,
      maxOutputTokens: 1024,
    })

    const raw = aiResponse.candidates?.[0]?.output ?? ''

    // 6) JSON parsing logic (currently commented out)
/*
    let json: any
    try {
      json = JSON.parse(raw)
    } catch {
      return NextResponse.json(
        { followUp: 'I’m having trouble parsing the outfit suggestions—could you rephrase your request or add more details?' },
        { status: 200 }
      )
    }
    if (!Array.isArray(json.outfits) || json.outfits.length === 0) {
      return NextResponse.json(
        { followUp: 'I couldn’t come up with any outfits—could you share more specifics? (e.g., weather, preferred colors, or must-have pieces)' },
        { status: 200 }
      )
    }
    return NextResponse.json(json)
*/

    // 7) For now, return the raw AI text
    return new NextResponse(raw, {
      status: 200,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    })
  } catch (err: any) {
    console.error('Outfit generation error:', err)
    const msg = err.message || ''
    if (msg.includes('NOT_FOUND')) {
      return NextResponse.json(
        { followUp: 'I’m having trouble finding styles—could you add any more details?' },
        { status: 200 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to generate outfits', details: msg },
      { status: 500 }
    )
  }
}
