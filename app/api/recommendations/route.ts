import { NextResponse } from "next/server"

const SERPAPI_KEY = process.env.SERPAPI_KEY
const SERPAPI_URL = "https://serpapi.com/search.json"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("query") || "trending fashion items"
    const type = searchParams.get("type") || "clothing"

    // Construct the search query
    const searchQuery = `${query} ${type} shopping online`

    const response = await fetch(
      `${SERPAPI_URL}?engine=google&q=${encodeURIComponent(
        searchQuery
      )}&api_key=${SERPAPI_KEY}&tbm=shop`
    )

    if (!response.ok) {
      throw new Error("Failed to fetch recommendations")
    }

    const data = await response.json()

    // Extract relevant product information
    const products = data.shopping_results?.map((item: any) => ({
      title: item.title,
      price: item.price,
      link: item.link,
      source: item.source,
      thumbnail: item.thumbnail,
      rating: item.rating,
      reviews: item.reviews,
      shipping: item.shipping,
    })) || []

    return NextResponse.json({ products })
  } catch (error) {
    console.error("Recommendations error:", error)
    return NextResponse.json(
      { error: "Failed to fetch recommendations" },
      { status: 500 }
    )
  }
} 