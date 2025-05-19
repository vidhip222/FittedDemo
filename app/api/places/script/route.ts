import { NextResponse } from "next/server"

export async function GET() {
  try {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: "Google Places API key is not configured" }, { status: 500 })
    }

    // Return the script URL with the API key
    const scriptUrl = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`

    return NextResponse.json({ scriptUrl })
  } catch (error) {
    console.error("Script API error:", error)
    return NextResponse.json({ error: "Failed to generate script URL" }, { status: 500 })
  }
}
