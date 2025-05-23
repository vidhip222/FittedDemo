import { useState, useEffect } from "react"

export type StoreType = 
  | "clothing_store"
  | "thrift_store"
  | "boutique"
  | "department_store"
  | "shoe_store"
  | "jewelry_store"
  | "accessories_store"

interface Store {
  id: string
  name: string
  address: string
  type: StoreType
  lat: number
  lon: number
  distance: number // in kilometers
}

interface UseNearbyStoresProps {
  selectedTypes?: StoreType[]
  maxDistance?: number // in kilometers
}

export function useNearbyStores({ selectedTypes, maxDistance }: UseNearbyStoresProps = {}) {
  const [stores, setStores] = useState<Store[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Calculate distance between two points using Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371 // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  useEffect(() => {
    const fetchStores = async () => {
      try {
        setLoading(true)
        setError(null)

        // Get user's location
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject)
        })

        const { latitude, longitude } = position.coords

        // Define store types to search for
        const storeTypes = selectedTypes || [
          "clothing_store",
          "thrift_store",
          "boutique",
          "department_store",
          "shoe_store",
          "jewelry_store",
          "accessories_store"
        ]

        // Fetch stores for each type
        const allStores: Store[] = []
        for (const type of storeTypes) {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?` +
            `q=${type}&` +
            `format=json&` +
            `lat=${latitude}&` +
            `lon=${longitude}&` +
            `radius=5000&` +
            `limit=10`
          )

          if (!response.ok) {
            throw new Error("Failed to fetch stores")
          }

          const data = await response.json()
          
          // Transform and add distance
          const transformedStores = data.map((item: any) => ({
            id: item.place_id,
            name: item.display_name.split(",")[0],
            address: item.display_name,
            type: type as StoreType,
            lat: parseFloat(item.lat),
            lon: parseFloat(item.lon),
            distance: calculateDistance(
              latitude,
              longitude,
              parseFloat(item.lat),
              parseFloat(item.lon)
            )
          }))

          allStores.push(...transformedStores)
        }

        // Filter by distance if specified
        const filteredStores = maxDistance
          ? allStores.filter(store => store.distance <= maxDistance)
          : allStores

        // Sort by distance
        const sortedStores = filteredStores.sort((a, b) => a.distance - b.distance)

        setStores(sortedStores)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch nearby stores")
      } finally {
        setLoading(false)
      }
    }

    fetchStores()
  }, [selectedTypes, maxDistance])

  return { stores, loading, error }
} 