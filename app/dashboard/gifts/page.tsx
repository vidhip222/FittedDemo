import Link from "next/link"
import { Plus, Calendar, Clock, MapPin, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function GiftsPage() {
  // Mock data for scheduled gifts
  const gifts = [
    {
      id: 1,
      recipient: "Sarah",
      item: "Boba Tea",
      schedule: "Every Friday at 5:00 PM",
      nextDelivery: "Friday, May 12, 2023",
      store: "Boba Guys",
      status: "active",
    },
    {
      id: 2,
      recipient: "Mom",
      item: "Flowers",
      schedule: "Monthly on the 15th",
      nextDelivery: "Monday, May 15, 2023",
      store: "Bloom & Wild",
      status: "active",
    },
    {
      id: 3,
      recipient: "David",
      item: "Coffee",
      schedule: "Every Monday at 9:00 AM",
      nextDelivery: "Monday, May 15, 2023",
      store: "Blue Bottle Coffee",
      status: "paused",
    },
  ]

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
            <Input type="search" placeholder="Search gifts..." className="w-full pl-8" />
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {gifts.map((gift) => (
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
                  <span className="text-sm">Next: {gift.nextDelivery}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">From: {gift.store}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-2 flex justify-between">
              <Button variant="outline" size="sm">
                Edit
              </Button>
              {gift.status === "active" ? (
                <Button variant="outline" size="sm">
                  Pause
                </Button>
              ) : (
                <Button variant="outline" size="sm">
                  Resume
                </Button>
              )}
              <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
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
