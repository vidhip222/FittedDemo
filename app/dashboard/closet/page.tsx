"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { createClient } from "@supabase/supabase-js"

interface ClosetItem {
  id: string
  name: string
  category: string
  color: string
  brand: string
  size: string
  image_url: string
}

export default function ClosetPage() {
  const [closetItems, setClosetItems] = useState<ClosetItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const fetchClosetItems = async () => {
    try {
      const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
      const { data, error } = await supabase.from("closet_items").select("*")

      if (error) throw error
      setClosetItems(data || [])
    } catch (error) {
      console.error("Error fetching closet items:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
      const { error } = await supabase.from("closet_items").delete().eq("id", id)

      if (error) throw error
      setClosetItems(closetItems.filter((item) => item.id !== id))
    } catch (error) {
      console.error("Error deleting item:", error)
    }
  }

  useEffect(() => {
    fetchClosetItems()
  }, [])

  const filteredItems = closetItems.filter((item) => {
    const matchesSearch = searchQuery === "" || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.color.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">My Closet</h2>
          <p className="text-muted-foreground">Manage your virtual wardrobe</p>
        </div>
        <Link href="/dashboard/closet/add">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <Input 
          placeholder="Search your closet..." 
          className="max-w-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Tabs defaultValue="all" className="w-full" onValueChange={setSelectedCategory}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="tops">Tops</TabsTrigger>
            <TabsTrigger value="bottoms">Bottoms</TabsTrigger>
            <TabsTrigger value="dresses">Dresses</TabsTrigger>
            <TabsTrigger value="outerwear">Outerwear</TabsTrigger>
            <TabsTrigger value="shoes">Shoes</TabsTrigger>
            <TabsTrigger value="accessories">Accessories</TabsTrigger>
          </TabsList>
          
          <TabsContent value={selectedCategory}>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredItems.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="relative aspect-square overflow-hidden rounded-md">
                      <img src={item.image_url} alt={item.name} className="h-full w-full object-cover" />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete item</span>
                      </Button>
                    </div>
                    <div className="mt-4 space-y-1">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {item.brand} • {item.color} • {item.size}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
