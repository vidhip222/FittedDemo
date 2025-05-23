"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus, Calendar, Clock, MapPin, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { toast } from "sonner"

interface Gift {
  id: string
  user_id: string
  recipient: string
  recipient_phone?: string
  item: string
  schedule: string
  next_delivery: string
  store: string
  status: "active" | "paused"
  delivery_address: string
  gift_type: string
  gift_message?: string
  created_at: string
}

export default function GiftsPage() {
  const [gifts, setGifts] = useState<Gift[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchGifts()
  }, [])

  const fetchGifts = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("No user found")

      const { data, error } = await supabase
        .from("gifts")
        .select("*")
        .eq("user_id", user.id)
        .order("next_delivery", { ascending: true })

      if (error) throw error
      setGifts(data || [])
    } catch (error) {
      console.error("Error fetching gifts:", error)
      toast.error("Failed to load gifts")
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (giftId: string, newStatus: "active" | "paused") => {
    try {
      const { error } = await supabase
        .from("gifts")
        .update({ status: newStatus })
        .eq("id", giftId)

      if (error) throw error

      setGifts(gifts.map(gift => 
        gift.id === giftId ? { ...gift, status: newStatus } : gift
      ))
      toast.success(`Gift ${newStatus === "active" ? "resumed" : "paused"}`)
    } catch (error) {
      console.error("Error updating gift status:", error)
      toast.error("Failed to update gift status")
    }
  }

  const handleDelete = async (giftId: string) => {
    try {
      const { error } = await supabase
        .from("gifts")
        .delete()
        .eq("id", giftId)

      if (error) throw error

      setGifts(gifts.filter(gift => gift.id !== giftId))
      toast.success("Gift deleted")
    } catch (error) {
      console.error("Error deleting gift:", error)
      toast.error("Failed to delete gift")
    }
  }

  const filteredGifts = searchQuery
    ? gifts.filter(
        (gift) =>
          gift.recipient.toLowerCase().includes(searchQuery.toLowerCase()) ||
          gift.item.toLowerCase().includes(searchQuery.toLowerCase()) ||
          gift.store.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : gifts

  if (loading) {
    return <div>Loading gifts...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Scheduled Gifts</h2>
          <p className="text-muted-foreground">Manage your recurring gifts and deliveries.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/gifts/schedule">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Schedule Gift
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search gifts..."
              className="w-full pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredGifts.map((gift) => (
          <Card key={gift.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  {gift.item} for {gift.recipient}
                </CardTitle>
                <Badge variant={gift.status === "active" ? "default" : "secondary"}>
                  {gift.status === "active" ? "Active" : "Paused"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{gift.schedule}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Next: {gift.next_delivery}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">From: {gift.store}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/dashboard/gifts/edit/${gift.id}`}>
                  Edit
                </Link>
              </Button>
              {gift.status === "active" ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusChange(gift.id, "paused")}
                >
                  Pause
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusChange(gift.id, "active")}
                >
                  Resume
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={() => handleDelete(gift.id)}
              >
                Cancel
              </Button>
            </CardFooter>
          </Card>
        ))}

        <Card className="flex flex-col items-center justify-center p-6 border-dashed">
          <div className="flex flex-col items-center justify-center space-y-2 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Plus className="h-6 w-6" />
            </div>
            <h3 className="font-medium">Schedule a New Gift</h3>
            <p className="text-sm text-muted-foreground">Set up recurring deliveries for someone special</p>
            <Link href="/dashboard/gifts/schedule">
              <Button variant="outline" className="mt-2">
                <Plus className="mr-2 h-4 w-4" />
                Add Gift
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}
