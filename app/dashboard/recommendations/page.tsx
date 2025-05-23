"use client"

import { useState, Suspense } from "react"
import { Search, Filter, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useRecommendations } from "@/lib/hooks/useRecommendations"
import { Skeleton } from "@/components/ui/skeleton"

const CLOTHING_TYPES = [
  "clothing",
  "dresses",
  "tops",
  "pants",
  "shoes",
  "accessories",
  "jewelry",
  "bags",
]

function ProductGrid({ products, loading }: { products: any[], loading: boolean }) {
  if (loading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <Skeleton className="h-48 w-full" />
              <div className="mt-4 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No products found. Try a different search.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <Card key={product.link}>
          <CardContent className="p-4">
            <div className="aspect-square overflow-hidden rounded-lg">
              <img
                src={product.thumbnail}
                alt={product.title}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="mt-4 space-y-2">
              <h3 className="font-medium line-clamp-2">{product.title}</h3>
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold">{product.price}</p>
                {product.rating && (
                  <p className="text-sm text-muted-foreground">
                    ★ {product.rating} ({product.reviews} reviews)
                  </p>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {product.source}
              </p>
              {product.shipping && (
                <p className="text-sm text-muted-foreground">
                  {product.shipping}
                </p>
              )}
              <Button
                variant="outline"
                className="w-full"
                asChild
              >
                <a
                  href={product.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Product
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function RecommendationsPage() {
  const {
    products,
    loading,
    error,
    query,
    setQuery,
    type,
    setType,
  } = useRecommendations()

  const [searchInput, setSearchInput] = useState(query)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setQuery(searchInput)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Fashion Recommendations</h2>
        <p className="text-muted-foreground">
          Discover trending fashion items and get personalized recommendations
        </p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <form onSubmit={handleSearch} className="flex-1">
          <div className="flex gap-2">
            <Input
              placeholder="Search for fashion items..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={loading}>
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </form>

        <Select value={type} onValueChange={setType} disabled={loading}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            {CLOTHING_TYPES.map((clothingType) => (
              <SelectItem key={clothingType} value={clothingType}>
                {clothingType.charAt(0).toUpperCase() + clothingType.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {error && (
        <div className="rounded-lg bg-destructive/15 p-4 text-destructive">
          {error}
        </div>
      )}

      <Suspense fallback={<div>Loading...</div>}>
        <ProductGrid products={products} loading={loading} />
      </Suspense>
    </div>
  )
} 