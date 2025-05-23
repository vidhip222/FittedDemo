import { useState, useEffect } from "react"

export type StoreType =
  | 'clothing_store'
  | 'thrift_store'
  | 'makeup_store'
  | 'boutique'
  | 'shoe_store'
  | 'shopping_mall'
  | 'department_store'
  | 'jewelry_store'
  | 'accessories_store'
  | 'vintage_store';

const VALID_STORE_TYPES: StoreType[] = [
  'clothing_store',
  'thrift_store',
  'makeup_store',
  'boutique',
  'shoe_store',
  'shopping_mall',
  'department_store',
  'jewelry_store',
  'accessories_store',
  'vintage_store'
];

interface Store {
  id: string
  name: string
  address: string
  type: StoreType
  lat: number
  lon: number
  distance: number // in kilometers
  rating?: number
  photos?: { url: string; width: number; height: number }[]
}

interface UseNearbyStoresProps {
  selectedTypes?: StoreType[]
  maxDistance?: number // in kilometers
}

export function useNearbyStores({ selectedTypes, maxDistance }: UseNearbyStoresProps = {}) {
  const [stores, setStores] = useState<Store[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
        console.log('User location:', { latitude, longitude })

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
        console.log('Searching for store types:', storeTypes)

        // Fetch stores using our Google Places API endpoint
        const response = await fetch(
          `/api/stores/nearby?` +
          `lat=${latitude}&` +
          `lng=${longitude}&` +
          `radius=${maxDistance ? maxDistance * 1000 : 5000}&` +
          `type=${storeTypes.join(",")}`
        )

        if (!response.ok) {
          throw new Error("Failed to fetch stores")
        }

        const data = await response.json()
        console.log('API response:', data)
        
        if (data.error) {
          throw new Error(data.error)
        }

        // Transform the data to match our Store interface
        const transformedStores = data.stores.map((store: any) => ({
          id: store.id,
          name: store.name,
          address: store.address,
          type: store.type as StoreType,
          lat: store.location.lat,
          lon: store.location.lng,
          distance: store.distance,
          rating: store.rating,
          photos: store.photos
        }))
        console.log('Transformed stores:', transformedStores)

        const filteredStores = transformedStores.filter((store: { type: string }): store is Store => 
          VALID_STORE_TYPES.includes(store.type as StoreType)
        )
        console.log('Filtered stores:', filteredStores)

        setStores(filteredStores)
      } catch (err) {
        console.error('Error fetching stores:', err)
        setError(err instanceof Error ? err.message : "Failed to fetch nearby stores")
      } finally {
        setLoading(false)
      }
    }

    fetchStores()
  }, [selectedTypes, maxDistance])

  return { stores, loading, error }
} 