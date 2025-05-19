import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const lat = searchParams.get("lat")
    const lng = searchParams.get("lng")
    const radius = searchParams.get("radius") || "10" // Default 10 miles

    if (!lat || !lng) {
      return NextResponse.json({ error: "Latitude and longitude are required" }, { status: 400 })
    }

    // In a real app, you would query a database or external API for stores
    // For this demo, we'll return mock data based on the provided coordinates

    // Log the search for admin tracking
    await query("INSERT INTO admin_logs (action_type, details) VALUES ($1, $2)", [
      "store_search",
      `Search at lat: ${lat}, lng: ${lng}, radius: ${radius}`,
    ])

    // Generate some stores based on the coordinates
    const stores = generateNearbyStores(Number.parseFloat(lat), Number.parseFloat(lng), Number.parseFloat(radius))

    return NextResponse.json({ stores })
  } catch (error) {
    console.error("Store search error:", error)
    return NextResponse.json({ error: "Failed to search for stores" }, { status: 500 })
  }
}

// Helper function to generate mock stores based on coordinates
function generateNearbyStores(lat: number, lng: number, radius: number) {
  const storeTypes = ["Boutique", "Department Store", "Thrift Store", "Mall", "Outlet"]
  const storeNames = [
    "Fashion Forward",
    "Urban Threads",
    "Vintage Vibes",
    "Style Hub",
    "Trendy Treasures",
    "Chic Boutique",
    "Fashion Fusion",
    "Elegant Ensembles",
    "Dapper Designs",
    "Couture Corner",
    "Thrift Thrills",
    "Eco Elegance",
  ]

  // Generate random number of stores (5-15)
  const numStores = Math.floor(Math.random() * 10) + 5
  const stores = []

  for (let i = 0; i < numStores; i++) {
    // Generate random coordinates within the radius
    const distance = (Math.random() * radius).toFixed(1)
    const angle = Math.random() * 2 * Math.PI

    // Convert distance to lat/lng offset (simplified)
    const latOffset = (Number.parseFloat(distance) / 69) * Math.cos(angle)
    const lngOffset = (Number.parseFloat(distance) / 69) * Math.sin(angle)

    const storeLat = lat + latOffset
    const storeLng = lng + lngOffset

    const storeType = storeTypes[Math.floor(Math.random() * storeTypes.length)]
    const storeName = storeNames[Math.floor(Math.random() * storeNames.length)]

    stores.push({
      id: i + 1,
      name: storeName,
      type: storeType,
      lat: storeLat,
      lng: storeLng,
      distance: distance,
      address: `${Math.floor(Math.random() * 1000) + 100} Main St, Anytown, USA`,
      rating: (Math.random() * 3 + 2).toFixed(1), // 2.0-5.0 rating
      priceRange: "$".repeat(Math.floor(Math.random() * 3) + 1), // $-$$$
    })
  }

  // Sort by distance
  return stores.sort((a, b) => Number.parseFloat(a.distance) - Number.parseFloat(b.distance))
}
