import { NextResponse } from "next/server";

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY!;
const BASE_URL = "https://maps.googleapis.com/maps/api/place";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const radius = searchParams.get("radius") || "5000";
  // allow comma-separated list of types
  const typesParam = searchParams.get("type") || "clothing_store";
  const types = typesParam.split(",");

  if (!lat || !lng) {
    return NextResponse.json(
      { error: "Latitude and longitude are required" },
      { status: 400 }
    );
  }
  if (!GOOGLE_PLACES_API_KEY) {
    return NextResponse.json(
      { error: "Google Places API key is not configured" },
      { status: 500 }
    );
  }

  // fetch nearby for each type
  const batches = await Promise.all(
    types.map(async (type) => {
      const url = `${BASE_URL}/nearbysearch/json?location=${lat},${lng}` +
                  `&radius=${radius}&type=${type}&key=${GOOGLE_PLACES_API_KEY}`;
      const res = await fetch(url);
      const json = await res.json();
      return json.results || [];
    })
  );

  // flatten + dedupe by place_id
  const merged = batches.flat();
  const unique = Array.from(
    new Map(merged.map((p: any) => [p.place_id, p])).values()
  );

  // fetch details for each place
  const stores = await Promise.all(
    unique.map(async (place: any) => {
      const detailsUrl =
        `${BASE_URL}/details/json?place_id=${place.place_id}` +
        `&fields=name,formatted_address,formatted_phone_number,opening_hours,rating,website,photos` +
        `&key=${GOOGLE_PLACES_API_KEY}`;
      const detailsRes = await fetch(detailsUrl);
      const detailsJson = await detailsRes.json();

      return {
        id: place.place_id,
        name: place.name,
        address: place.vicinity,
        location: place.geometry.location,
        rating: place.rating,
        photos:
          place.photos?.map((p: any) => ({
            url: `${BASE_URL}/photo?maxwidth=400&photoreference=${p.photo_reference}` +
                 `&key=${GOOGLE_PLACES_API_KEY}`,
            width: p.width,
            height: p.height,
          })) || [],
        details: detailsJson.result || {},
      };
    })
  );

  // ← direct array response
  return NextResponse.json(stores);
}
