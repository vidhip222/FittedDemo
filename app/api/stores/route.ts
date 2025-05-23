import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const lat = searchParams.get("lat")
    const lng = searchParams.get("lng")
    const radius = searchParams.get("radius") || "5000" // Default 5km radius
    const type = searchParams.get("type") || "clothing_store"

    if (!lat || !lng) {
      return NextResponse.json({ error: "Location coordinates are required" }, { status: 400 })
    }

    // Call Google Places API
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${type}&key=${process.env.GOOGLE_PLACES_API_KEY}`
    )

    if (!response.ok) {
      throw new Error("Failed to fetch stores from Google Places API")
    }

    const data = await response.json()

    // Transform Google Places data to our format
    const stores = data.results.map((place: any) => ({
      id: place.place_id,
      name: place.name,
      distance: calculateDistance(
        parseFloat(lat),
        parseFloat(lng),
        place.geometry.location.lat,
        place.geometry.location.lng
      ),
      rating: place.rating || null,
      category: type,
      address: place.vicinity,
      matches: 0, // This will be calculated based on user preferences
      featured: false, // This will be determined by business logic
      location: {
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng,
      },
      photos: place.photos?.map((photo: any) => ({
        url: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${process.env.GOOGLE_PLACES_API_KEY}`,
        width: photo.width,
        height: photo.height,
      })) || [],
    }))

    return NextResponse.json(stores)
  } catch (error) {
    console.error("Error fetching stores:", error)
    return NextResponse.json({ error: "Failed to fetch stores" }, { status: 500 })
  }
}

// Helper function to calculate distance between two points
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): string {
  const R = 6371 // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1)
  const dLon = deg2rad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const d = R * c // Distance in km
  const miles = d * 0.621371 // Convert to miles
  return `${miles.toFixed(1)} miles`
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180)
}
