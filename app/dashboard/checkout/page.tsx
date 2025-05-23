"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { loadStripe } from "@stripe/stripe-js"
import { Truck, Store, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface CheckoutItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [deliveryMethod, setDeliveryMethod] = useState<"store" | "doordash">("store")
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    zip: "",
  })

  // Mock cart items - replace with actual cart data
  const items: CheckoutItem[] = [
    {
      id: "1",
      name: "Blue Denim Jacket",
      price: 89.99,
      quantity: 1,
      image: "/placeholder.jpg",
    },
  ]

  const handleCheckout = async () => {
    try {
      setLoading(true)

      // Create checkout session
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          deliveryMethod,
          address,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create checkout session")
      }

      const { sessionId } = await response.json()

      // Redirect to Stripe Checkout
      const stripe = await stripePromise
      const { error } = await stripe!.redirectToCheckout({ sessionId })

      if (error) {
        throw error
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to process checkout. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Checkout</h2>
        <p className="text-muted-foreground">Complete your purchase</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Delivery Method</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <RadioGroup
              value={deliveryMethod}
              onValueChange={(value) => setDeliveryMethod(value as "store" | "doordash")}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="store" id="store" />
                <Label htmlFor="store" className="flex items-center gap-2">
                  <Store className="h-4 w-4" />
                  Pick up from store
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="doordash" id="doordash" />
                <Label htmlFor="doordash" className="flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  DoorDash Delivery (+$5.99)
                </Label>
              </div>
            </RadioGroup>

            {deliveryMethod === "doordash" && (
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="street">Street Address</Label>
                  <Input
                    id="street"
                    value={address.street}
                    onChange={(e) => setAddress({ ...address, street: e.target.value })}
                    placeholder="123 Main St"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      placeholder="City"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value })}
                      placeholder="State"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zip">ZIP Code</Label>
                  <Input
                    id="zip"
                    value={address.zip}
                    onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                    placeholder="ZIP Code"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-md bg-muted" />
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                </div>
                <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}

            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground">Subtotal</p>
                <p>${items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}</p>
              </div>
              {deliveryMethod === "doordash" && (
                <div className="flex items-center justify-between">
                  <p className="text-muted-foreground">Delivery Fee</p>
                  <p>$5.99</p>
                </div>
              )}
              <div className="flex items-center justify-between font-medium">
                <p>Total</p>
                <p>
                  $
                  {(
                    items.reduce((sum, item) => sum + item.price * item.quantity, 0) +
                    (deliveryMethod === "doordash" ? 5.99 : 0)
                  ).toFixed(2)}
                </p>
              </div>
            </div>

            <Button
              className="w-full"
              onClick={handleCheckout}
              disabled={loading || (deliveryMethod === "doordash" && !address.street)}
            >
              <CreditCard className="mr-2 h-4 w-4" />
              {loading ? "Processing..." : "Proceed to Payment"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 