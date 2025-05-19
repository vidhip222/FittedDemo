import { CardFooter } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { MapPin, Star, Search, Filter, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StoreLocator } from "@/components/store-locator"

export default function StoresPage() {
  // Mock data for stores
  const stores = [
    {
      id: 1,
      name: "Urban Outfitters",
      distance: "0.5 miles",
      rating: 4.2,
      category: "clothing",
      address: "123 Main St, San Francisco, CA",
      matches: 12,
      featured: true,
    },
    {
      id: 2,
      name: "Madewell",
      distance: "1.2 miles",
      rating: 4.5,
      category: "clothing",
      address: "456 Market St, San Francisco, CA",
      matches: 8,
      featured: false,
    },
    {
      id: 3,
      name: "Zara",
      distance: "2.5 miles",
      rating: 4.0,
      category: "clothing",
      address: "789 Mission St, San Francisco, CA",
      matches: 15,
      featured: true,
    },
    {
      id: 4,
      name: "Local Thrift",
      distance: "3.1 miles",
      rating: 4.7,
      category: "thrift",
      address: "101 Valencia St, San Francisco, CA",
      matches: 20,
      featured: false,
    },
    {
      id: 5,
      name: "Sephora",
      distance: "0.8 miles",
      rating: 4.3,
      category: "beauty",
      address: "222 Powell St, San Francisco, CA",
      matches: 5,
      featured: false,
    },
    {
      id: 6,
      name: "H&M",
      distance: "1.5 miles",
      rating: 3.9,
      category: "clothing",
      address: "333 Geary St, San Francisco, CA",
      matches: 10,
      featured: false,
    },
  ]

  return (
    <div className="container py-6 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Store Locator</h1>
        <p className="text-muted-foreground">Find clothing stores near you and discover local fashion.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Find Nearby Stores</CardTitle>
          <CardDescription>Search for clothing stores in your area or any location.</CardDescription>
        </CardHeader>
        <CardContent>
          <StoreLocator />
        </CardContent>
      </Card>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Nearby Stores</h2>
          <p className="text-muted-foreground">Discover local stores with items matching your style.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/stores/search">
            <Button>
              <Truck className="mr-2 h-4 w-4" />
              Search & Deliver
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search stores or locations..." className="w-full pl-8" />
          </div>
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
          <span className="sr-only">Filter</span>
        </Button>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="clothing">Clothing</TabsTrigger>
          <TabsTrigger value="thrift">Thrift</TabsTrigger>
          <TabsTrigger value="beauty">Beauty</TabsTrigger>
          <TabsTrigger value="featured">Featured</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {stores.map((store) => (
              <Card key={store.id}>
                <CardContent className="p-0">
                  <div className="aspect-[16/9] relative">
                    <Image
                      src={`/placeholder.svg?height=225&width=400&text=${store.name}`}
                      alt={store.name}
                      fill
                      className="object-cover"
                    />
                    {store.featured && (
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-primary text-primary-foreground">Featured</Badge>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{store.name}</h3>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        <span className="ml-1 text-sm">{store.rating}</span>
                      </div>
                    </div>
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="mr-1 h-4 w-4" />
                        {store.distance} away
                      </div>
                      <p className="text-sm text-muted-foreground">{store.address}</p>
                      <p className="text-sm font-medium text-primary">{store.matches} items match your style</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex justify-between">
                  <Button variant="outline" size="sm">
                    View Items
                  </Button>
                  <Link href="/dashboard/stores/search">
                    <Button variant="outline" size="sm">
                      <Truck className="mr-1 h-4 w-4" />
                      Get Delivery
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="clothing" className="mt-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {stores
              .filter((store) => store.category === "clothing")
              .map((store) => (
                <Card key={store.id}>
                  <CardContent className="p-0">
                    <div className="aspect-[16/9] relative">
                      <Image
                        src={`/placeholder.svg?height=225&width=400&text=${store.name}`}
                        alt={store.name}
                        fill
                        className="object-cover"
                      />
                      {store.featured && (
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-primary text-primary-foreground">Featured</Badge>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{store.name}</h3>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                          <span className="ml-1 text-sm">{store.rating}</span>
                        </div>
                      </div>
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="mr-1 h-4 w-4" />
                          {store.distance} away
                        </div>
                        <p className="text-sm text-muted-foreground">{store.address}</p>
                        <p className="text-sm font-medium text-primary">{store.matches} items match your style</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex justify-between">
                    <Button variant="outline" size="sm">
                      View Items
                    </Button>
                    <Link href="/dashboard/stores/search">
                      <Button variant="outline" size="sm">
                        <Truck className="mr-1 h-4 w-4" />
                        Get Delivery
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>
        {/* Similar TabsContent for other categories */}
      </Tabs>
    </div>
  )
}
