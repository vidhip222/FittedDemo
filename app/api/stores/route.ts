import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const radius = searchParams.get("radius") || "5000";
  const type = searchParams.get("type") || "clothing_store";

  if (!lat || !lng) {
    return NextResponse.json(
      { error: "Location coordinates are required" },
      { status: 400 }
    );
  }

  const key = process.env.GOOGLE_PLACES_API_KEY!;
  const url =
    `https://maps.googleapis.com/maps/api/place/nearbysearch/json` +
    `?location=${lat},${lng}` +
    `&radius=${radius}` +
    `&type=${type}` +
    `&key=${key}`;

  const response = await fetch(url);
  if (!response.ok) {
    console.error("Places API error:", await response.text());
    return NextResponse.json(
      { error: "Failed to fetch stores from Google Places API" },
      { status: 500 }
    );
  }

  const data = await response.json();

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
    matches: 0,
    featured: false,
    location: {
      lat: place.geometry.location.lat,
      lng: place.geometry.location.lng,
    },
    photos:
      place.photos?.map((photo: any) => ({
        url: `https://maps.googleapis.com/maps/api/place/photo` +
             `?maxwidth=400&photoreference=${photo.photo_reference}` +
             `&key=${key}`,
        width: photo.width,
        height: photo.height,
      })) || [],
  }));

  // ← direct array response
  return NextResponse.json(stores);
}

// Haversine
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): string {
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const km = R * c;
  return `${(km * 0.621371).toFixed(1)} miles`;
}
function deg2rad(deg: number): number {
  return (deg * Math.PI) / 180;
}
