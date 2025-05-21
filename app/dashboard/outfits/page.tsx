"use client"

import { useState } from "react"
import Image from "next/image"
import { Heart, Share2, ShoppingCart, Filter, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

interface Outfit {
  id: number
  name: string
  items: number
  vibe: string
  source: string
  saved: boolean
}

export default function OutfitsPage() {
  const [outfits, setOutfits] = useState<Outfit[]>([
    { id: 1, name: "Casual Friday", items: 4, vibe: "casual", source: "ai", saved: false },
    { id: 2, name: "Weekend Brunch", items: 3, vibe: "casual", source: "ai", saved: false },
    { id: 3, name: "Date Night", items: 5, vibe: "dressy", source: "ai", saved: false },
    { id: 4, name: "Office Chic", items: 4, vibe: "work", source: "ai", saved: false },
    { id: 5, name: "Summer Festival", items: 6, vibe: "casual", source: "saved", saved: true },
    { id: 6, name: "Dinner Party", items: 5, vibe: "dressy", source: "saved", saved: true },
    { id: 7, name: "Beach Day", items: 4, vibe: "casual", source: "saved", saved: true },
    { id: 8, name: "Job Interview", items: 3, vibe: "work", source: "saved", saved: true },
  ])

  const generateAIOutfit = (id: number): Outfit => {
    const vibes = ["casual", "dressy", "work"]
    const names = [
      "Urban Explorer",
      "Weekend Warrior",
      "Coffee Shop Casual",
      "Evening Elegance",
      "Business Casual",
      "Street Style",
      "Smart Casual",
      "Weekend Getaway",
    ]
    
    return {
      id,
      name: names[Math.floor(Math.random() * names.length)],
      items: Math.floor(Math.random() * 3) + 3, // 3-5 items
      vibe: vibes[Math.floor(Math.random() * vibes.length)],
      source: "ai",
      saved: false,
    }
  }

  const ensureMinimumAISuggestions = (filteredOutfits: Outfit[]): Outfit[] => {
    const aiOutfits = filteredOutfits.filter(outfit => outfit.source === "ai")
    if (aiOutfits.length >= 3) return filteredOutfits

    const additionalOutfitsNeeded = 3 - aiOutfits.length
    const newOutfits = Array.from({ length: additionalOutfitsNeeded }, (_, i) => 
      generateAIOutfit(Math.max(...outfits.map(o => o.id)) + i + 1)
    )

    return [...filteredOutfits, ...newOutfits]
  }

  const [filters, setFilters] = useState({
    vibes: {
      casual: true,
      dressy: true,
      work: true,
    },
    sources: {
      ai: true,
      saved: true,
    },
  })

  const [searchQuery, setSearchQuery] = useState("")

  const handleSave = (outfitId: number) => {
    setOutfits((prevOutfits) =>
      prevOutfits.map((outfit) =>
        outfit.id === outfitId
          ? { ...outfit, saved: !outfit.saved, source: !outfit.saved ? "saved" : "ai" }
          : outfit
      )
    )
    toast.success("Outfit saved to your collection!")
  }

  const handleShop = (outfitId: number) => {
    toast.info("Shopping feature coming soon!")
  }

  const handleShare = async (outfitId: number) => {
    const outfit = outfits.find((o) => o.id === outfitId)
    if (!outfit) return

    const shareUrl = `${window.location.origin}/outfit/${outfitId}`

    try {
      if (navigator.share) {
        await navigator.share({
          title: outfit.name,
          text: `Check out this outfit: ${outfit.name}`,
          url: shareUrl,
        })
      } else {
        await navigator.clipboard.writeText(shareUrl)
        toast.success("Outfit link copied to clipboard!")
      }
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        toast.error("Failed to share outfit")
      }
    }
  }

  const handleFilterChange = (type: "vibes" | "sources", value: string) => {
    setFilters((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [value]: !prev[type][value as keyof typeof prev[typeof type]],
      },
    }))
  }

  const clearFilters = () => {
    setFilters({
      vibes: {
        casual: true,
        dressy: true,
        work: true,
      },
      sources: {
        ai: true,
        saved: true,
      },
    })
    setSearchQuery("")
  }

  const filteredOutfits = ensureMinimumAISuggestions(outfits.filter((outfit) => {
    const matchesVibe = filters.vibes[outfit.vibe as keyof typeof filters.vibes]
    const matchesSource = filters.sources[outfit.source as keyof typeof filters.sources]
    const matchesSearch = outfit.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesVibe && matchesSource && matchesSearch
  }))

  const activeFiltersCount = Object.values(filters.vibes).filter(Boolean).length +
    Object.values(filters.sources).filter(Boolean).length +
    (searchQuery ? 1 : 0)

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
            <Input
              type="search"
              placeholder="Search outfits..."
              className="w-full pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="relative">
              <Filter className="h-4 w-4" />
              {activeFiltersCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
              <span className="sr-only">Filter</span>
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filter Outfits</SheetTitle>
              <SheetDescription>
                Filter outfits by vibe and source
              </SheetDescription>
            </SheetHeader>
            <div className="py-6 space-y-6">
              <div className="space-y-4">
                <Label>Vibe</Label>
                <div className="space-y-2">
                  {Object.entries(filters.vibes).map(([vibe, checked]) => (
                    <div key={vibe} className="flex items-center space-x-2">
                      <Checkbox
                        id={`vibe-${vibe}`}
                        checked={checked}
                        onCheckedChange={() => handleFilterChange("vibes", vibe)}
                      />
                      <Label htmlFor={`vibe-${vibe}`} className="capitalize">
                        {vibe}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <Label>Source</Label>
                <div className="space-y-2">
                  {Object.entries(filters.sources).map(([source, checked]) => (
                    <div key={source} className="flex items-center space-x-2">
                      <Checkbox
                        id={`source-${source}`}
                        checked={checked}
                        onCheckedChange={() => handleFilterChange("sources", source)}
                      />
                      <Label htmlFor={`source-${source}`} className="capitalize">
                        {source === "ai" ? "AI Suggestions" : "Saved Outfits"}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              <Button variant="outline" className="w-full" onClick={clearFilters}>
                <X className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="ai">AI Suggestions</TabsTrigger>
          <TabsTrigger value="saved">Saved Outfits</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>
        <TabsContent value="ai" className="mt-4">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredOutfits
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
                    <Button variant="ghost" size="sm" onClick={() => handleSave(outfit.id)}>
                      <Heart className={`h-4 w-4 mr-1 ${outfit.saved ? "text-red-500 fill-current" : ""}`} />
                      {outfit.saved ? "Saved" : "Save"}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleShop(outfit.id)}>
                      <ShoppingCart className="h-4 w-4 mr-1" />
                      Shop
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleShare(outfit.id)}>
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
            {filteredOutfits
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
                    <Button variant="ghost" size="sm" onClick={() => handleSave(outfit.id)}>
                      <Heart className="h-4 w-4 mr-1 text-red-500" fill="currentColor" />
                      Saved
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleShop(outfit.id)}>
                      <ShoppingCart className="h-4 w-4 mr-1" />
                      Shop
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleShare(outfit.id)}>
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
            {filteredOutfits.map((outfit) => (
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
                  <Button variant="ghost" size="sm" onClick={() => handleSave(outfit.id)}>
                    <Heart className={`h-4 w-4 mr-1 ${outfit.saved ? "text-red-500 fill-current" : ""}`} />
                    {outfit.saved ? "Saved" : "Save"}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleShop(outfit.id)}>
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    Shop
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleShare(outfit.id)}>
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
