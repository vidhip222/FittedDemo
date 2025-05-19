import Link from "next/link"
import Image from "next/image"
import { Plus, Filter, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"

// Mock data for closet items
const closetItems = [
  { id: 1, name: "White T-Shirt", category: "tops", color: "white", price: 25.99 },
  { id: 2, name: "Blue Jeans", category: "bottoms", color: "blue", price: 59.99 },
  { id: 3, name: "Black Dress", category: "dresses", color: "black", price: 89.99 },
  { id: 4, name: "Leather Jacket", category: "outerwear", color: "brown", price: 149.99 },
  { id: 5, name: "Sneakers", category: "shoes", color: "white", price: 79.99 },
  { id: 6, name: "Gold Necklace", category: "accessories", color: "gold", price: 35.99 },
  { id: 7, name: "Striped Shirt", category: "tops", color: "multi", price: 29.99 },
  { id: 8, name: "Black Pants", category: "bottoms", color: "black", price: 49.99 },
  { id: 9, name: "Denim Jacket", category: "outerwear", color: "blue", price: 89.99 },
  { id: 10, name: "Ankle Boots", category: "shoes", color: "black", price: 119.99 },
  { id: 11, name: "Floral Dress", category: "dresses", color: "multi", price: 79.99 },
  { id: 12, name: "Silver Earrings", category: "accessories", color: "silver", price: 25.99 },
]

export default function ClosetPage() {
  // Sort items alphabetically by name
  const sortedItems = [...closetItems].sort((a, b) => a.name.localeCompare(b.name))

  // Filter items by category
  const getItemsByCategory = (category: string) => {
    return sortedItems.filter((item) => item.category === category)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">My Closet</h2>
          <p className="text-muted-foreground">Manage your wardrobe and see outfit suggestions.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/closet/add">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search your closet..." className="w-full pl-8" />
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
          <TabsTrigger value="tops">Tops</TabsTrigger>
          <TabsTrigger value="bottoms">Bottoms</TabsTrigger>
          <TabsTrigger value="dresses">Dresses</TabsTrigger>
          <TabsTrigger value="outerwear">Outerwear</TabsTrigger>
          <TabsTrigger value="shoes">Shoes</TabsTrigger>
          <TabsTrigger value="accessories">Accessories</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {sortedItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="aspect-square relative">
                    <Image
                      src={item.image_url || `/placeholder.svg?height=200&width=200&text=${item.name}`}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-2">
                    <h3 className="font-medium text-sm">{item.name}</h3>
                    <div className="flex justify-between">
                      <p className="text-xs text-muted-foreground capitalize">{item.category}</p>
                      {item.price && <p className="text-xs font-medium">${item.price.toFixed(2)}</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tops" className="mt-4">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {getItemsByCategory("tops").map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="aspect-square relative">
                    <Image
                      src={item.image_url || `/placeholder.svg?height=200&width=200&text=${item.name}`}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-2">
                    <h3 className="font-medium text-sm">{item.name}</h3>
                    <div className="flex justify-between">
                      <p className="text-xs text-muted-foreground capitalize">{item.category}</p>
                      {item.price && <p className="text-xs font-medium">${item.price.toFixed(2)}</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="bottoms" className="mt-4">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {getItemsByCategory("bottoms").map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="aspect-square relative">
                    <Image
                      src={item.image_url || `/placeholder.svg?height=200&width=200&text=${item.name}`}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-2">
                    <h3 className="font-medium text-sm">{item.name}</h3>
                    <div className="flex justify-between">
                      <p className="text-xs text-muted-foreground capitalize">{item.category}</p>
                      {item.price && <p className="text-xs font-medium">${item.price.toFixed(2)}</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="dresses" className="mt-4">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {getItemsByCategory("dresses").map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="aspect-square relative">
                    <Image
                      src={item.image_url || `/placeholder.svg?height=200&width=200&text=${item.name}`}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-2">
                    <h3 className="font-medium text-sm">{item.name}</h3>
                    <div className="flex justify-between">
                      <p className="text-xs text-muted-foreground capitalize">{item.category}</p>
                      {item.price && <p className="text-xs font-medium">${item.price.toFixed(2)}</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="outerwear" className="mt-4">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {getItemsByCategory("outerwear").map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="aspect-square relative">
                    <Image
                      src={item.image_url || `/placeholder.svg?height=200&width=200&text=${item.name}`}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-2">
                    <h3 className="font-medium text-sm">{item.name}</h3>
                    <div className="flex justify-between">
                      <p className="text-xs text-muted-foreground capitalize">{item.category}</p>
                      {item.price && <p className="text-xs font-medium">${item.price.toFixed(2)}</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="shoes" className="mt-4">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {getItemsByCategory("shoes").map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="aspect-square relative">
                    <Image
                      src={item.image_url || `/placeholder.svg?height=200&width=200&text=${item.name}`}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-2">
                    <h3 className="font-medium text-sm">{item.name}</h3>
                    <div className="flex justify-between">
                      <p className="text-xs text-muted-foreground capitalize">{item.category}</p>
                      {item.price && <p className="text-xs font-medium">${item.price.toFixed(2)}</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="accessories" className="mt-4">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {getItemsByCategory("accessories").map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="aspect-square relative">
                    <Image
                      src={item.image_url || `/placeholder.svg?height=200&width=200&text=${item.name}`}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-2">
                    <h3 className="font-medium text-sm">{item.name}</h3>
                    <div className="flex justify-between">
                      <p className="text-xs text-muted-foreground capitalize">{item.category}</p>
                      {item.price && <p className="text-xs font-medium">${item.price.toFixed(2)}</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
