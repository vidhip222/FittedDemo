"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Tag } from "lucide-react"

export default function StatsPage() {
  // Mock data for demonstration
  const styleBreakdown = [
    { style: "Casual", percentage: 45 },
    { style: "Formal", percentage: 25 },
    { style: "Streetwear", percentage: 20 },
    { style: "Vintage", percentage: 10 },
  ]

  const categoryUsage = [
    { category: "Tops", count: 28 },
    { category: "Bottoms", count: 22 },
    { category: "Shoes", count: 15 },
    { category: "Accessories", count: 12 },
    { category: "Outerwear", count: 8 },
  ]

  const monthlyTrends = [
    { month: "Jan", outfits: 12 },
    { month: "Feb", outfits: 15 },
    { month: "Mar", outfits: 18 },
    { month: "Apr", outfits: 14 },
    { month: "May", outfits: 20 },
    { month: "Jun", outfits: 22 },
  ]

  const colorPalette = [
    { color: "Black", percentage: 30 },
    { color: "Blue", percentage: 25 },
    { color: "White", percentage: 20 },
    { color: "Gray", percentage: 15 },
    { color: "Other", percentage: 10 },
  ]

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Style Analytics</h2>
        <p className="text-muted-foreground">Detailed insights about your fashion choices and style evolution</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="colors">Colors</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Outfits</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">101</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Most Worn Style</CardTitle>
                <Tag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Casual</div>
                <p className="text-xs text-muted-foreground">45% of your outfits</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Favorite Color</CardTitle>
                <div className="h-4 w-4 rounded-full bg-black" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Black</div>
                <p className="text-xs text-muted-foreground">30% of your wardrobe</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Style Breakdown</CardTitle>
              <CardDescription>Distribution of your outfit styles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {styleBreakdown.map((item) => (
                  <div key={item.style} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.style}</span>
                      <span className="text-sm text-muted-foreground">{item.percentage}%</span>
                    </div>
                    <Progress value={item.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Outfit Trends</CardTitle>
              <CardDescription>Your style evolution over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-end justify-between gap-2">
                {monthlyTrends.map((item) => (
                  <div key={item.month} className="flex flex-col items-center gap-2">
                    <div
                      className="w-12 bg-primary rounded-t-sm"
                      style={{ height: `${(item.outfits / 22) * 200}px` }}
                    />
                    <span className="text-sm text-muted-foreground">{item.month}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Category Usage</CardTitle>
              <CardDescription>How you utilize different clothing categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categoryUsage.map((item) => (
                  <div key={item.category} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.category}</span>
                      <span className="text-sm text-muted-foreground">{item.count} items</span>
                    </div>
                    <Progress value={(item.count / 28) * 100} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="colors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Color Palette</CardTitle>
              <CardDescription>Your wardrobe's color distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {colorPalette.map((item) => (
                  <div key={item.color} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-4 w-4 rounded-full"
                          style={{
                            backgroundColor:
                              item.color === "Black"
                                ? "#000"
                                : item.color === "Blue"
                                  ? "#3b82f6"
                                  : item.color === "White"
                                    ? "#fff"
                                    : item.color === "Gray"
                                      ? "#6b7280"
                                      : "#e5e7eb",
                          }}
                        />
                        <span className="text-sm font-medium">{item.color}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{item.percentage}%</span>
                    </div>
                    <Progress value={item.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
