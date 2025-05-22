"use client"

import type React from "react"

import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

interface ProfileData {
  firstName: string
  lastName: string
  email: string
  phone: string
  bio: string
  address: {
    street: string
    city: string
    state: string
    zip: string
  }
}

interface StylePreferences {
  styleVibes: string[]
  colorPreferences: string[]
  budget: string
  shoppingPreferences: {
    sustainable: boolean
    local: boolean
    thrift: boolean
  }
}

interface NotificationSettings {
  email: {
    newRecommendations: boolean
    deliveryUpdates: boolean
    promotions: boolean
  }
  push: {
    newRecommendations: boolean
    deliveryUpdates: boolean
    nearbyStores: boolean
  }
}

export default function SettingsPage() {
  // Profile state
  const [profileData, setProfileData] = useState<ProfileData>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("profileData")
      return saved
        ? JSON.parse(saved)
        : {
            firstName: "Jessica",
            lastName: "Davis",
            email: "jessica@example.com",
            phone: "(555) 123-4567",
            bio: "",
            address: {
              street: "123 Main St, Apt 4B",
              city: "San Francisco",
              state: "CA",
              zip: "94105",
            },
          }
    }
    return {
      firstName: "Jessica",
      lastName: "Davis",
      email: "jessica@example.com",
      phone: "(555) 123-4567",
      bio: "",
      address: {
        street: "123 Main St, Apt 4B",
        city: "San Francisco",
        state: "CA",
        zip: "94105",
      },
    }
  })

  // Style preferences state
  const [stylePreferences, setStylePreferences] = useState<StylePreferences>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("stylePreferences")
      return saved
        ? JSON.parse(saved)
        : {
            styleVibes: [],
            colorPreferences: [],
            budget: "",
            shoppingPreferences: {
              sustainable: false,
              local: false,
              thrift: false,
            },
          }
    }
    return {
      styleVibes: [],
      colorPreferences: [],
      budget: "",
      shoppingPreferences: {
        sustainable: false,
        local: false,
        thrift: false,
      },
    }
  })

  // Notification settings state
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("notificationSettings")
      return saved
        ? JSON.parse(saved)
        : {
            email: {
              newRecommendations: true,
              deliveryUpdates: true,
              promotions: false,
            },
            push: {
              newRecommendations: true,
              deliveryUpdates: true,
              nearbyStores: true,
            },
          }
    }
    return {
      email: {
        newRecommendations: true,
        deliveryUpdates: true,
        promotions: false,
      },
      push: {
        newRecommendations: true,
        deliveryUpdates: true,
        nearbyStores: true,
      },
    }
  })

  // Loading states
  const [loadingStates, setLoadingStates] = useState({
    profile: false,
    style: false,
    notifications: false,
  })

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem("profileData", JSON.stringify(profileData))
  }, [profileData])

  useEffect(() => {
    localStorage.setItem("stylePreferences", JSON.stringify(stylePreferences))
  }, [stylePreferences])

  useEffect(() => {
    localStorage.setItem("notificationSettings", JSON.stringify(notificationSettings))
  }, [notificationSettings])

  // Profile handlers
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    if (id.includes("address")) {
      const field = id.split("-")[1]
      setProfileData((prev) => ({
        ...prev,
        address: { ...prev.address, [field]: value },
      }))
    } else {
      setProfileData((prev) => ({ ...prev, [id]: value }))
    }
  }

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoadingStates((prev) => ({ ...prev, profile: true }))
    try {
      // In a real app, this would be an API call to save the profile data
      await new Promise((resolve) => setTimeout(resolve, 1000))
      localStorage.setItem("profileData", JSON.stringify(profileData))
      toast.success("Profile updated successfully")
    } catch (error) {
      toast.error("Failed to update profile")
    } finally {
      setLoadingStates((prev) => ({ ...prev, profile: false }))
    }
  }

  // Style preferences handlers
  const handleStyleVibeChange = (style: string) => {
    setStylePreferences((prev) => ({
      ...prev,
      styleVibes: prev.styleVibes.includes(style)
        ? prev.styleVibes.filter((s) => s !== style)
        : [...prev.styleVibes, style],
    }))
  }

  const handleColorPreferenceChange = (color: string) => {
    setStylePreferences((prev) => ({
      ...prev,
      colorPreferences: prev.colorPreferences.includes(color)
        ? prev.colorPreferences.filter((c) => c !== color)
        : [...prev.colorPreferences, color],
    }))
  }

  const handleShoppingPreferenceChange = (preference: keyof StylePreferences["shoppingPreferences"]) => {
    setStylePreferences((prev) => ({
      ...prev,
      shoppingPreferences: {
        ...prev.shoppingPreferences,
        [preference]: !prev.shoppingPreferences[preference],
      },
    }))
  }

  const handleStyleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoadingStates((prev) => ({ ...prev, style: true }))
    try {
      // In a real app, this would be an API call to save the style preferences
      await new Promise((resolve) => setTimeout(resolve, 1000))
      localStorage.setItem("stylePreferences", JSON.stringify(stylePreferences))
      toast.success("Style preferences updated successfully")
    } catch (error) {
      toast.error("Failed to update style preferences")
    } finally {
      setLoadingStates((prev) => ({ ...prev, style: false }))
    }
  }

  // Notification settings handlers
  const handleNotificationChange = (type: "email" | "push", setting: string, value: boolean) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [setting]: value,
      },
    }))
  }

  const handleNotificationSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoadingStates((prev) => ({ ...prev, notifications: true }))
    try {
      // In a real app, this would be an API call to save the notification settings
      await new Promise((resolve) => setTimeout(resolve, 1000))
      localStorage.setItem("notificationSettings", JSON.stringify(notificationSettings))
      toast.success("Notification settings updated successfully")
    } catch (error) {
      toast.error("Failed to update notification settings")
    } finally {
      setLoadingStates((prev) => ({ ...prev, notifications: false }))
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
                  <AvatarFallback>JD</AvatarFallback>
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

              <form onSubmit={handleProfileSave} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" value={profileData.firstName} onChange={handleProfileChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" value={profileData.lastName} onChange={handleProfileChange} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={profileData.email} onChange={handleProfileChange} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" value={profileData.phone} onChange={handleProfileChange} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself..."
                    value={profileData.bio}
                    onChange={handleProfileChange}
                  />
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={loadingStates.profile}>
                    {loadingStates.profile ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Address Information</CardTitle>
              <CardDescription>Update your shipping and delivery addresses.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileSave} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address-street">Street Address</Label>
                  <Input id="address-street" value={profileData.address.street} onChange={handleProfileChange} />
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="address-city">City</Label>
                    <Input id="address-city" value={profileData.address.city} onChange={handleProfileChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address-state">State</Label>
                    <Input id="address-state" value={profileData.address.state} onChange={handleProfileChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address-zip">ZIP Code</Label>
                    <Input id="address-zip" value={profileData.address.zip} onChange={handleProfileChange} />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={loadingStates.profile}>
                    {loadingStates.profile ? "Saving..." : "Save Address"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="style" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Style Preferences</CardTitle>
              <CardDescription>Update your style preferences to get better recommendations.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleStyleSave}>
                <div className="space-y-2">
                  <Label>Style Vibes</Label>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                    {["Casual", "Formal", "Streetwear", "Vintage", "Minimalist", "Bohemian", "Athletic", "Preppy"].map(
                      (style) => (
                        <div key={style} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={style.toLowerCase()}
                            className="h-4 w-4 rounded border-gray-300"
                            checked={stylePreferences.styleVibes.includes(style)}
                            onChange={() => handleStyleVibeChange(style)}
                          />
                          <Label htmlFor={style.toLowerCase()} className="text-sm font-normal">
                            {style}
                          </Label>
                        </div>
                      ),
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Color Preferences</Label>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                    {[
                      "Black",
                      "White",
                      "Gray",
                      "Blue",
                      "Red",
                      "Green",
                      "Yellow",
                      "Purple",
                      "Pink",
                      "Brown",
                      "Orange",
                      "Multi-color",
                    ].map((color) => (
                      <div key={color} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={color.toLowerCase()}
                          className="h-4 w-4 rounded border-gray-300"
                          checked={stylePreferences.colorPreferences.includes(color)}
                          onChange={() => handleColorPreferenceChange(color)}
                        />
                        <Label htmlFor={color.toLowerCase()} className="text-sm font-normal">
                          {color}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budget">Budget Range</Label>
                  <Select
                    value={stylePreferences.budget}
                    onValueChange={(value) => setStylePreferences((prev) => ({ ...prev, budget: value }))}
                  >
                    <SelectTrigger id="budget">
                      <SelectValue placeholder="Select budget range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="budget">Budget ($)</SelectItem>
                      <SelectItem value="mid-range">Mid-range ($$)</SelectItem>
                      <SelectItem value="premium">Premium ($$$)</SelectItem>
                      <SelectItem value="luxury">Luxury ($$$$)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Shopping Preferences</Label>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="sustainable" className="text-sm font-normal">
                        Prefer sustainable brands
                      </Label>
                      <Switch
                        id="sustainable"
                        checked={stylePreferences.shoppingPreferences.sustainable}
                        onCheckedChange={() => handleShoppingPreferenceChange("sustainable")}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="local" className="text-sm font-normal">
                        Prefer local businesses
                      </Label>
                      <Switch
                        id="local"
                        checked={stylePreferences.shoppingPreferences.local}
                        onCheckedChange={() => handleShoppingPreferenceChange("local")}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="thrift" className="text-sm font-normal">
                        Include thrift/second-hand
                      </Label>
                      <Switch
                        id="thrift"
                        checked={stylePreferences.shoppingPreferences.thrift}
                        onCheckedChange={() => handleShoppingPreferenceChange("thrift")}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <Button type="submit" disabled={loadingStates.style}>
                    {loadingStates.style ? "Saving..." : "Save Preferences"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Manage how and when you receive notifications.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleNotificationSave}>
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Email Notifications</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email-new-recommendations" className="text-sm font-normal">
                        New style recommendations
                      </Label>
                      <Switch
                        id="email-new-recommendations"
                        checked={notificationSettings.email.newRecommendations}
                        onCheckedChange={(checked) => {
                          handleNotificationChange("email", "newRecommendations", checked)
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email-delivery-updates" className="text-sm font-normal">
                        Delivery updates
                      </Label>
                      <Switch
                        id="email-delivery-updates"
                        checked={notificationSettings.email.deliveryUpdates}
                        onCheckedChange={(checked) => {
                          handleNotificationChange("email", "deliveryUpdates", checked)
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email-promotions" className="text-sm font-normal">
                        Promotions and deals
                      </Label>
                      <Switch
                        id="email-promotions"
                        checked={notificationSettings.email.promotions}
                        onCheckedChange={(checked) => {
                          handleNotificationChange("email", "promotions", checked)
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 mt-6">
                  <h3 className="text-sm font-medium">Push Notifications</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="push-new-recommendations" className="text-sm font-normal">
                        New style recommendations
                      </Label>
                      <Switch
                        id="push-new-recommendations"
                        checked={notificationSettings.push.newRecommendations}
                        onCheckedChange={(checked) => {
                          handleNotificationChange("push", "newRecommendations", checked)
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="push-delivery-updates" className="text-sm font-normal">
                        Delivery updates
                      </Label>
                      <Switch
                        id="push-delivery-updates"
                        checked={notificationSettings.push.deliveryUpdates}
                        onCheckedChange={(checked) => {
                          handleNotificationChange("push", "deliveryUpdates", checked)
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="push-nearby-stores" className="text-sm font-normal">
                        Nearby store alerts
                      </Label>
                      <Switch
                        id="push-nearby-stores"
                        checked={notificationSettings.push.nearbyStores}
                        onCheckedChange={(checked) => {
                          handleNotificationChange("push", "nearbyStores", checked)
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <Button type="submit" disabled={loadingStates.notifications}>
                    {loadingStates.notifications ? "Saving..." : "Save Notification Settings"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Plans</CardTitle>
              <CardDescription>Choose the plan that best fits your needs.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Free Plan */}
                <Card className="relative">
                  <CardHeader>
                    <CardTitle>Free</CardTitle>
                    <CardDescription>Basic features for casual users</CardDescription>
                    <div className="mt-2">
                      <span className="text-3xl font-bold">$0</span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <svg
                          className="mr-2 h-4 w-4 text-green-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Basic style recommendations
                      </li>
                      <li className="flex items-center">
                        <svg
                          className="mr-2 h-4 w-4 text-green-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Limited outfit history
                      </li>
                      <li className="flex items-center">
                        <svg
                          className="mr-2 h-4 w-4 text-green-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Basic AI stylist access
                      </li>
                    </ul>
                    <Button className="mt-4 w-full" variant="outline" disabled>
                      Current Plan
                    </Button>
                  </CardContent>
                </Card>

                {/* Premium Plan */}
                <Card className="relative border-primary">
                  <div className="absolute -top-2 right-4 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                    Popular
                  </div>
                  <CardHeader>
                    <CardTitle>Premium</CardTitle>
                    <CardDescription>Advanced features for style enthusiasts</CardDescription>
                    <div className="mt-2">
                      <span className="text-3xl font-bold">$5</span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <svg
                          className="mr-2 h-4 w-4 text-green-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Advanced AI style recommendations
                      </li>
                      <li className="flex items-center">
                        <svg
                          className="mr-2 h-4 w-4 text-green-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Unlimited outfit history
                      </li>
                      <li className="flex items-center">
                        <svg
                          className="mr-2 h-4 w-4 text-green-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Priority AI stylist access
                      </li>
                      <li className="flex items-center">
                        <svg
                          className="mr-2 h-4 w-4 text-green-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Exclusive style insights
                      </li>
                      <li className="flex items-center">
                        <svg
                          className="mr-2 h-4 w-4 text-green-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Early access to new features
                      </li>
                    </ul>
                    <Button className="mt-4 w-full">Upgrade to Premium</Button>
                  </CardContent>
                </Card>
              </div>

              <div className="rounded-lg border p-4">
                <h3 className="font-medium">Current Payment Method</h3>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-12 rounded bg-muted flex items-center justify-center">
                      <span className="text-xs font-medium">VISA</span>
                    </div>
                    <div>
                      <p className="font-medium">Visa ending in 4242</p>
                      <p className="text-sm text-muted-foreground">Expires 12/24</p>
                    </div>
                  </div>
                  <Badge>Default</Badge>
                </div>
                <Button variant="outline" className="mt-4">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Update Payment Method
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
