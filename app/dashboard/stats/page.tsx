"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function StatsPage() {
  const [timeframe, setTimeframe] = useState("month")

  // Mock data for style stats
  const styleStats = {
    casual: 65,
    formal: 15,
    athletic: 20,
    vintage: 35,
    streetwear: 45,
    bohemian: 10,
    minimalist: 50,
  }

  const colorStats = {
    black: 30,
    white: 25,
    blue: 20,
    gray: 15,
    red: 5,
    green: 3,
    yellow: 2,
  }

  const brandStats = {
    Zara: 20,
    "H&M": 15,
    Nike: 10,
    Adidas: 8,
    "Levi's": 7,
    Uniqlo: 5,
    Other: 35,
  }

  const activityStats = {
    "Items Added": 12,
    "Outfits Created": 8,
    "AI Suggestions Used": 15,
    "Items Purchased": 5,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Style Statistics</h2>
          <p className="text-muted-foreground">Detailed analytics of your style preferences and activity</p>
        </div>
      </div>

      <div className="flex justify-end">
        <Tabs value={timeframe} onValueChange={setTimeframe}>
          <TabsList>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="year">Year</TabsTrigger>
            <TabsTrigger value="all">All Time</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Style Preferences</CardTitle>
            <CardDescription>Breakdown of your style categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(styleStats).map(([style, percentage]) => (
                <div key={style}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium capitalize">{style}</span>
                    <span className="text-sm text-muted-foreground">{percentage}%</span>
                  </div>
                  <div className="mt-1 h-2 w-full rounded-full bg-muted">
                    <div className="h-2 rounded-full bg-primary" style={{ width: `${percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Color Preferences</CardTitle>
            <CardDescription>Most common colors in your closet</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(colorStats).map(([color, percentage]) => (
                <div key={color}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full" style={{ backgroundColor: color }} />
                      <span className="text-sm font-medium capitalize">{color}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{percentage}%</span>
                  </div>
                  <div className="mt-1 h-2 w-full rounded-full bg-muted">
                    <div className="h-2 rounded-full bg-primary" style={{ width: `${percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Brand Distribution</CardTitle>
            <CardDescription>Most common brands in your closet</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(brandStats).map(([brand, percentage]) => (
                <div key={brand}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{brand}</span>
                    <span className="text-sm text-muted-foreground">{percentage}%</span>
                  </div>
                  <div className="mt-1 h-2 w-full rounded-full bg-muted">
                    <div className="h-2 rounded-full bg-primary" style={{ width: `${percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activity Summary</CardTitle>
            <CardDescription>Your activity in the last {timeframe}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(activityStats).map(([activity, count]) => (
                <div key={activity}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{activity}</span>
                    <span className="text-sm text-muted-foreground">{count}</span>
                  </div>
                  <div className="mt-1 h-2 w-full rounded-full bg-muted">
                    <div className="h-2 rounded-full bg-primary" style={{ width: `${Math.min(count * 5, 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Style Evolution</CardTitle>
          <CardDescription>How your style has changed over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <p>Style evolution chart will be displayed here</p>
              <p className="text-sm">Data is being collected as you use the app</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Style Recommendations</CardTitle>
          <CardDescription>Based on your current style profile</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="rounded-lg border p-4">
              <h3 className="font-medium">Expand Your Color Palette</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Your wardrobe is dominated by neutrals. Consider adding more colorful pieces like burgundy, forest
                green, or mustard yellow to add versatility.
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="font-medium">Try Mixing Styles</h3>
              <p className="text-sm text-muted-foreground mt-1">
                You have a strong preference for casual and minimalist styles. Try incorporating elements from vintage
                or streetwear for more dynamic outfits.
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="font-medium">Accessorize More</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Your closet has few accessories. Adding more accessories like scarves, jewelry, or hats can transform
                your existing outfits.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
