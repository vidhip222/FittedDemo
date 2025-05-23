"use client"

import { use } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Calendar, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase"

interface CollectionItem {
  id: string
  name: string
  category: string
  color: string
  brand: string
  size: string
  image_url: string
  price: number
}

interface Collection {
  id: number
  title: string
  description: string
  date: string
  itemCount: number
  image: string
  new: boolean
  items: CollectionItem[]
}

// Mock data for collections
const mockCollections: Record<string, Collection> = {
  "1": {
    id: 1,
    title: "Summer Essentials",
    description: "Beat the heat with these cool summer picks",
    date: "May 10, 2025",
    itemCount: 12,
    image: "/placeholder.svg?height=300&width=600&text=Summer+Essentials",
    new: true,
    items: [
      {
        id: "1",
        name: "Linen Button-Up Shirt",
        category: "tops",
        color: "white",
        brand: "Everlane",
        size: "M",
        image_url: "/placeholder.svg?height=300&width=300&text=Shirt",
        price: 78.00
      },
      {
        id: "2",
        name: "Cotton Shorts",
        category: "bottoms",
        color: "khaki",
        brand: "Uniqlo",
        size: "32",
        image_url: "/placeholder.svg?height=300&width=300&text=Shorts",
        price: 39.90
      }
    ]
  }
}

export default function CollectionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const collection = mockCollections[id]

  if (!collection) {
    return <div>Collection not found</div>
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/drops">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Drops
          </Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{collection.title}</h2>
          <p className="text-muted-foreground">{collection.description}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {collection.items.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="aspect-square relative">
                <Image
                  src={item.image_url}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{item.name}</h3>
                  <Badge variant="outline">{item.category}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {item.brand} • {item.color} • {item.size}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-lg font-semibold">${item.price.toFixed(2)}</p>
                  <Button 
                    className="bg-primary hover:bg-primary/90"
                    asChild
                  >
                    <Link href={`/checkout?item=${item.id}`}>
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Buy Now
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 