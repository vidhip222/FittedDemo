import { NextResponse } from "next/server"

// Mock data for stores
const stores = [
  {
    id: 1,
    name: "Urban Outfitters",
    distance: "0.5 miles",
    rating: 4.2,
    category: "clothing",
    address: "123 Main St, San Francisco, CA",
    matches: 12,
    featured: true,
    location: {
      lat: 37.7749,
      lng: -122.4194,
    },
  },
  {
    id: 2,
    name: "Madewell",
    distance: "1.2 miles",
    rating: 4.5,
    category: "clothing",
    address: "456 Market St, San Francisco, CA",
    matches: 8,
    featured: false,
    location: {
      lat: 37.7899,
      lng: -122.4014,
    },
  },
  {
    id: 3,
    name: "Zara",
    distance: "2.5 miles",
    rating: 4.0,
    category: "clothing",
    address: "789 Mission St, San Francisco, CA",
    matches: 15,
    featured: true,
    location: {
      lat: 37.7847,
      lng: -122.4079,
    },
  },
  {
    id: 4,
    name: "Local Thrift",
    distance: "3.1 miles",
    rating: 4.7,
    category: "thrift",
    address: "101 Valencia St, San Francisco, CA",
    matches: 20,
    featured: false,
    location: {
      lat: 37.7694,
      lng: -122.4219,
    },
  },
  {
    id: 5,
    name: "Sephora",
    distance: "0.8 miles",
    rating: 4.3,
    category: "beauty",
    address: "222 Powell St, San Francisco, CA",
    matches: 5,
    featured: false,
    location: {
      lat: 37.7873,
      lng: -122.4082,
    },
  },
  {
    id: 6,
    name: "H&M",
    distance: "1.5 miles",
    rating: 3.9,
    category: "clothing",
    address: "333 Geary St, San Francisco, CA",
    matches: 10,
    featured: false,
    location: {
      lat: 37.7874,
      lng: -122.4077,
    },
  },
]

export async function GET(request: Request) {
  // Get query parameters
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category")
  const featured = searchParams.get("featured")
  const maxDistance = searchParams.get("maxDistance")

  // Filter stores based on query parameters
  let filteredStores = [...stores]

  if (category) {
    filteredStores = filteredStores.filter((store) => store.category === category)
  }

  if (featured === "true") {
    filteredStores = filteredStores.filter((store) => store.featured)
  }

  if (maxDistance) {
    const maxDistanceValue = Number.parseFloat(maxDistance)
    filteredStores = filteredStores.filter((store) => {
      const storeDistance = Number.parseFloat(store.distance.split(" ")[0])
      return storeDistance <= maxDistanceValue
    })
  }

  return NextResponse.json({ stores: filteredStores })
}
