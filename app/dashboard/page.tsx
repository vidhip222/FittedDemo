"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Shirt, ShoppingBag, Gift, MapPin, Plus, ArrowRight, Truck, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase"

export default function DashboardPage() {
  const [userName, setUserName] = useState<string>("")

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.user_metadata?.name) {
        setUserName(user.user_metadata.name)
      }
    }

    fetchUser()
  }, [])

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Welcome back, {userName || 'there'}!</h2>
          <p className="text-muted-foreground">Here's what's happening with your style today.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/ai-stylist">
            <Button className="mr-2">
              <MessageSquare className="mr-2 h-4 w-4" />
              Ask AI Stylist
            </Button>
          </Link>
          <Link href="/dashboard/closet/add">
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Add to Closet
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Closet Items</CardTitle>
            <Shirt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground">+3 added this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saved Outfits</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 added this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled Gifts</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Next delivery: Friday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nearby Stores</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">Within 5 miles</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>AI Style Recommendations</CardTitle>
              <CardDescription>Based on your style preferences and current closet</CardDescription>
            </div>
            <Link href="/dashboard/ai-stylist">
              <Button variant="outline" size="sm">
                <MessageSquare className="mr-2 h-4 w-4" />
                Ask AI
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="flex gap-4 overflow-x-auto pb-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="min-w-[250px] rounded-lg overflow-hidden border">
                  <div className="aspect-[4/3] relative">
                    <Image
                      src={`/placeholder.svg?height=300&width=400&text=Outfit+${i}`}
                      alt={`Outfit ${i}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium">
                      {i === 1 ? "Casual Friday" : i === 2 ? "Weekend Brunch" : i === 3 ? "Date Night" : "Office Chic"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {i === 1 ? "4 items" : i === 2 ? "3 items" : i === 3 ? "5 items" : "4 items"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/dashboard/outfits">
              <Button variant="outline" size="sm">
                View All Recommendations
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Weekly Drops</CardTitle>
              <CardDescription>Latest style collections</CardDescription>
            </div>
            <Badge className="bg-primary text-primary-foreground">New</Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-md bg-muted relative overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=64&width=64&text=Summer"
                    alt="Summer Essentials"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium">Summer Essentials</h3>
                  <p className="text-sm text-muted-foreground">12 items • Just dropped</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-md bg-muted relative overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=64&width=64&text=Office"
                    alt="Office Refresh"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium">Office Refresh</h3>
                  <p className="text-sm text-muted-foreground">8 items • 2 days ago</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-md bg-muted relative overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=64&width=64&text=Weekend"
                    alt="Weekend Getaway"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium">Weekend Getaway</h3>
                  <p className="text-sm text-muted-foreground">10 items • 1 week ago</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/dashboard/drops">
              <Button variant="outline" size="sm">
                View All Drops
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Influencer Bundles</CardTitle>
            <CardDescription>Style picks from top influencers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {["Emma Roberts", "Alex Chen", "Jordan Taylor"].map((influencer, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-muted relative overflow-hidden">
                    <Image
                      src={`/placeholder.svg?height=40&width=40&text=${influencer
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}`}
                      alt={influencer}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">{influencer}</h3>
                    <p className="text-sm text-muted-foreground">
                      {i === 0 ? "Coastal Grandma Vibes" : i === 1 ? "Y2K Revival" : "Minimalist Essentials"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/dashboard/drops">
              <Button variant="outline" size="sm">
                View All Bundles
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Nearby Stores</CardTitle>
            <CardDescription>Stores with items matching your style</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {["Urban Outfitters", "Madewell", "Zara", "Local Thrift"].map((store, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-medium">{store}</h3>
                    <p className="text-sm text-muted-foreground">
                      {i === 0
                        ? "0.5 miles away"
                        : i === 1
                          ? "1.2 miles away"
                          : i === 2
                            ? "2.5 miles away"
                            : "3.1 miles away"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href="/dashboard/stores">
              <Button variant="outline" size="sm">
                View All Stores
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/dashboard/stores/search">
              <Button size="sm">
                <Truck className="mr-2 h-4 w-4" />
                Get Delivery
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Style Stats</CardTitle>
            <CardDescription>Your style preferences and activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Casual</span>
                  <span className="text-sm text-muted-foreground">65%</span>
                </div>
                <div className="mt-1 h-2 w-full rounded-full bg-muted">
                  <div className="h-2 rounded-full bg-primary" style={{ width: "65%" }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Formal</span>
                  <span className="text-sm text-muted-foreground">15%</span>
                </div>
                <div className="mt-1 h-2 w-full rounded-full bg-muted">
                  <div className="h-2 rounded-full bg-primary" style={{ width: "15%" }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Athletic</span>
                  <span className="text-sm text-muted-foreground">20%</span>
                </div>
                <div className="mt-1 h-2 w-full rounded-full bg-muted">
                  <div className="h-2 rounded-full bg-primary" style={{ width: "20%" }} />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/dashboard/stats">
              <Button variant="outline" size="sm">
                View Detailed Stats
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
