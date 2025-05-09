"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Search, MapPin, Filter, ShoppingBag, Clock, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"

export default function StoreSearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStore, setSelectedStore] = useState<string | null>(null)
  const [selectedItem, setSelectedItem] = useState<any | null>(null)
  const [deliveryTime, setDeliveryTime] = useState<string>("30-45 min")
  const [deliveryFee, setDeliveryFee] = useState<string>("$4.99")

  // Mock data for search results
  const searchResults = [
    {
      id: 1,
      name: "White T-Shirt",
      price: 24.99,
      store: "Urban Outfitters",
      distance: "0.5 miles",
      image: "/placeholder.svg?height=200&width=200&text=White+T-Shirt",
      inStock: true,
      deliveryEligible: true,
    },
    {
      id: 2,
      name: "Black Jeans",
      price: 59.99,
      store: "Madewell",
      distance: "1.2 miles",
      image: "/placeholder.svg?height=200&width=200&text=Black+Jeans",
      inStock: true,
      deliveryEligible: true,
    },
    {
      id: 3,
      name: "Denim Jacket",
      price: 79.99,
      store: "Zara",
      distance: "2.5 miles",
      image: "/placeholder.svg?height=200&width=200&text=Denim+Jacket",
      inStock: true,
      deliveryEligible: true,
    },
    {
      id: 4,
      name: "Floral Dress",
      price: 45.99,
      store: "H&M",
      distance: "1.5 miles",
      image: "/placeholder.svg?height=200&width=200&text=Floral+Dress",
      inStock: false,
      deliveryEligible: false,
    },
    {
      id: 5,
      name: "Leather Boots",
      price: 120.0,
      store: "Aldo",
      distance: "3.0 miles",
      image: "/placeholder.svg?height=200&width=200&text=Leather+Boots",
      inStock: true,
      deliveryEligible: true,
    },
    {
      id: 6,
      name: "Gold Necklace",
      price: 35.0,
      store: "Urban Outfitters",
      distance: "0.5 miles",
      image: "/placeholder.svg?height=200&width=200&text=Gold+Necklace",
      inStock: true,
      deliveryEligible: true,
    },
  ]

  // Filter results based on search query
  const filteredResults = searchQuery
    ? searchResults.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.store.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : searchResults

  const handleItemSelect = (item: any) => {
    setSelectedItem(item)
    setSelectedStore(item.store)
  }

  const handleCheckout = () => {
    // In a real app, this would initiate the delivery process
    alert(
      `Your order for ${selectedItem?.name} from ${selectedStore} has been placed! Estimated delivery: ${deliveryTime}`,
    )
    setSelectedItem(null)
    setSelectedStore(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/stores">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Search Nearby Items</h2>
          <p className="text-muted-foreground">Find and get items delivered from local stores</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search for items or stores..."
              className="w-full pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
          <span className="sr-only">Filter</span>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className={`w-full ${selectedItem ? "md:w-2/3" : "md:w-full"}`}>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All Items</TabsTrigger>
              <TabsTrigger value="delivery">Delivery Available</TabsTrigger>
              <TabsTrigger value="instock">In Stock</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredResults.map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="aspect-square relative">
                        <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                        {!item.inStock && (
                          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                            <Badge variant="outline" className="bg-background">
                              Out of Stock
                            </Badge>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm font-bold mt-1">${item.price.toFixed(2)}</p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <MapPin className="mr-1 h-4 w-4" />
                            {item.store} ({item.distance})
                          </div>
                          {item.deliveryEligible && (
                            <Badge variant="secondary">
                              <Truck className="h-3 w-3 mr-1" />
                              Delivery
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <Button
                        className="w-full"
                        disabled={!item.inStock || !item.deliveryEligible}
                        onClick={() => handleItemSelect(item)}
                      >
                        {item.inStock && item.deliveryEligible ? "Get It Delivered" : "Not Available"}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="delivery" className="mt-4">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredResults
                  .filter((item) => item.deliveryEligible)
                  .map((item) => (
                    <Card key={item.id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="aspect-square relative">
                          <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                          {!item.inStock && (
                            <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                              <Badge variant="outline" className="bg-background">
                                Out of Stock
                              </Badge>
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm font-bold mt-1">${item.price.toFixed(2)}</p>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center text-sm text-muted-foreground">
                              <MapPin className="mr-1 h-4 w-4" />
                              {item.store} ({item.distance})
                            </div>
                            <Badge variant="secondary">
                              <Truck className="h-3 w-3 mr-1" />
                              Delivery
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 pt-0">
                        <Button className="w-full" disabled={!item.inStock} onClick={() => handleItemSelect(item)}>
                          {item.inStock ? "Get It Delivered" : "Out of Stock"}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            </TabsContent>
            <TabsContent value="instock" className="mt-4">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredResults
                  .filter((item) => item.inStock)
                  .map((item) => (
                    <Card key={item.id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="aspect-square relative">
                          <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                        </div>
                        <div className="p-4">
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm font-bold mt-1">${item.price.toFixed(2)}</p>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center text-sm text-muted-foreground">
                              <MapPin className="mr-1 h-4 w-4" />
                              {item.store} ({item.distance})
                            </div>
                            {item.deliveryEligible && (
                              <Badge variant="secondary">
                                <Truck className="h-3 w-3 mr-1" />
                                Delivery
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 pt-0">
                        <Button
                          className="w-full"
                          disabled={!item.deliveryEligible}
                          onClick={() => handleItemSelect(item)}
                        >
                          {item.deliveryEligible ? "Get It Delivered" : "In-Store Only"}
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
                <h3 className="text-xl font-bold">Delivery Details</h3>

                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 relative rounded overflow-hidden">
                      <Image
                        src={selectedItem.image || "/placeholder.svg"}
                        alt={selectedItem.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium">{selectedItem.name}</h4>
                      <p className="text-sm text-muted-foreground">{selectedItem.store}</p>
                      <p className="text-sm font-bold">${selectedItem.price.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Delivery Address</Label>
                    <Select defaultValue="home">
                      <SelectTrigger>
                        <SelectValue placeholder="Select address" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="home">Home: 123 Main St, Apt 4B</SelectItem>
                        <SelectItem value="work">Work: 456 Market St, Suite 200</SelectItem>
                        <SelectItem value="other">Other: 789 Park Ave</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Delivery Speed</Label>
                      <span className="text-sm font-medium">{deliveryTime}</span>
                    </div>
                    <Slider
                      defaultValue={[1]}
                      max={2}
                      step={1}
                      onValueChange={(value) => {
                        if (value[0] === 0) {
                          setDeliveryTime("15-30 min")
                          setDeliveryFee("$7.99")
                        } else if (value[0] === 1) {
                          setDeliveryTime("30-45 min")
                          setDeliveryFee("$4.99")
                        } else {
                          setDeliveryTime("45-60 min")
                          setDeliveryFee("$2.99")
                        }
                      }}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Express</span>
                      <span>Standard</span>
                      <span>Economy</span>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t">
                    <div className="flex justify-between">
                      <span className="text-sm">Item Subtotal</span>
                      <span className="text-sm">${selectedItem.price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Delivery Fee</span>
                      <span className="text-sm">{deliveryFee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Tax</span>
                      <span className="text-sm">${(selectedItem.price * 0.0825).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>
                        $
                        {(
                          selectedItem.price +
                          Number.parseFloat(deliveryFee.replace("$", "")) +
                          selectedItem.price * 0.0825
                        ).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Estimated delivery: Today, {deliveryTime}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" className="w-1/3" onClick={() => setSelectedItem(null)}>
                    Cancel
                  </Button>
                  <Button className="w-2/3" onClick={handleCheckout}>
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Place Order
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

// Helper component for the delivery form
function Label({ children }: { children: React.ReactNode }) {
  return <div className="text-sm font-medium mb-1.5">{children}</div>
}
