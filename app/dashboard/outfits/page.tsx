"use client"

import { useState } from "react"
import Image from "next/image"
import { Heart, Share2, ShoppingCart, Filter, Search, CreditCard, Truck, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

// Mock data for outfits
const outfits = [
  { id: 1, name: "Casual Friday", items: 4, vibe: "casual", source: "ai", price: 149.99 },
  { id: 2, name: "Weekend Brunch", items: 3, vibe: "casual", source: "ai", price: 129.99 },
  { id: 3, name: "Date Night", items: 5, vibe: "dressy", source: "ai", price: 199.99 },
  { id: 4, name: "Office Chic", items: 4, vibe: "work", source: "ai", price: 179.99 },
  { id: 5, name: "Summer Festival", items: 6, vibe: "casual", source: "saved", price: 159.99 },
  { id: 6, name: "Dinner Party", items: 5, vibe: "dressy", source: "saved", price: 189.99 },
  { id: 7, name: "Beach Day", items: 4, vibe: "casual", source: "saved", price: 119.99 },
  { id: 8, name: "Job Interview", items: 3, vibe: "work", source: "saved", price: 249.99 },
]

export default function OutfitsPage() {
  const [savedOutfits, setSavedOutfits] = useState<number[]>([5, 6, 7, 8])
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [selectedOutfit, setSelectedOutfit] = useState<any>(null)
  const [paymentProcessing, setPaymentProcessing] = useState(false)
  const [paymentComplete, setPaymentComplete] = useState(false)
  const { toast } = useToast()

  const handleSaveOutfit = (outfitId: number) => {
    if (savedOutfits.includes(outfitId)) {
      setSavedOutfits(savedOutfits.filter((id) => id !== outfitId))
      toast({
        title: "Outfit removed",
        description: "Outfit has been removed from your saved collection",
      })
    } else {
      setSavedOutfits([...savedOutfits, outfitId])
      toast({
        title: "Outfit saved",
        description: "Outfit has been added to your saved collection",
      })
    }
  }

  const handleShopOutfit = (outfit: any) => {
    setSelectedOutfit(outfit)
    setShowPaymentDialog(true)
    setPaymentComplete(false)
  }

  const handlePayment = () => {
    setPaymentProcessing(true)
    // Simulate payment processing
    setTimeout(() => {
      setPaymentProcessing(false)
      setPaymentComplete(true)
      // Simulate order processing
      setTimeout(() => {
        setShowPaymentDialog(false)
        toast({
          title: "Order placed successfully!",
          description: `Your ${selectedOutfit.name} outfit will be delivered soon.`,
        })
      }, 2000)
    }, 2000)
  }

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
                      <div className="flex justify-between">
                        <p className="text-sm text-muted-foreground">{outfit.items} items</p>
                        <p className="text-sm font-medium">${outfit.price.toFixed(2)}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-2 border-t flex justify-between">
                    <Button variant="ghost" size="sm" onClick={() => handleSaveOutfit(outfit.id)}>
                      <Heart
                        className={`h-4 w-4 mr-1 ${savedOutfits.includes(outfit.id) ? "text-red-500 fill-red-500" : ""}`}
                      />
                      {savedOutfits.includes(outfit.id) ? "Saved" : "Save"}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleShopOutfit(outfit)}>
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
              .filter((outfit) => savedOutfits.includes(outfit.id))
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
                      <div className="flex justify-between">
                        <p className="text-sm text-muted-foreground">{outfit.items} items</p>
                        <p className="text-sm font-medium">${outfit.price.toFixed(2)}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-2 border-t flex justify-between">
                    <Button variant="ghost" size="sm" onClick={() => handleSaveOutfit(outfit.id)}>
                      <Heart className="h-4 w-4 mr-1 text-red-500" fill="currentColor" />
                      Saved
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleShopOutfit(outfit)}>
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
                    <div className="flex justify-between">
                      <p className="text-sm text-muted-foreground">{outfit.items} items</p>
                      <p className="text-sm font-medium">${outfit.price.toFixed(2)}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-2 border-t flex justify-between">
                  <Button variant="ghost" size="sm" onClick={() => handleSaveOutfit(outfit.id)}>
                    {savedOutfits.includes(outfit.id) ? (
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
                  <Button variant="ghost" size="sm" onClick={() => handleShopOutfit(outfit)}>
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

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{paymentComplete ? "Order Confirmed!" : "Complete Your Purchase"}</DialogTitle>
            <DialogDescription>
              {paymentComplete
                ? "Your order has been placed successfully."
                : `Purchase the ${selectedOutfit?.name} outfit for $${selectedOutfit?.price?.toFixed(2)}`}
            </DialogDescription>
          </DialogHeader>

          {paymentComplete ? (
            <div className="space-y-4 py-4">
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <Check className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-medium">Payment Successful</h3>
                <p className="text-center text-sm text-muted-foreground">
                  Your order has been placed and will be processed immediately.
                </p>
              </div>

              <div className="rounded-lg border p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Order Number:</span>
                  <span className="text-sm">#ORD-{Math.floor(Math.random() * 10000)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Estimated Delivery:</span>
                  <span className="text-sm">2-3 business days</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                  <Truck className="h-4 w-4" />
                  <span>We'll notify you when your order ships</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Order Summary</h3>
                <div className="rounded-lg border p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">
                      {selectedOutfit?.name} ({selectedOutfit?.items} items)
                    </span>
                    <span className="text-sm font-medium">${selectedOutfit?.price?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Shipping</span>
                    <span className="text-sm">$9.99</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Tax</span>
                    <span className="text-sm">${(selectedOutfit?.price * 0.08).toFixed(2) || "0.00"}</span>
                  </div>
                  <div className="border-t my-2"></div>
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>
                      ${((selectedOutfit?.price || 0) + 9.99 + (selectedOutfit?.price || 0) * 0.08).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Payment Method</h3>
                <div className="rounded-lg border p-4 flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                  <span>Credit Card ending in 4242</span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Delivery Address</h3>
                <div className="rounded-lg border p-4">
                  <p className="text-sm">123 Main Street</p>
                  <p className="text-sm">Apt 4B</p>
                  <p className="text-sm">San Francisco, CA 94105</p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            {paymentComplete ? (
              <Button onClick={() => setShowPaymentDialog(false)}>Close</Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handlePayment} disabled={paymentProcessing}>
                  {paymentProcessing ? "Processing..." : "Complete Purchase"}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
