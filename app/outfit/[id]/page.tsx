"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface Outfit {
  id: number
  name: string
  items: number
  vibe: string
  source: string
  saved: boolean
}

export default function SharedOutfitPage({ params }: { params: { id: string } }) {
  const [outfit, setOutfit] = useState<Outfit | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, this would fetch the outfit data from your backend
    // For now, we'll use mock data
    const mockOutfit = {
      id: parseInt(params.id),
      name: "Casual Friday",
      items: 4,
      vibe: "casual",
      source: "ai",
      saved: false,
    }
    setOutfit(mockOutfit)
    setLoading(false)
  }, [params.id])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!outfit) {
    return <div className="flex items-center justify-center min-h-screen">Outfit not found</div>
  }

  return (
    <div className="container mx-auto py-8">
      <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Link>
      
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-0">
          <div className="aspect-[4/3] relative">
            <Image
              src={`/placeholder.svg?height=600&width=800&text=${outfit.name}`}
              alt={outfit.name}
              fill
              className="object-cover"
            />
            {outfit.source === "ai" && (
              <div className="absolute top-4 right-4">
                <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                  AI Suggested
                </Badge>
              </div>
            )}
          </div>
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-2">{outfit.name}</h1>
            <p className="text-muted-foreground mb-4">{outfit.items} items</p>
            <div className="flex gap-2">
              <Badge variant="outline">{outfit.vibe}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 