"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import { MapPin, Star, Search, Filter, Heart, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"

export default function FashionSearchPage() {
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    style: searchParams.get("style") || "casual",
    location: "nearby",
    priceRange: "mid-range",
    gender: "all",
    size: "all",
    color: "all",
    brand: "all",
    sustainable: false,
    localBusiness: false,
  })
  const [showFilters, setShowFilters] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any | null>(null)

  useEffect(() => {
    searchFashion()
  }, [])

  const searchFashion = async () => {
    setLoading(true)
    try {
      // Build query string from filters
      const queryParams = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        queryParams.append(key, value.toString())
      })

      const response = await fetch(`/api/fashion-search?${queryParams.toString()}`)
      if (!response.ok) {
        throw new Error("Failed to search for fashion items")
      }

      const data = await response.json()
      setSearchResults(data.results || [])
    } catch (error) {
      console.error("Error searching for fashion:", error)
      toast({
        title: "Error",
        description: "Failed to search for fashion items. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key: string, value: string | boolean) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleItemSelect = (item: any) => {
    setSelectedItem(item)
  }

  const styleOptions = [
    { value: "casual", label: "Casual" },
    { value: "formal", label: "Formal" },
    { value: "athletic", label: "Athletic" },
    { value: "vintage", label: "Vintage" },
    { value: "streetwear", label: "Streetwear" },
    { value: "bohemian", label: "Bohemian" },
    { value: "minimalist", label: "Minimalist" },
  ]

  const colorOptions = [
    { value: "all", label: "All Colors" },
    { value: "Black", label: "Black" },
    { value: "White", label: "White" },
    { value: "Gray", label: "Gray" },
    { value: "Blue", label: "Blue" },
    { value: "Red", label: "Red" },
    { value: "Green", label: "Green" },
    { value: "Yellow", label: "Yellow" },
    { value: "Purple", label: "Purple" },
    { value: "Pink", label: "Pink" },
    { value: "Brown", label: "Brown" },
  ]

  const sizeOptions = [
    { value: "all", label: "All Sizes" },
    { value: "XS", label: "XS" },
    { value: "S", label: "S" },
    { value: "M", label: "M" },
    { value: "L", label: "L" },
    { value: "XL", label: "XL" },
    { value: "XXL", label: "XXL" },
  ]

  const priceRangeOptions = [
    { value: "budget", label: "Budget ($)" },
    { value: "mid-range", label: "Mid-Range ($$)" },
    { value: "luxury", label: "Luxury ($$$)" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Fashion Search</h2>
        <p className="text-muted-foreground">Find clothes based on your style, location, and preferences</p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for clothes..."
                className="w-full pl-8"
                onChange={(e) => handleFilterChange("query", e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && searchFashion()}
              />
            </div>
          </div>
          <Button variant="outline" size="icon" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="h-4 w-4" />
            <span className="sr-only">Filter</span>
          </Button>
          <Button onClick={searchFashion} disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </Button>
        </div>

        {showFilters && (
          <Card className="p-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="style">Style</Label>
                <Select value={filters.style} onValueChange={(value) => handleFilterChange("style", value)}>
                  <SelectTrigger id="style">
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent>
                    {styleOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <Select value={filters.color} onValueChange={(value) => handleFilterChange("color", value)}>
                  <SelectTrigger id="color">
                    <SelectValue placeholder="Select color" />
                  </SelectTrigger>
                  <SelectContent>
                    {colorOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="size">Size</Label>
                <Select value={filters.size} onValueChange={(value) => handleFilterChange("size", value)}>
                  <SelectTrigger id="size">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    {sizeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priceRange">Price Range</Label>
                <Select value={filters.priceRange} onValueChange={(value) => handleFilterChange("priceRange", value)}>
                  <SelectTrigger id="priceRange">
                    <SelectValue placeholder="Select price range" />
                  </SelectTrigger>
                  <SelectContent>
                    {priceRangeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="sustainable"
                    checked={filters.sustainable}
                    onCheckedChange={(checked) => handleFilterChange("sustainable", !!checked)}
                  />
                  <Label htmlFor="sustainable">Sustainable Fashion</Label>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="localBusiness"
                    checked={filters.localBusiness}
                    onCheckedChange={(checked) => handleFilterChange("localBusiness", !!checked)}
                  />
                  <Label htmlFor="localBusiness">Local Businesses</Label>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className={`w-full ${selectedItem ? "md:w-2/3" : "md:w-full"}`}>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All Items</TabsTrigger>
              <TabsTrigger value="inStock">In Stock</TabsTrigger>
              <TabsTrigger value="sustainable">Sustainable</TabsTrigger>
              <TabsTrigger value="local">Local Businesses</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4">
              {loading ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Card key={i} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="aspect-square bg-muted animate-pulse" />
                        <div className="p-4 space-y-2">
                          <div className="h-4 bg-muted animate-pulse rounded" />
                          <div className="h-4 w-1/2 bg-muted animate-pulse rounded" />
                          <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : searchResults.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No results found. Try adjusting your filters.</p>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {searchResults.map((item) => (
                    <Card key={item.id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="aspect-square relative">
                          <Image
                            src={item.imageUrl || "/placeholder.svg"}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                          {!item.inStock && (
                            <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                              <Badge variant="outline" className="bg-background">
                                Out of Stock
                              </Badge>
                            </div>
                          )}
                          {item.sustainable && (
                            <div className="absolute top-2 right-2">
                              <Badge className="bg-green-500 text-white">Sustainable</Badge>
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm font-bold mt-1">${item.price.toFixed(2)}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs">{item.rating}</span>
                            <span className="text-xs text-muted-foreground">({item.reviews})</span>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center text-sm text-muted-foreground">
                              <MapPin className="mr-1 h-4 w-4" />
                              {item.store} ({item.distance})
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 pt-0">
                        <Button className="w-full" disabled={!item.inStock} onClick={() => handleItemSelect(item)}>
                          {item.inStock ? "View Details" : "Out of Stock"}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            <TabsContent value="inStock" className="mt-4">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {searchResults
                  .filter((item) => item.inStock)
                  .map((item) => (
                    <Card key={item.id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="aspect-square relative">
                          <Image
                            src={item.imageUrl || "/placeholder.svg"}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                          {item.sustainable && (
                            <div className="absolute top-2 right-2">
                              <Badge className="bg-green-500 text-white">Sustainable</Badge>
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm font-bold mt-1">${item.price.toFixed(2)}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs">{item.rating}</span>
                            <span className="text-xs text-muted-foreground">({item.reviews})</span>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center text-sm text-muted-foreground">
                              <MapPin className="mr-1 h-4 w-4" />
                              {item.store} ({item.distance})
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 pt-0">
                        <Button className="w-full" onClick={() => handleItemSelect(item)}>
                          View Details
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            </TabsContent>
            <TabsContent value="sustainable" className="mt-4">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {searchResults
                  .filter((item) => item.sustainable)
                  .map((item) => (
                    <Card key={item.id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="aspect-square relative">
                          <Image
                            src={item.imageUrl || "/placeholder.svg"}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                          {!item.inStock && (
                            <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                              <Badge variant="outline" className="bg-background">
                                Out of Stock
                              </Badge>
                            </div>
                          )}
                          <div className="absolute top-2 right-2">
                            <Badge className="bg-green-500 text-white">Sustainable</Badge>
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm font-bold mt-1">${item.price.toFixed(2)}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs">{item.rating}</span>
                            <span className="text-xs text-muted-foreground">({item.reviews})</span>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center text-sm text-muted-foreground">
                              <MapPin className="mr-1 h-4 w-4" />
                              {item.store} ({item.distance})
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 pt-0">
                        <Button className="w-full" disabled={!item.inStock} onClick={() => handleItemSelect(item)}>
                          {item.inStock ? "View Details" : "Out of Stock"}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            </TabsContent>
            <TabsContent value="local" className="mt-4">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {searchResults
                  .filter((item) => item.localBusiness)
                  .map((item) => (
                    <Card key={item.id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="aspect-square relative">
                          <Image
                            src={item.imageUrl || "/placeholder.svg"}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                          {!item.inStock && (
                            <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                              <Badge variant="outline" className="bg-background">
                                Out of Stock
                              </Badge>
                            </div>
                          )}
                          {item.sustainable && (
                            <div className="absolute top-2 right-2">
                              <Badge className="bg-green-500 text-white">Sustainable</Badge>
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm font-bold mt-1">${item.price.toFixed(2)}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs">{item.rating}</span>
                            <span className="text-xs text-muted-foreground">({item.reviews})</span>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center text-sm text-muted-foreground">
                              <MapPin className="mr-1 h-4 w-4" />
                              {item.store} ({item.distance})
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 pt-0">
                        <Button className="w-full" disabled={!item.inStock} onClick={() => handleItemSelect(item)}>
                          {item.inStock ? "View Details" : "Out of Stock"}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {selectedItem && (
          <div className="w-full md:w-1/3">
            <Card>
              <CardContent className="p-6 space-y-6">
                <div className="aspect-square relative rounded-md overflow-hidden">
                  <Image
                    src={selectedItem.imageUrl || "/placeholder.svg"}
                    alt={selectedItem.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="space-y-2">
                  <h2 className="text-xl font-bold">{selectedItem.name}</h2>
                  <p className="text-sm text-muted-foreground">{selectedItem.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="text-xl font-bold">${selectedItem.price.toFixed(2)}</div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{selectedItem.rating}</span>
                      <span className="text-xs text-muted-foreground">({selectedItem.reviews} reviews)</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium mb-1">Color</h3>
                    <div className="flex items-center gap-1">
                      <div
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: selectedItem.color.toLowerCase() }}
                      />
                      <span>{selectedItem.color}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-1">Size</h3>
                    <span>{selectedItem.size}</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-1">Brand</h3>
                    <span>{selectedItem.brand}</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-1">Store</h3>
                    <span>{selectedItem.store}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedItem.distance} away</span>
                </div>

                {selectedItem.sustainable && (
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-500 text-white">Sustainable</Badge>
                    <span className="text-sm">This item is made with sustainable materials and practices</span>
                  </div>
                )}

                {selectedItem.localBusiness && (
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Local Business</Badge>
                    <span className="text-sm">Support local businesses by purchasing this item</span>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button variant="outline" className="w-1/2">
                    <Heart className="mr-2 h-4 w-4" />
                    Save
                  </Button>
                  <Button className="w-1/2">
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Buy Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
