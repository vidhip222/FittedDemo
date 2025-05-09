import Link from "next/link"
import Image from "next/image"
import { Calendar, ArrowRight, Star, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function DropsPage() {
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
    },
    {
      id: 2,
      title: "Office Refresh",
      description: "Update your work wardrobe with these professional pieces",
      date: "May 3, 2025",
      itemCount: 8,
      image: "/placeholder.svg?height=300&width=600&text=Office+Refresh",
      new: false,
    },
    {
      id: 3,
      title: "Weekend Getaway",
      description: "Perfect pieces for your weekend adventures",
      date: "April 26, 2025",
      itemCount: 10,
      image: "/placeholder.svg?height=300&width=600&text=Weekend+Getaway",
      new: false,
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
                  <Link href={`/dashboard/drops/${drop.id}`} className="w-full">
                    <Button className="w-full">
                      View Collection
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
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
                  <Link href={`/dashboard/drops/influencer/${bundle.id}`} className="w-full">
                    <Button className="w-full">
                      Shop This Bundle
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
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
                  <Button variant="outline" className="w-full">
                    Set Reminder
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
