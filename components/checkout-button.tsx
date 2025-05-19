"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { getStripe } from "@/lib/stripe"
import { toast } from "@/components/ui/use-toast"

interface CheckoutButtonProps {
  items: Array<{
    id: string | number
    name: string
    price: number
    description?: string
    imageUrl?: string
    quantity?: number
  }>
  className?: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
}

export function CheckoutButton({ items, className, variant = "default" }: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleCheckout = async () => {
    setIsLoading(true)

    try {
      const stripe = await getStripe()

      if (!stripe) {
        throw new Error("Stripe failed to initialize")
      }

      // Create a Stripe Checkout Session
      const { error } = await stripe.redirectToCheckout({
        lineItems: items.map((item) => ({
          price_data: {
            currency: "usd",
            product_data: {
              name: item.name,
              description: item.description || "",
              images: item.imageUrl ? [item.imageUrl] : [],
            },
            unit_amount: Math.round(item.price * 100), // Convert to cents
          },
          quantity: item.quantity || 1,
        })),
        mode: "payment",
        successUrl: `${window.location.origin}/checkout/success`,
        cancelUrl: `${window.location.origin}/checkout/cancel`,
      })

      if (error) {
        throw error
      }
    } catch (error) {
      console.error("Checkout error:", error)
      toast({
        title: "Checkout Error",
        description: "There was a problem with the checkout process. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleCheckout} disabled={isLoading} className={className} variant={variant}>
      {isLoading ? (
        "Processing..."
      ) : (
        <>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Checkout
        </>
      )}
    </Button>
  )
}
