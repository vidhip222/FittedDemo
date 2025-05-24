// lib/hooks/useNearbyStores.ts

import { useState, useEffect } from "react"

// All the valid Google‐Places store types you might request
export type StoreType =
  | "clothing_store"
  | "thrift_store"
  | "makeup_store"
  | "boutique"
  | "shoe_store"
  | "shopping_mall"
  | "department_store"
  | "jewelry_store"
  | "accessories_store"
  | "vintage_store"

const VALID_STORE_TYPES: StoreType[] = [
  "clothing_store",
  "thrift_store",
  "makeup_store",
  "boutique",
  "shoe_store",
  "shopping_mall",
  "department_store",
  "jewelry_store",
  "accessories_store",
  "vintage_store",
]

interface Store {
  id: string
  name: string
  address: string
  lat: number
  lon: number
  rating?: number
  photos?: { url: string; width: number; height: number }[]
  details?: any        // raw Google Places “details” object
}

interface UseNearbyStoresProps {
  selectedTypes?: StoreType[]
  maxDistance?: number // in kilometers
}

export function useNearbyStores({
  selectedTypes,
  maxDistance,
}: UseNearbyStoresProps = {}) {
  const [stores, setStores] = useState<Store[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    async function fetchStores() {
      setLoading(true)
      setError(null)

      try {
        // 1) Get user’s current position
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject)
        })
        const { latitude, longitude } = position.coords

        // 2) Build query params
        const typesParam = (selectedTypes ?? VALID_STORE_TYPES).join(",")
        const radiusParam = ((maxDistance ?? 5) * 1000).toString() // default 5 km

        // 3) Fetch from your Next.js API
        const res = await fetch(
          `/api/stores/nearby?lat=${latitude}&lng=${longitude}&radius=${radiusParam}&type=${typesParam}`,
          { signal: controller.signal }
        )
        if (!res.ok) throw new Error(`HTTP ${res.status}`)

        // 4) **NEW**: The API now returns a raw array of store objects
        const storesArray: any[] = await res.json()

        // 5) Transform into our local Store interface
        const transformed: Store[] = storesArray.map((s) => ({
          id: s.id,
          name: s.name,
          address: s.address,
          lat: s.location.lat,
          lon: s.location.lng,
          rating: s.details?.rating ?? s.rating,
          photos: s.photos ?? [],
          details: s.details ?? {},
        }))

        setStores(transformed)
      } catch (err: any) {
        if (controller.signal.aborted) return
        console.error("Error fetching stores:", err)
        setError(err.message || "Failed to fetch nearby stores")
      } finally {
        setLoading(false)
      }
    }

    fetchStores()
    return () => {
      controller.abort()
    }
  }, [
    // re-fetch whenever the selected types or maxDistance change
    (selectedTypes ?? []).join(","),
    maxDistance,
  ])

  return { stores, loading, error }
}
