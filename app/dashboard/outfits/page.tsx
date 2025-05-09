import Image from "next/image"
import { Heart, Share2, ShoppingCart, Filter, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function OutfitsPage() {
  // Mock data for outfits
  const outfits = [
    { id: 1, name: "Casual Friday", items: 4, vibe: "casual", source: "ai" },
    { id: 2, name: "Weekend Brunch", items: 3, vibe: "casual", source: "ai" },
    { id: 3, name: "Date Night", items: 5, vibe: "dressy", source: "ai" },
    { id: 4, name: "Office Chic", items: 4, vibe: "work", source: "ai" },
    { id: 5, name: "Summer Festival", items: 6, vibe: "casual", source: "saved" },
    { id: 6, name: "Dinner Party", items: 5, vibe: "dressy", source: "saved" },
    { id: 7, name: "Beach Day", items: 4, vibe: "casual", source: "saved" },
    { id: 8, name: "Job Interview", items: 3, vibe: "work", source: "saved" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Outfits</h2>
          <p className="text-muted-foreground">Browse AI-generated outfit suggestions and your saved looks.</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search outfits..." className="w-full pl-8" />
          </div>
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
          <span className="sr-only">Filter</span>
        </Button>
      </div>

      <Tabs defaultValue="ai">
        <TabsList>
          <TabsTrigger value="ai">AI Suggestions</TabsTrigger>
          <TabsTrigger value="saved">Saved Outfits</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>
        <TabsContent value="ai" className="mt-4">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {outfits
              .filter((outfit) => outfit.source === "ai")
              .map((outfit) => (
                <Card key={outfit.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="aspect-[4/3] relative">
                      <Image
                        src={`/placeholder.svg?height=300&width=400&text=${outfit.name}`}
                        alt={outfit.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                          AI Suggested
                        </Badge>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium">{outfit.name}</h3>
                      <p className="text-sm text-muted-foreground">{outfit.items} items</p>
                    </div>
                  </CardContent>
                  <CardFooter className="p-2 border-t flex justify-between">
                    <Button variant="ghost" size="sm">
                      <Heart className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                    <Button variant="ghost" size="sm">
                      <ShoppingCart className="h-4 w-4 mr-1" />
                      Shop
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Share2 className="h-4 w-4 mr-1" />
                      Share
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>
        <TabsContent value="saved" className="mt-4">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {outfits
              .filter((outfit) => outfit.source === "saved")
              .map((outfit) => (
                <Card key={outfit.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="aspect-[4/3] relative">
                      <Image
                        src={`/placeholder.svg?height=300&width=400&text=${outfit.name}`}
                        alt={outfit.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium">{outfit.name}</h3>
                      <p className="text-sm text-muted-foreground">{outfit.items} items</p>
                    </div>
                  </CardContent>
                  <CardFooter className="p-2 border-t flex justify-between">
                    <Button variant="ghost" size="sm">
                      <Heart className="h-4 w-4 mr-1 text-red-500" fill="currentColor" />
                      Saved
                    </Button>
                    <Button variant="ghost" size="sm">
                      <ShoppingCart className="h-4 w-4 mr-1" />
                      Shop
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Share2 className="h-4 w-4 mr-1" />
                      Share
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>
        <TabsContent value="all" className="mt-4">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {outfits.map((outfit) => (
              <Card key={outfit.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="aspect-[4/3] relative">
                    <Image
                      src={`/placeholder.svg?height=300&width=400&text=${outfit.name}`}
                      alt={outfit.name}
                      fill
                      className="object-cover"
                    />
                    {outfit.source === "ai" && (
                      <div className="absolute top-2 right-2">
                        <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                          AI Suggested
                        </Badge>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium">{outfit.name}</h3>
                    <p className="text-sm text-muted-foreground">{outfit.items} items</p>
                  </div>
                </CardContent>
                <CardFooter className="p-2 border-t flex justify-between">
                  <Button variant="ghost" size="sm">
                    {outfit.source === "saved" ? (
                      <>
                        <Heart className="h-4 w-4 mr-1 text-red-500" fill="currentColor" />
                        Saved
                      </>
                    ) : (
                      <>
                        <Heart className="h-4 w-4 mr-1" />
                        Save
                      </>
                    )}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    Shop
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Share2 className="h-4 w-4 mr-1" />
                    Share
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
