import { useState, useEffect, useCallback } from "react"

interface Product {
  title: string
  price: string
  link: string
  source: string
  thumbnail: string
  rating?: number
  reviews?: number
  shipping?: string
}

interface UseRecommendationsProps {
  initialQuery?: string
  initialType?: string
}

export function useRecommendations({
  initialQuery = "trending fashion items",
  initialType = "clothing",
}: UseRecommendationsProps = {}) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState(initialQuery)
  const [type, setType] = useState(initialType)
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout>()

  const fetchRecommendations = useCallback(async (searchQuery: string, searchType: string) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(
        `/api/recommendations?query=${encodeURIComponent(
          searchQuery
        )}&type=${encodeURIComponent(searchType)}`
      )

      if (!response.ok) {
        throw new Error("Failed to fetch recommendations")
      }

      const data = await response.json()
      setProducts(data.products)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch recommendations")
    } finally {
      setLoading(false)
    }
  }, [])

  // Initial fetch
  useEffect(() => {
    fetchRecommendations(initialQuery, initialType)
  }, []) // Empty dependency array for initial fetch only

  // Debounced search
  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }

    const timeout = setTimeout(() => {
      fetchRecommendations(query, type)
    }, 500) // 500ms debounce

    setSearchTimeout(timeout)

    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout)
      }
    }
  }, [query, type, fetchRecommendations])

  return {
    products,
    loading,
    error,
    query,
    setQuery,
    type,
    setType,
    refetch: () => fetchRecommendations(query, type),
  }
} 