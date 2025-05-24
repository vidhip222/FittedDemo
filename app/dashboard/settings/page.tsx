// app/dashboard/settings/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

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
    sizes: { tops: string; bottoms: string; shoes: string }
  }
}

export default function SettingsPage() {
  const supabase = createClientComponentClient()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()
      if (userError || !user) return router.replace('/login')

      const { data: prefRow, error: prefErr } = await supabase
        .from('user_preferences')
        .select('preferences')
        .eq('user_id', user.id)
        .single()

      // if no row, prefErr.code === 'PGRST116', swallow it
      if (prefErr && (prefErr.code as string) !== 'PGRST116') throw prefErr

      setProfile({
        id: user.id,
        full_name: user.user_metadata.full_name || '',
        email: user.email || '',
        phone: user.user_metadata.phone || '',
        address: user.user_metadata.address || '',
        preferences: prefRow?.preferences ?? {
          style: [],
          colors: [],
          brands: [],
          sizes: { tops: '', bottoms: '', shoes: '' },
        },
      })
    } catch (err) {
      console.error('Error fetching profile:', err)
      toast.error('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!profile) return
    setSaving(true)

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()
      if (userError || !user) throw userError

      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          full_name: profile.full_name,
          phone: profile.phone,
          address: profile.address,
        },
      })
      if (updateError) throw updateError

      const { error: prefError } = await supabase
        .from('user_preferences')
        .upsert({ user_id: user.id, preferences: profile.preferences })
      if (prefError) throw prefError

      toast.success('Profile updated successfully')
    } catch (err) {
      console.error('Error saving profile:', err)
      toast.error('Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Sign out error:', error)
      toast.error('Failed to sign out')
    } else {
      router.push('/')
    }
  }

  if (loading) return <div className="h-64 flex items-center justify-center">Loading profile…</div>
  if (!profile) return <div className="h-64 flex items-center justify-center">No profile found</div>

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="text-muted-foreground">Manage your account settings and preferences.</p>
      </div>
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
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

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Style Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Preferred Styles</Label>
                <div className="flex flex-wrap gap-2">
                  {['Casual', 'Formal', 'Sporty', 'Bohemian', 'Minimalist'].map((style) => (
                    <Button
                      key={style}
                      variant={profile.preferences.style.includes(style) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        const newStyles = profile.preferences.style.includes(style)
                          ? profile.preferences.style.filter((s) => s !== style)
                          : [...profile.preferences.style, style]
                        setProfile({
                          ...profile,
                          preferences: { ...profile.preferences, style: newStyles },
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
                  {['Black', 'White', 'Blue', 'Red', 'Green'].map((color) => (
                    <Button
                      key={color}
                      variant={profile.preferences.colors.includes(color) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        const newColors = profile.preferences.colors.includes(color)
                          ? profile.preferences.colors.filter((c) => c !== color)
                          : [...profile.preferences.colors, color]
                        setProfile({
                          ...profile,
                          preferences: { ...profile.preferences, colors: newColors },
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

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  label: 'Email Notifications',
                  desc: 'Receive updates about your style recommendations',
                },
                { label: 'Push Notifications', desc: 'Get instant updates on your device' },
                { label: 'Delivery Updates', desc: 'Track your gift deliveries in real-time' },
              ].map(({ label, desc }) => (
                <div key={label} className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>{label}</Label>
                    <p className="text-sm text-muted-foreground">{desc}</p>
                  </div>
                  <Button variant="secondary" size="sm">
                    Enable
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between">
        <Button variant="outline" onClick={handleSignOut}>
          Sign Out
        </Button>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  )
}
