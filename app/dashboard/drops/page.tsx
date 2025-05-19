"use client"

import { useState } from "react"
import Image from "next/image"
import { Calendar, ArrowRight, Star, Clock, Heart, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

export default function DropsPage() {
  const [selectedDrop, setSelectedDrop] = useState<any>(null)
  const [selectedBundle, setSelectedBundle] = useState<any>(null)
  const [showDropDialog, setShowDropDialog] = useState(false)
  const [showBundleDialog, setShowBundleDialog] = useState(false)
  const { toast } = useToast()

  // Mock data for weekly drops
  const weeklyDrops = [
    {
      id: 1,
      title: "Summer Essentials",
      description: "Beat the heat with these cool summer picks",
      date: "May 10, 2025",
      itemCount: 12,
      image: "/placeholder.svg?height=300&width=600&text=Summer+Essentials",
      new: true,
      items: [
        { id: 1, name: "Linen Shirt", price: 49.99, image: "/placeholder.svg?height=200&width=200&text=Linen+Shirt" },
        {
          id: 2,
          name: "Bermuda Shorts",
          price: 39.99,
          image: "/placeholder.svg?height=200&width=200&text=Bermuda+Shorts",
        },
        { id: 3, name: "Straw Hat", price: 29.99, image: "/placeholder.svg?height=200&width=200&text=Straw+Hat" },
        { id: 4, name: "Sandals", price: 59.99, image: "/placeholder.svg?height=200&width=200&text=Sandals" },
      ],
    },
    {
      id: 2,
      title: "Office Refresh",
      description: "Update your work wardrobe with these professional pieces",
      date: "May 3, 2025",
      itemCount: 8,
      image: "/placeholder.svg?height=300&width=600&text=Office+Refresh",
      new: false,
      items: [
        { id: 1, name: "Blazer", price: 129.99, image: "/placeholder.svg?height=200&width=200&text=Blazer" },
        { id: 2, name: "Dress Shirt", price: 59.99, image: "/placeholder.svg?height=200&width=200&text=Dress+Shirt" },
        { id: 3, name: "Slacks", price: 79.99, image: "/placeholder.svg?height=200&width=200&text=Slacks" },
        { id: 4, name: "Loafers", price: 99.99, image: "/placeholder.svg?height=200&width=200&text=Loafers" },
      ],
    },
    {
      id: 3,
      title: "Weekend Getaway",
      description: "Perfect pieces for your weekend adventures",
      date: "April 26, 2025",
      itemCount: 10,
      image: "/placeholder.svg?height=300&width=600&text=Weekend+Getaway",
      new: false,
      items: [
        { id: 1, name: "Denim Jacket", price: 89.99, image: "/placeholder.svg?height=200&width=200&text=Denim+Jacket" },
        { id: 2, name: "Casual Tee", price: 29.99, image: "/placeholder.svg?height=200&width=200&text=Casual+Tee" },
        { id: 3, name: "Jeans", price: 69.99, image: "/placeholder.svg?height=200&width=200&text=Jeans" },
        { id: 4, name: "Sneakers", price: 79.99, image: "/placeholder.svg?height=200&width=200&text=Sneakers" },
      ],
    },
  ]

  // Mock data for influencer bundles
  const influencerBundles = [
    {
      id: 1,
      influencer: {
        name: "Emma Roberts",
        username: "@emmaroberts",
        avatar: "/placeholder.svg?height=100&width=100&text=ER",
        followers: "2.4M",
      },
      title: "Coastal Grandma Vibes",
      description: "My favorite neutral pieces for that effortless coastal look",
      itemCount: 6,
      image: "/placeholder.svg?height=300&width=600&text=Coastal+Grandma",
      items: [
        {
          id: 1,
          name: "Oversized Cardigan",
          price: 79.99,
          image: "/placeholder.svg?height=200&width=200&text=Cardigan",
        },
        { id: 2, name: "Linen Pants", price: 69.99, image: "/placeholder.svg?height=200&width=200&text=Linen+Pants" },
        { id: 3, name: "Straw Tote", price: 49.99, image: "/placeholder.svg?height=200&width=200&text=Straw+Tote" },
        { id: 4, name: "White Button-Up", price: 59.99, image: "/placeholder.svg?height=200&width=200&text=Button+Up" },
      ],
    },
    {
      id: 2,
      influencer: {
        name: "Alex Chen",
        username: "@alexstyled",
        avatar: "/placeholder.svg?height=100&width=100&text=AC",
        followers: "1.8M",
      },
      title: "Y2K Revival",
      description: "Bringing back the 2000s with these nostalgic pieces",
      itemCount: 8,
      image: "/placeholder.svg?height=300&width=600&text=Y2K+Revival",
      items: [
        { id: 1, name: "Baby Tee", price: 29.99, image: "/placeholder.svg?height=200&width=200&text=Baby+Tee" },
        {
          id: 2,
          name: "Low-Rise Jeans",
          price: 79.99,
          image: "/placeholder.svg?height=200&width=200&text=Low+Rise+Jeans",
        },
        {
          id: 3,
          name: "Platform Sandals",
          price: 69.99,
          image: "/placeholder.svg?height=200&width=200&text=Platform+Sandals",
        },
        {
          id: 4,
          name: "Butterfly Clips",
          price: 19.99,
          image: "/placeholder.svg?height=200&width=200&text=Butterfly+Clips",
        },
      ],
    },
    {
      id: 3,
      influencer: {
        name: "Jordan Taylor",
        username: "@jordantaylor",
        avatar: "/placeholder.svg?height=100&width=100&text=JT",
        followers: "3.2M",
      },
      title: "Minimalist Essentials",
      description: "Build your capsule wardrobe with these timeless pieces",
      itemCount: 5,
      image: "/placeholder.svg?height=300&width=600&text=Minimalist+Essentials",
      items: [
        {
          id: 1,
          name: "Black Turtleneck",
          price: 49.99,
          image: "/placeholder.svg?height=200&width=200&text=Turtleneck",
        },
        {
          id: 2,
          name: "Tailored Trousers",
          price: 89.99,
          image: "/placeholder.svg?height=200&width=200&text=Trousers",
        },
        { id: 3, name: "Leather Loafers", price: 119.99, image: "/placeholder.svg?height=200&width=200&text=Loafers" },
        { id: 4, name: "Gold Hoops", price: 39.99, image: "/placeholder.svg?height=200&width=200&text=Gold+Hoops" },
      ],
    },
  ]

  // Mock data for upcoming drops
  const upcomingDrops = [
    {
      id: 1,
      title: "Festival Season",
      description: "Get ready for music festivals with these statement pieces",
      date: "May 17, 2025",
      countdown: "7 days",
    },
    {
      id: 2,
      title: "Vacation Ready",
      description: "Pack light but stylish with these travel essentials",
      date: "May 24, 2025",
      countdown: "14 days",
    },
    {
      id: 3,
      title: "Pride Collection",
      description: "Celebrate Pride Month with these colorful selections",
      date: "June 1, 2025",
      countdown: "22 days",
    },
  ]

  const viewDrop = (drop: any) => {
    setSelectedDrop(drop)
    setShowDropDialog(true)
  }

  const viewBundle = (bundle: any) => {
    setSelectedBundle(bundle)
    setShowBundleDialog(true)
  }

  const handleSaveItem = (item: any) => {
    toast({
      title: "Item saved",
      description: `${item.name} has been saved to your favorites`,
    })
  }

  const handleBuyItem = (item: any) => {
    toast({
      title: "Item added to cart",
      description: `${item.name} has been added to your cart`,
    })
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Weekly Drops & Influencer Bundles</h2>
        <p className="text-muted-foreground">Discover the latest curated collections and influencer style picks.</p>
      </div>

      <Tabs defaultValue="weekly">
        <TabsList>
          <TabsTrigger value="weekly">Weekly Drops</TabsTrigger>
          <TabsTrigger value="influencer">Influencer Bundles</TabsTrigger>
          <TabsTrigger value="upcoming">Coming Soon</TabsTrigger>
        </TabsList>

        <TabsContent value="weekly" className="mt-6 space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {weeklyDrops.map((drop) => (
              <Card key={drop.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="aspect-[16/9] relative">
                    <Image src={drop.image || "/placeholder.svg"} alt={drop.title} fill className="object-cover" />
                    {drop.new && (
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-primary text-primary-foreground">New</Badge>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-bold">{drop.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{drop.description}</p>
                    <div className="flex items-center mt-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Dropped {drop.date}</span>
                    </div>
                    <p className="text-sm mt-2">{drop.itemCount} items</p>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button className="w-full" onClick={() => viewDrop(drop)}>
                    View Collection
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="influencer" className="mt-6 space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {influencerBundles.map((bundle) => (
              <Card key={bundle.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="aspect-[16/9] relative">
                    <Image src={bundle.image || "/placeholder.svg"} alt={bundle.title} fill className="object-cover" />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar>
                        <AvatarImage
                          src={bundle.influencer.avatar || "/placeholder.svg"}
                          alt={bundle.influencer.name}
                        />
                        <AvatarFallback>
                          {bundle.influencer.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{bundle.influencer.name}</h4>
                        <p className="text-xs text-muted-foreground">{bundle.influencer.username}</p>
                      </div>
                      <div className="ml-auto flex items-center text-xs">
                        <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                        {bundle.influencer.followers} followers
                      </div>
                    </div>
                    <h3 className="text-xl font-bold">{bundle.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{bundle.description}</p>
                    <p className="text-sm mt-2">{bundle.itemCount} items</p>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button className="w-full" onClick={() => viewBundle(bundle)}>
                    Shop This Bundle
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="upcoming" className="mt-6 space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {upcomingDrops.map((drop) => (
              <Card key={drop.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{drop.title}</CardTitle>
                    <Badge variant="outline" className="ml-2">
                      <Clock className="h-3 w-3 mr-1" />
                      {drop.countdown}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{drop.description}</p>
                  <div className="flex items-center mt-4 text-sm">
                    <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>Dropping {drop.date}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      toast({
                        title: "Reminder set",
                        description: `We'll notify you when the ${drop.title} collection drops`,
                      })
                    }}
                  >
                    Set Reminder
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Weekly Drop Dialog */}
      <Dialog open={showDropDialog} onOpenChange={setShowDropDialog}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>{selectedDrop?.title}</DialogTitle>
            <DialogDescription>{selectedDrop?.description}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="aspect-[16/9] relative rounded-lg overflow-hidden">
              <Image
                src={selectedDrop?.image || "/placeholder.svg"}
                alt={selectedDrop?.title || "Collection"}
                fill
                className="object-cover"
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {selectedDrop?.items.map((item: any) => (
                <Card key={item.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="aspect-square relative">
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="p-2">
                      <h3 className="font-medium text-sm">{item.name}</h3>
                      <p className="text-sm font-bold">${item.price.toFixed(2)}</p>
                    </div>
                  </CardContent>
                  <CardFooter className="p-2 pt-0 flex justify-between">
                    <Button variant="ghost" size="sm" onClick={() => handleSaveItem(item)}>
                      <Heart className="h-4 w-4 mr-1" />
                    </Button>
                    <Button size="sm" onClick={() => handleBuyItem(item)}>
                      <ShoppingBag className="h-4 w-4 mr-1" />
                      Buy
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Influencer Bundle Dialog */}
      <Dialog open={showBundleDialog} onOpenChange={setShowBundleDialog}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage
                  src={selectedBundle?.influencer?.avatar || "/placeholder.svg"}
                  alt={selectedBundle?.influencer?.name}
                />
                <AvatarFallback>
                  {selectedBundle?.influencer?.name
                    ?.split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <DialogTitle>{selectedBundle?.title}</DialogTitle>
                <p className="text-sm text-muted-foreground">
                  {selectedBundle?.influencer?.name} ({selectedBundle?.influencer?.username})
                </p>
              </div>
            </div>
            <DialogDescription className="mt-2">{selectedBundle?.description}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="aspect-[16/9] relative rounded-lg overflow-hidden">
              <Image
                src={selectedBundle?.image || "/placeholder.svg"}
                alt={selectedBundle?.title || "Bundle"}
                fill
                className="object-cover"
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {selectedBundle?.items.map((item: any) => (
                <Card key={item.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="aspect-square relative">
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="p-2">
                      <h3 className="font-medium text-sm">{item.name}</h3>
                      <p className="text-sm font-bold">${item.price.toFixed(2)}</p>
                    </div>
                  </CardContent>
                  <CardFooter className="p-2 pt-0 flex justify-between">
                    <Button variant="ghost" size="sm" onClick={() => handleSaveItem(item)}>
                      <Heart className="h-4 w-4 mr-1" />
                    </Button>
                    <Button size="sm" onClick={() => handleBuyItem(item)}>
                      <ShoppingBag className="h-4 w-4 mr-1" />
                      Buy
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
