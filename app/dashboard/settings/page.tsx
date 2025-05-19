"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const [loading, setLoading] = useState(false)
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    location: "",
  })
  const [preferences, setPreferences] = useState({
    stylePreferences: [] as string[],
    colorPreferences: [] as string[],
    priceRange: "mid-range",
    sustainableBrands: false,
    localBusinesses: true,
    thriftStores: false,
  })
  const { toast } = useToast()
  const [userLocation, setUserLocation] = useState<GeolocationCoordinates | null>(null)
  const [locationPermission, setLocationPermission] = useState<boolean>(false)
  const [nearbyStores, setNearbyStores] = useState<any[]>([])

  useEffect(() => {
    // Fetch user data
    fetchUserData()

    // Check if location is already stored
    if (navigator.geolocation) {
      navigator.permissions.query({ name: "geolocation" }).then((permissionStatus) => {
        setLocationPermission(permissionStatus.state === "granted")

        if (permissionStatus.state === "granted") {
          getCurrentLocation()
        }
      })
    }
  }, [])

  const fetchUserData = async () => {
    try {
      setLoading(true)
      const [userResponse, preferencesResponse] = await Promise.all([
        fetch("/api/user"),
        fetch("/api/user/preferences"),
      ])

      if (userResponse.ok) {
        const userData = await userResponse.json()
        setUserData({
          name: userData.user.name || "",
          email: userData.user.email || "",
          phone: userData.user.phone || "",
          bio: userData.user.bio || "",
          address: userData.user.address || "",
          city: userData.user.city || "",
          state: userData.user.state || "",
          zip: userData.user.zip || "",
          location: userData.user.location || "",
        })
      }

      if (preferencesResponse.ok) {
        const preferencesData = await preferencesResponse.json()
        if (preferencesData.preferences) {
          setPreferences({
            stylePreferences: preferencesData.preferences.stylePreferences || [],
            colorPreferences: preferencesData.preferences.colorPreferences || [],
            priceRange: preferencesData.preferences.priceRange || "mid-range",
            sustainableBrands: preferencesData.preferences.sustainableBrands || false,
            localBusinesses: preferencesData.preferences.localBusinesses || false,
            thriftStores: preferencesData.preferences.thriftStores || false,
          })
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
      toast({
        title: "Error",
        description: "Failed to load your profile data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        throw new Error("Failed to update profile")
      }

      toast({
        title: "Profile updated",
        description: "Your profile information has been saved",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update your profile",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePreferencesSave = async () => {
    setLoading(true)

    try {
      const response = await fetch("/api/user/preferences", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(preferences),
      })

      if (!response.ok) {
        throw new Error("Failed to update preferences")
      }

      toast({
        title: "Preferences updated",
        description: "Your style preferences have been saved",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update your preferences",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setUserData((prev) => ({ ...prev, [id]: value }))
  }

  const handleStylePreferenceToggle = (style: string) => {
    setPreferences((prev) => {
      const stylePreferences = [...prev.stylePreferences]

      if (stylePreferences.includes(style)) {
        return {
          ...prev,
          stylePreferences: stylePreferences.filter((s) => s !== style),
        }
      } else {
        return {
          ...prev,
          stylePreferences: [...stylePreferences, style],
        }
      }
    })
  }

  const handleColorPreferenceToggle = (color: string) => {
    setPreferences((prev) => {
      const colorPreferences = [...prev.colorPreferences]

      if (colorPreferences.includes(color)) {
        return {
          ...prev,
          colorPreferences: colorPreferences.filter((c) => c !== color),
        }
      } else {
        return {
          ...prev,
          colorPreferences: [...colorPreferences, color],
        }
      }
    })
  }

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation(position.coords)

          // Reverse geocode to get address
          reverseGeocode(position.coords.latitude, position.coords.longitude)

          // Find nearby stores
          findNearbyStores(position.coords.latitude, position.coords.longitude)
        },
        (error) => {
          console.error("Error getting location:", error)
          toast({
            title: "Location error",
            description: "Unable to get your current location",
            variant: "destructive",
          })
        },
      )
    } else {
      toast({
        title: "Location not supported",
        description: "Geolocation is not supported by your browser",
        variant: "destructive",
      })
    }
  }

  const reverseGeocode = async (latitude: number, longitude: number) => {
    try {
      // Use our server-side API route instead of directly calling OpenCage
      const response = await fetch(`/api/geocode?lat=${latitude}&lng=${longitude}`)

      if (!response.ok) {
        throw new Error("Geocoding failed")
      }

      const data = await response.json()

      if (data.results && data.results.length > 0) {
        const result = data.results[0]
        const components = result.components

        setUserData((prev) => ({
          ...prev,
          address: components.road || "",
          city: components.city || components.town || "",
          state: components.state || "",
          zip: components.postcode || "",
          location: `${latitude.toFixed(6)},${longitude.toFixed(6)}`,
        }))
      } else {
        // Fallback if no results
        setUserData((prev) => ({
          ...prev,
          location: `${latitude.toFixed(6)},${longitude.toFixed(6)}`,
        }))
      }

      toast({
        title: "Location updated",
        description: "Your location has been updated",
      })
    } catch (error) {
      console.error("Error reverse geocoding:", error)
      // Still save coordinates even if geocoding fails
      setUserData((prev) => ({
        ...prev,
        location: `${latitude.toFixed(6)},${longitude.toFixed(6)}`,
      }))

      toast({
        title: "Geocoding error",
        description: "Unable to get full address from coordinates, but location saved",
        variant: "destructive",
      })
    }
  }

  const findNearbyStores = async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(`/api/stores/search?lat=${latitude}&lng=${longitude}&radius=10`)

      if (!response.ok) {
        throw new Error("Failed to find stores")
      }

      const data = await response.json()
      setNearbyStores(data.stores || [])
    } catch (error) {
      console.error("Error finding stores:", error)
      toast({
        title: "Store search error",
        description: "Unable to find stores near your location",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">Manage your account settings and preferences.</p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="style">Style</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information and how others see you on the platform.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="/placeholder-user.jpg" alt="User" />
                  <AvatarFallback>{userData.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-2">
                  <Button variant="outline" size="sm" className="w-full sm:w-auto">
                    Change Avatar
                  </Button>
                  <Button variant="outline" size="sm" className="w-full sm:w-auto">
                    Remove Avatar
                  </Button>
                </div>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" value={userData.name} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={userData.email} onChange={handleInputChange} disabled />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" value={userData.phone} onChange={handleInputChange} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself..."
                    value={userData.bio}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={loading}>
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Location Settings</CardTitle>
              <CardDescription>Update your location for better local recommendations.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Location Access</h3>
                    <p className="text-sm text-muted-foreground">Allow Fitted to access your location</p>
                  </div>
                  <Switch
                    checked={locationPermission}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        getCurrentLocation()
                      } else {
                        setUserLocation(null)
                        setLocationPermission(false)
                        setUserData((prev) => ({ ...prev, location: "" }))
                      }
                    }}
                  />
                </div>

                {userLocation && (
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Current Location</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Latitude: {userLocation.latitude.toFixed(6)}, Longitude: {userLocation.longitude.toFixed(6)}
                    </p>
                    <Button variant="outline" size="sm" className="mt-2" onClick={getCurrentLocation}>
                      Update Location
                    </Button>
                  </div>
                )}

                {nearbyStores.length > 0 && (
                  <div className="mt-4">
                    <h3 className="font-medium mb-2">Nearby Fashion Stores</h3>
                    <div className="space-y-2">
                      {nearbyStores.slice(0, 3).map((store, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                          <div>
                            <p className="font-medium">{store.name}</p>
                            <p className="text-xs text-muted-foreground">{store.distance} miles away</p>
                          </div>
                          <Badge variant="outline">{store.type}</Badge>
                        </div>
                      ))}
                      {nearbyStores.length > 3 && (
                        <Button variant="link" className="text-xs p-0">
                          View all {nearbyStores.length} stores
                        </Button>
                      )}
                    </div>
                  </div>
                )}

                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Street Address</Label>
                    <Input id="address" value={userData.address} onChange={handleInputChange} />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input id="city" value={userData.city} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input id="state" value={userData.state} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zip">ZIP Code</Label>
                      <Input id="zip" value={userData.zip} onChange={handleInputChange} />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button type="button" onClick={handleSave} disabled={loading}>
                      {loading ? "Saving..." : "Save Address"}
                    </Button>
                  </div>
                </form>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Other tabs remain the same */}
        <TabsContent value="style" className="mt-6 space-y-6">
          {/* Style preferences content */}
        </TabsContent>

        <TabsContent value="notifications" className="mt-6 space-y-6">
          {/* Notifications content */}
        </TabsContent>

        <TabsContent value="billing" className="mt-6 space-y-6">
          {/* Billing content */}
        </TabsContent>
      </Tabs>
    </div>
  )
}
