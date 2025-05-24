"use client"

import { useState } from "react"
import { MapPin, Filter, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useNearbyStores, StoreType } from "@/lib/hooks/useNearbyStores"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

const STORE_TYPES: { value: StoreType; label: string }[] = [
  { value: "clothing_store", label: "Clothing Stores" },
  { value: "thrift_store", label: "Thrift Stores" },
  { value: "makeup_store", label: "Makeup Stores" },
  { value: "boutique", label: "Boutiques" },
  { value: "shoe_store", label: "Shoe Stores" },
  { value: "shopping_mall", label: "Malls" },
  { value: "department_store", label: "Department Stores" },
  { value: "jewelry_store", label: "Jewelry Stores" },
  { value: "accessories_store", label: "Accessories" },
  { value: "vintage_store", label: "Vintage Stores" }
]

export default function StoresPage() {
  const [view, setView] = useState<"list" | "map">("list")
  const [selectedTypes, setSelectedTypes] = useState<StoreType[]>([])
  const [maxDistance, setMaxDistance] = useState(10) // in kilometers
  const [showFilters, setShowFilters] = useState(false)

  const { stores, loading, error } = useNearbyStores({
    selectedTypes: selectedTypes.length > 0 ? selectedTypes : undefined,
    maxDistance,
  })

  const toggleStoreType = (type: StoreType) => {
    setSelectedTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    )
  }

  const clearFilters = () => {
    setSelectedTypes([])
    setMaxDistance(10)
  }

  const processedStores = stores?.map(store => ({
    ...store,
    formattedName: store?.name?.replace(/\s+/g, '-')?.toLowerCase() || ''
  })) || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Finding stores near you...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-destructive">{error}</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Nearby Stores</h2>
          <p className="text-muted-foreground">
            {stores.length} stores found near your location
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
            {selectedTypes.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {selectedTypes.length}
              </Badge>
            )}
          </Button>
          <Tabs defaultValue="list" onValueChange={(v) => setView(v as "list" | "map")}>
            <TabsList>
              <TabsTrigger value="list">List View</TabsTrigger>
              <TabsTrigger value="map">Map View</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {showFilters && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Filters</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Clear All
              </Button>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Store Types</Label>
                <div className="grid grid-cols-2 gap-2">
                  {STORE_TYPES.map((type) => (
                    <div key={type.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={type.value}
                        checked={selectedTypes.includes(type.value)}
                        onCheckedChange={() => toggleStoreType(type.value)}
                      />
                      <Label htmlFor={type.value}>{type.label}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Maximum Distance: {maxDistance} km</Label>
                <Slider
                  value={[maxDistance]}
                  onValueChange={([value]) => setMaxDistance(value)}
                  min={1}
                  max={20}
                  step={1}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {view === "list" ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {processedStores.map((store) => (
            <Card key={store.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">{store.name}</h3>
                    <Badge variant="secondary">
                      {store?.type?.replace(/_/g, ' ') || 'store'}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{store.address}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {(store?.distance ?? 0).toFixed(1)} km away
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => {
                        window.open(
                          `https://www.openstreetmap.org/?mlat=${store.lat}&mlon=${store.lon}&zoom=15`,
                          '_blank'
                        )
                      }}
                    >
                      View on Map
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="aspect-[16/9] relative rounded-lg overflow-hidden">
          <iframe
            className="w-full h-full"
            frameBorder="0"
            scrolling="no"
            marginHeight={0}
            marginWidth={0}
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${stores[0]?.lon - 0.01},${stores[0]?.lat - 0.01},${stores[0]?.lon + 0.01},${stores[0]?.lat + 0.01}&layer=mapnik&marker=${stores[0]?.lat},${stores[0]?.lon}`}
          />
        </div>
      )}
    </div>
  )
}
