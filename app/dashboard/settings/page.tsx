"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"

interface UserProfile {
  id: string
  full_name: string
  email: string
  phone: string
  address: string
  preferences: {
    style: string[]
    colors: string[]
    brands: string[]
    sizes: {
      tops: string
      bottoms: string
      shoes: string
    }
  }
}

export default function SettingsPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("No user found")

      // Fetch user profile
      const { data: profileData, error: profileError } = await supabase
        .from("user_preferences")
        .select("*")
        .eq("user_id", user.id)
        .single()

      if (profileError) throw profileError

      // Fetch user metadata
      const { data: { user: userData }, error: userError } = await supabase.auth.getUser()
      if (userError) throw userError

      setProfile({
        id: user.id,
        full_name: userData.user_metadata.full_name || "",
        email: userData.email || "",
        phone: userData.user_metadata.phone || "",
        address: userData.user_metadata.address || "",
        preferences: profileData?.preferences || {
          style: [],
          colors: [],
          brands: [],
          sizes: {
            tops: "",
            bottoms: "",
            shoes: ""
          }
        }
      })
    } catch (error) {
      console.error("Error fetching profile:", error)
      toast.error("Failed to load profile")
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!profile) return

    setSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("No user found")

      // Update user metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          full_name: profile.full_name,
          phone: profile.phone,
          address: profile.address
        }
      })

      if (updateError) throw updateError

      // Update preferences
      const { error: preferencesError } = await supabase
        .from("user_preferences")
        .upsert({
          user_id: user.id,
          preferences: profile.preferences
        })

      if (preferencesError) throw preferencesError

      toast.success("Profile updated successfully")
    } catch (error) {
      console.error("Error saving profile:", error)
      toast.error("Failed to save profile")
    } finally {
      setSaving(false)
    }
  }

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
      toast.error("Failed to sign out")
    }
  }

  if (loading) {
    return <div>Loading profile...</div>
  }

  if (!profile) {
    return <div>No profile found</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">Manage your account settings and preferences.</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={profile.full_name}
                  onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={profile.email} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={profile.address}
                  onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Style Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Preferred Styles</Label>
                <div className="flex flex-wrap gap-2">
                  {["Casual", "Formal", "Sporty", "Bohemian", "Minimalist"].map((style) => (
                    <Button
                      key={style}
                      variant={profile.preferences.style.includes(style) ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        const newStyles = profile.preferences.style.includes(style)
                          ? profile.preferences.style.filter((s) => s !== style)
                          : [...profile.preferences.style, style]
                        setProfile({
                          ...profile,
                          preferences: { ...profile.preferences, style: newStyles }
                        })
                      }}
                    >
                      {style}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Favorite Colors</Label>
                <div className="flex flex-wrap gap-2">
                  {["Black", "White", "Blue", "Red", "Green"].map((color) => (
                    <Button
                      key={color}
                      variant={profile.preferences.colors.includes(color) ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        const newColors = profile.preferences.colors.includes(color)
                          ? profile.preferences.colors.filter((c) => c !== color)
                          : [...profile.preferences.colors, color]
                        setProfile({
                          ...profile,
                          preferences: { ...profile.preferences, colors: newColors }
                        })
                      }}
                    >
                      {color}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive updates about your style recommendations
                    </p>
                  </div>
                  <Button variant="secondary" size="sm">
                    Enable
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Get instant updates on your device
                    </p>
                  </div>
                  <Button variant="secondary" size="sm">
                    Enable
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Delivery Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Track your gift deliveries in real-time
                    </p>
                  </div>
                  <Button variant="secondary" size="sm">
                    Enable
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between">
        <Button variant="outline" onClick={handleSignOut}>
          Sign Out
        </Button>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  )
}
