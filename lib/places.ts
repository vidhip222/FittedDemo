// Load Google Maps script via server-side API route
export const loadGoogleMapsScript = async () => {
  const id = "google-maps-script"

  // Check if script is already loaded
  if (typeof window !== "undefined" && document.getElementById(id)) {
    return Promise.resolve()
  }

  try {
    // Get the script URL from the server
    const response = await fetch("/api/places/script")
    if (!response.ok) {
      throw new Error("Failed to get Google Maps script URL")
    }

    const { scriptUrl } = await response.json()

    return new Promise<void>((resolve, reject) => {
      if (typeof window === "undefined") {
        reject(new Error("Cannot load script on server side"))
        return
      }

      const script = document.createElement("script")
      script.id = id
      script.src = scriptUrl
      script.async = true
      script.defer = true
      script.onload = () => resolve()
      script.onerror = (error) => reject(error)
      document.head.appendChild(script)
    })
  } catch (error) {
    console.error("Error loading Google Maps script:", error)
    throw error
  }
}

// Search for nearby places via server-side API route
export const searchNearbyPlaces = async (
  location: { lat: number; lng: number },
  radius = 5000,
  type = "clothing_store",
) => {
  try {
    const response = await fetch(
      `/api/places/nearby?lat=${location.lat}&lng=${location.lng}&radius=${radius}&type=${type}`,
    )

    if (!response.ok) {
      throw new Error(`Places API returned ${response.status}`)
    }

    const data = await response.json()
    return data.results || []
  } catch (error) {
    console.error("Error searching nearby places:", error)
    throw error
  }
}

// Geocode an address via server-side API route
export const geocodeAddress = async (address: string) => {
  try {
    const response = await fetch(`/api/places/geocode?address=${encodeURIComponent(address)}`)

    if (!response.ok) {
      throw new Error(`Geocoding API returned ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error geocoding address:", error)
    throw error
  }
}
