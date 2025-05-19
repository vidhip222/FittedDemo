"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Search, StoreIcon } from "lucide-react"
import { loadGoogleMapsScript, searchNearbyPlaces, geocodeAddress } from "@/lib/places"
import { toast } from "@/components/ui/use-toast"

interface ClothingStore {
  id: string
  name: string
  vicinity: string
  rating?: number
  photos?: any[]
  geometry: {
    location: {
      lat: number
      lng: number
    }
  }
}

export function StoreLocator() {
  const [isLoading, setIsLoading] = useState(true)
  const [stores, setStores] = useState<ClothingStore[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const mapRef = useRef<HTMLDivElement>(null)
  const googleMapRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])

  // Load Google Maps script and initialize map
  useEffect(() => {
    const initMap = async () => {
      try {
        await loadGoogleMapsScript()

        // Get user location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const location = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              }
              setUserLocation(location)

              // Initialize map
              if (mapRef.current && window.google) {
                const map = new window.google.maps.Map(mapRef.current, {
                  center: location,
                  zoom: 13,
                })
                googleMapRef.current = map

                // Add user marker
                new window.google.maps.Marker({
                  position: location,
                  map,
                  icon: {
                    path: window.google.maps.SymbolPath.CIRCLE,
                    scale: 10,
                    fillColor: "#4f46e5",
                    fillOpacity: 1,
                    strokeWeight: 2,
                    strokeColor: "#ffffff",
                  },
                  title: "Your Location",
                })

                // Search for nearby stores
                searchNearbyStores(location)
              }
            },
            (error) => {
              console.error("Geolocation error:", error)
              toast({
                title: "Location Error",
                description: "Unable to get your location. Please enter a location manually.",
                variant: "destructive",
              })
              setIsLoading(false)

              // Use default location (New York City)
              const defaultLocation = { lat: 40.7128, lng: -74.006 }
              setUserLocation(defaultLocation)

              // Initialize map with default location
              if (mapRef.current && window.google) {
                const map = new window.google.maps.Map(mapRef.current, {
                  center: defaultLocation,
                  zoom: 13,
                })
                googleMapRef.current = map
              }
            },
          )
        } else {
          toast({
            title: "Geolocation Not Supported",
            description: "Your browser doesn't support geolocation. Please enter a location manually.",
            variant: "destructive",
          })
          setIsLoading(false)
        }
      } catch (error) {
        console.error("Map initialization error:", error)
        toast({
          title: "Map Error",
          description: "Failed to load the map. Please try again later.",
          variant: "destructive",
        })
        setIsLoading(false)
      }
    }

    initMap()

    return () => {
      // Clean up markers
      if (markersRef.current) {
        markersRef.current.forEach((marker: any) => marker.setMap(null))
        markersRef.current = []
      }
    }
  }, [])

  // Search for nearby clothing stores
  const searchNearbyStores = async (location: { lat: number; lng: number }) => {
    setIsLoading(true)

    try {
      const results = await searchNearbyPlaces(location, 5000, "clothing_store")

      // Format store data
      const formattedStores = results.map((place: any) => ({
        id: place.place_id,
        name: place.name,
        vicinity: place.vicinity,
        rating: place.rating,
        photos: place.photos,
        geometry: place.geometry,
      }))

      setStores(formattedStores)

      // Add markers to map
      if (googleMapRef.current && window.google) {
        // Clear existing markers
        markersRef.current.forEach((marker: any) => marker.setMap(null))
        markersRef.current = []

        // Add new markers
        formattedStores.forEach((store: any) => {
          const marker = new window.google.maps.Marker({
            position: store.geometry.location,
            map: googleMapRef.current,
            title: store.name,
          })

          // Add click listener
          marker.addListener("click", () => {
            if (googleMapRef.current) {
              googleMapRef.current.setCenter(store.geometry.location)
              googleMapRef.current.setZoom(15)

              // Show info window
              const infoWindow = new window.google.maps.InfoWindow({
                content: `
                  <div>
                    <h3 style="font-weight: bold; margin-bottom: 4px;">${store.name}</h3>
                    <p>${store.vicinity}</p>
                    ${store.rating ? `<p>Rating: ${store.rating} ⭐</p>` : ""}
                  </div>
                `,
              })
              infoWindow.open(googleMapRef.current, marker)
            }
          })

          markersRef.current.push(marker)
        })
      }
    } catch (error) {
      console.error("Store search error:", error)
      toast({
        title: "Search Error",
        description: "Failed to find nearby stores. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle search form submission
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!searchQuery.trim()) return

    setIsLoading(true)

    try {
      // Use server-side geocoding
      const geocodeResult = await geocodeAddress(searchQuery)

      if (geocodeResult.status === "OK" && geocodeResult.results && geocodeResult.results.length > 0) {
        const location = {
          lat: geocodeResult.results[0].geometry.location.lat,
          lng: geocodeResult.results[0].geometry.location.lng,
        }

        setUserLocation(location)

        // Update map center
        if (googleMapRef.current) {
          googleMapRef.current.setCenter(location)
          googleMapRef.current.setZoom(13)
        }

        // Search for nearby stores
        searchNearbyStores(location)
      } else {
        toast({
          title: "Location Error",
          description: "Could not find the specified location. Please try a different search.",
          variant: "destructive",
        })
        setIsLoading(false)
      }
    } catch (error) {
      console.error("Search error:", error)
      toast({
        title: "Search Error",
        description: "Failed to search for the location. Please try again.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-[1fr_300px]">
      <div className="order-2 md:order-1">
        <div ref={mapRef} className="h-[500px] rounded-xl border"></div>
      </div>

      <div className="order-1 md:order-2">
        <Card>
          <CardHeader>
            <CardTitle>Find Clothing Stores</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex gap-2 mb-4">
              <Input
                placeholder="Enter location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={isLoading}
              />
              <Button type="submit" disabled={isLoading || !searchQuery.trim()}>
                <Search className="h-4 w-4" />
              </Button>
            </form>

            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
              ) : stores.length > 0 ? (
                stores.map((store) => (
                  <Card
                    key={store.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => {
                      if (googleMapRef.current) {
                        googleMapRef.current.setCenter(store.geometry.location)
                        googleMapRef.current.setZoom(15)
                      }
                    }}
                  >
                    <CardContent className="p-3">
                      <div className="flex gap-3 items-start">
                        <StoreIcon className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <h3 className="font-medium">{store.name}</h3>
                          <p className="text-sm text-muted-foreground">{store.vicinity}</p>
                          {store.rating && <p className="text-sm">{store.rating} ⭐</p>}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <MapPin className="h-8 w-8 mx-auto mb-2" />
                  <p>No stores found nearby.</p>
                  <p className="text-sm">Try searching for a different location.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
