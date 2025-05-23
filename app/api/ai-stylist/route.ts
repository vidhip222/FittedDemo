import { NextResponse } from "next/server"
import { createClient } from '@supabase/supabase-js'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!)

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function searchTrendingItems(query: string) {
  const response = await fetch(
    `https://serpapi.com/search.json?` +
    `engine=google_shopping&` +
    `q=${encodeURIComponent(query)}&` +
    `api_key=${process.env.SERPAPI_KEY}`
  )
  return response.json()
}

async function getNearbyStores(lat: number, lng: number, radius: number) {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/place/nearbysearch/json?` +
    `location=${lat},${lng}&` +
    `radius=${radius}&` +
    `type=clothing_store&` +
    `key=${process.env.GOOGLE_PLACES_API_KEY}`
  )
  return response.json()
}

async function getPinterestStylePins(userId: string) {
  const { data, error } = await supabase
    .from('pinterest_style_pins')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(5);
  
  if (error) {
    console.error('Error fetching Pinterest pins:', error);
    return [];
  }
  return data;
}

async function getUserCloset(userId: string) {
  const { data, error } = await supabase
    .from('closet_items')
    .select('*')
    .eq('user_id', userId);
  
  if (error) {
    console.error('Error fetching closet items:', error);
    return [];
  }
  return data;
}

async function getChatHistory(userId: string) {
  const { data, error } = await supabase
    .from('chat_history')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(10);
  
  if (error) {
    console.error('Error fetching chat history:', error);
    return [];
  }
  return data;
}

export async function POST(request: Request) {
  try {
    console.log('Starting outfit generation');
    
    // Validate environment variables
    if (!process.env.GOOGLE_AI_API_KEY) {
      throw new Error('Google AI API key is missing');
    }

    const requestData = await request.json();
    console.log('Received request data:', requestData);

    // Validate required fields
    if (!requestData.message) {
      return NextResponse.json(
        { error: 'Vibe/mood description is required' },
        { status: 400 }
      );
    }

    // Get all contextual data
    const [pinterestPins, closetItems, chatHistory, userPreferences] = await Promise.all([
      requestData.userId ? getPinterestStylePins(requestData.userId) : Promise.resolve([]),
      requestData.userId ? getUserCloset(requestData.userId) : Promise.resolve([]),
      requestData.userId ? getChatHistory(requestData.userId) : Promise.resolve([]),
      requestData.userId ? supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', requestData.userId)
        .single()
        .then(({ data }) => data || {}) : Promise.resolve({})
    ]);

    // Enhanced outfit generation prompt
    const prompt = `As a professional fashion stylist, create 3 complete outfits based on:
    
    User Vibe: "${requestData.message}"
    ${requestData.occasion ? `Occasion: ${requestData.occasion}` : ''}
    
    Style Inspiration:
    ${pinterestPins.length > 0 ? 
      `Pinterest Pins: ${JSON.stringify(pinterestPins.map(pin => pin.description))}` : 
      'No Pinterest inspiration available'}
    
    Existing Wardrobe:
    ${closetItems.length > 0 ? 
      `Closet Items: ${JSON.stringify(closetItems.map(item => item.name))}` : 
      'No closet items analyzed'}
    
    Past Recommendations:
    ${chatHistory.length > 0 ? 
      `Previous Interactions: ${JSON.stringify(chatHistory.map(chat => chat.message))}` : 
      'No chat history available'}
    
    User Preferences:
    ${JSON.stringify({
      style: requestData.style || 'casual',
      budget: requestData.budget || 100,
      ...userPreferences
    })}

    For each outfit, provide:
    1. Complete head-to-toe look description
    2. Color palette
    3. Key pieces with price ranges
    4. Where to buy (prioritize user's favorite stores)
    5. How it matches the requested vibe
    6. How it incorporates their existing items
    7. Occasion suitability
    8. Confidence score (1-10)

    Format as JSON with this structure:
    {
      "outfits": [{
        "description": "string",
        "color_palette": ["string"],
        "pieces": [{
          "name": "string",
          "type": "string",
          "price_range": "string",
          "store": "string"
        }],
        "vibe_match": "string",
        "existing_items_used": ["string"],
        "occasion": "string",
        "confidence": number
      }]
    }`;

    console.log('Generated prompt:', prompt);

    // Get AI response
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('Raw AI response:', text);

    // Parse and validate response
    let outfits;
    try {
      outfits = JSON.parse(text).outfits;
      if (!Array.isArray(outfits) || outfits.length === 0) {
        throw new Error('No valid outfits generated');
      }
    } catch (e) {
      console.error('Failed to parse AI response:', e);
      throw new Error('Invalid outfit response format');
    }

    return NextResponse.json({ outfits });

  } catch (error) {
    console.error('Outfit generation error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate outfits',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

// Helper function to calculate distance between two points
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371 // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return (R * c).toFixed(1) + " km"
}
