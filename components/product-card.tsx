"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Heart } from "lucide-react"
import { useCart, type CartItem } from "@/components/cart/cart-provider"
import { useToast } from "@/hooks/use-toast"

interface ProductCardProps {
  product: {
    id: string | number
    name: string
    price: number
    description?: string
    imageUrl?: string
    category?: string
  }
}

export function ProductCard({ product }: ProductCardProps) {
  const [isSaved, setIsSaved] = useState(false)
  const { addItem } = useCart()
  const { toast } = useToast()

  const handleAddToCart = () => {
    const cartItem: CartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description,
      imageUrl: product.imageUrl,
      quantity: 1,
      category: product.category,
    }

    addItem(cartItem)

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  const toggleSave = () => {
    setIsSaved(!isSaved)

    toast({
      title: isSaved ? "Removed from saved items" : "Saved for later",
      description: isSaved
        ? `${product.name} has been removed from your saved items.`
        : `${product.name} has been saved for later.`,
    })
  }

  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-square">
        <Image
          src={product.imageUrl || `/placeholder.svg?height=300&width=300&text=${product.name}`}
          alt={product.name}
          fill
          className="object-cover"
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-white/80 hover:bg-white/90 rounded-full"
          onClick={toggleSave}
        >
          <Heart className={`h-5 w-5 ${isSaved ? "fill-red-500 text-red-500" : ""}`} />
        </Button>
      </div>
      <CardContent className="p-4">
        <h3 className="font-medium truncate">{product.name}</h3>
        <p className="text-sm text-muted-foreground truncate">{product.description}</p>
        <p className="font-medium mt-2">${product.price.toFixed(2)}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full" onClick={handleAddToCart}>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  )
}
