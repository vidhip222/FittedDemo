import { NextResponse } from "next/server"

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY
const GOOGLE_PLACES_BASE_URL = "https://maps.googleapis.com/maps/api/place"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const lat = searchParams.get("lat")
    const lng = searchParams.get("lng")
    const radius = searchParams.get("radius") || "5000" // Default 5km radius
    const type = searchParams.get("type") || "clothing_store" // Default to clothing stores

    if (!lat || !lng) {
      return NextResponse.json(
        { error: "Latitude and longitude are required" },
        { status: 400 }
      )
    }

    if (!GOOGLE_PLACES_API_KEY) {
      return NextResponse.json(
        { error: "Google Places API key is not configured" },
        { status: 500 }
      )
    }

    // First, search for nearby stores
    const searchUrl = `${GOOGLE_PLACES_BASE_URL}/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${type}&key=${GOOGLE_PLACES_API_KEY}`
    
    const searchResponse = await fetch(searchUrl)
    const searchData = await searchResponse.json()

    if (searchData.status !== "OK") {
      return NextResponse.json(
        { error: "Failed to fetch nearby stores", details: searchData.status },
        { status: 500 }
      )
    }

    // Get detailed information for each store
    const stores = await Promise.all(
      searchData.results.map(async (place: any) => {
        // Get place details
        const detailsUrl = `${GOOGLE_PLACES_BASE_URL}/details/json?place_id=${place.place_id}&fields=name,formatted_address,formatted_phone_number,opening_hours,rating,website,photos&key=${GOOGLE_PLACES_API_KEY}`
        const detailsResponse = await fetch(detailsUrl)
        const detailsData = await detailsResponse.json()

        return {
          id: place.place_id,
          name: place.name,
          address: place.vicinity,
          location: place.geometry.location,
          rating: place.rating,
          photos: place.photos?.map((photo: any) => ({
            url: `${GOOGLE_PLACES_BASE_URL}/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${GOOGLE_PLACES_API_KEY}`,
            width: photo.width,
            height: photo.height
          })) || [],
          details: detailsData.result || {}
        }
      })
    )

    return NextResponse.json({ stores })
  } catch (error) {
    console.error("Error fetching nearby stores:", error)
    return NextResponse.json(
      { error: "Failed to fetch nearby stores" },
      { status: 500 }
    )
  }
} 