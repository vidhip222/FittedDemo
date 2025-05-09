"use client"

import { Badge } from "@/components/ui/badge"

import type React from "react"

import { useState } from "react"
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

export default function SettingsPage() {
  const [loading, setLoading] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
    }, 1500)
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

              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">First Name</Label>
                    <Input id="first-name" defaultValue="Jessica" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-name">Last Name</Label>
                    <Input id="last-name" defaultValue="Davis" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="jessica@example.com" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" defaultValue="(555) 123-4567" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea id="bio" placeholder="Tell us about yourself..." />
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
              <CardTitle>Address Information</CardTitle>
              <CardDescription>Update your shipping and delivery addresses.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Street Address</Label>
                  <Input id="address" defaultValue="123 Main St, Apt 4B" />
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" defaultValue="San Francisco" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input id="state" defaultValue="CA" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip">ZIP Code</Label>
                    <Input id="zip" defaultValue="94105" />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit">Save Address</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Security</CardTitle>
              <CardDescription>Update your password and security settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" />
                </div>

                <div className="flex justify-end">
                  <Button type="submit">Update Password</Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Connected Accounts</CardTitle>
              <CardDescription>Manage your connected social accounts.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-sm font-medium">G</span>
                  </div>
                  <div>
                    <p className="font-medium">Google</p>
                    <p className="text-sm text-muted-foreground">Connected</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Disconnect
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-sm font-medium">F</span>
                  </div>
                  <div>
                    <p className="font-medium">Facebook</p>
                    <p className="text-sm text-muted-foreground">Not connected</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Connect
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-sm font-medium">I</span>
                  </div>
                  <div>
                    <p className="font-medium">Instagram</p>
                    <p className="text-sm text-muted-foreground">Connected</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Disconnect
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Delete Account</CardTitle>
              <CardDescription>Permanently delete your account and all your data.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <Button variant="destructive">Delete Account</Button>
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
              <div className="space-y-2">
                <Label>Style Vibes</Label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                  {["Casual", "Formal", "Streetwear", "Vintage", "Minimalist", "Bohemian", "Athletic", "Preppy"].map(
                    (style) => (
                      <div key={style} className="flex items-center space-x-2">
                        <input type="checkbox" id={style.toLowerCase()} className="h-4 w-4 rounded border-gray-300" />
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
                      <input type="checkbox" id={color.toLowerCase()} className="h-4 w-4 rounded border-gray-300" />
                      <Label htmlFor={color.toLowerCase()} className="text-sm font-normal">
                        {color}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget">Budget Range</Label>
                <Select>
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
                    <Switch id="sustainable" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="local" className="text-sm font-normal">
                      Prefer local businesses
                    </Label>
                    <Switch id="local" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="thrift" className="text-sm font-normal">
                      Include thrift/second-hand
                    </Label>
                    <Switch id="thrift" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit">Save Preferences</Button>
              </div>
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
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Email Notifications</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-new-recommendations" className="text-sm font-normal">
                      New style recommendations
                    </Label>
                    <Switch id="email-new-recommendations" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-delivery-updates" className="text-sm font-normal">
                      Delivery updates
                    </Label>
                    <Switch id="email-delivery-updates" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-promotions" className="text-sm font-normal">
                      Promotions and deals
                    </Label>
                    <Switch id="email-promotions" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Push Notifications</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="push-new-recommendations" className="text-sm font-normal">
                      New style recommendations
                    </Label>
                    <Switch id="push-new-recommendations" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="push-delivery-updates" className="text-sm font-normal">
                      Delivery updates
                    </Label>
                    <Switch id="push-delivery-updates" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="push-nearby-stores" className="text-sm font-normal">
                      Nearby store alerts
                    </Label>
                    <Switch id="push-nearby-stores" defaultChecked />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit">Save Notification Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Plan</CardTitle>
              <CardDescription>Manage your subscription and billing details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Premium Plan</h3>
                    <p className="text-sm text-muted-foreground">$9.99/month</p>
                  </div>
                  <Badge>Current Plan</Badge>
                </div>
                <div className="mt-4 text-sm">
                  <p>
                    Your next billing date is <strong>June 15, 2023</strong>
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline">Change Plan</Button>
                <Button variant="outline" className="text-destructive hover:text-destructive">
                  Cancel Subscription
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Manage your payment methods.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
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
              </div>

              <Button variant="outline">
                <CreditCard className="mr-2 h-4 w-4" />
                Add Payment Method
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>View your past invoices and payment history.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium">Premium Plan - Monthly</p>
                    <p className="text-sm text-muted-foreground">May 15, 2023</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">$9.99</p>
                    <p className="text-sm text-muted-foreground">Paid</p>
                  </div>
                </div>
                <div className="flex items-center justify-between py-2 border-t">
                  <div>
                    <p className="font-medium">Premium Plan - Monthly</p>
                    <p className="text-sm text-muted-foreground">April 15, 2023</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">$9.99</p>
                    <p className="text-sm text-muted-foreground">Paid</p>
                  </div>
                </div>
                <div className="flex items-center justify-between py-2 border-t">
                  <div>
                    <p className="font-medium">Premium Plan - Monthly</p>
                    <p className="text-sm text-muted-foreground">March 15, 2023</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">$9.99</p>
                    <p className="text-sm text-muted-foreground">Paid</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
