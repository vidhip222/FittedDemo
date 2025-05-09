"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock, MapPin, User, Gift, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function ScheduleGiftPage() {
  const [loading, setLoading] = useState(false)
  const [frequency, setFrequency] = useState("once")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      window.location.href = "/dashboard/gifts"
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/gifts">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Schedule a Gift</h2>
          <p className="text-muted-foreground">Set up a one-time or recurring gift delivery</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Recipient Details</CardTitle>
            <CardDescription>Who are you sending this gift to?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recipient-name">Recipient Name</Label>
              <div className="relative">
                <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input id="recipient-name" placeholder="e.g., Sarah" className="pl-8" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="recipient-phone">Recipient Phone (Optional)</Label>
              <Input id="recipient-phone" placeholder="e.g., (555) 123-4567" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="delivery-address">Delivery Address</Label>
              <div className="relative">
                <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input id="delivery-address" placeholder="e.g., 123 Main St, Apt 4B" className="pl-8" required />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gift Details</CardTitle>
            <CardDescription>What would you like to send?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="gift-type">Gift Type</Label>
              <div className="relative">
                <Gift className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Select required>
                  <SelectTrigger id="gift-type" className="pl-8">
                    <SelectValue placeholder="Select a gift type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="flowers">Flowers</SelectItem>
                    <SelectItem value="food">Food</SelectItem>
                    <SelectItem value="drinks">Drinks</SelectItem>
                    <SelectItem value="clothing">Clothing</SelectItem>
                    <SelectItem value="accessories">Accessories</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gift-item">Specific Item</Label>
              <Input id="gift-item" placeholder="e.g., Boba Tea, Roses, etc." required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gift-store">Store/Vendor</Label>
              <Select required>
                <SelectTrigger id="gift-store">
                  <SelectValue placeholder="Select a store" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="boba-guys">Boba Guys</SelectItem>
                  <SelectItem value="bloom-wild">Bloom & Wild</SelectItem>
                  <SelectItem value="blue-bottle">Blue Bottle Coffee</SelectItem>
                  <SelectItem value="sephora">Sephora</SelectItem>
                  <SelectItem value="zara">Zara</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gift-message">Gift Message (Optional)</Label>
              <div className="relative">
                <MessageSquare className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Textarea id="gift-message" placeholder="Add a personal message..." className="pl-8 min-h-[100px]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Delivery Schedule</CardTitle>
            <CardDescription>When should this gift be delivered?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Frequency</Label>
              <RadioGroup defaultValue="once" onValueChange={setFrequency}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="once" id="once" />
                  <Label htmlFor="once">One-time delivery</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="weekly" id="weekly" />
                  <Label htmlFor="weekly">Weekly</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="monthly" id="monthly" />
                  <Label htmlFor="monthly">Monthly</Label>
                </div>
              </RadioGroup>
            </div>

            {frequency === "once" && (
              <div className="space-y-2">
                <Label htmlFor="delivery-date">Delivery Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input id="delivery-date" type="date" className="pl-8" required />
                </div>
              </div>
            )}

            {frequency === "weekly" && (
              <div className="space-y-2">
                <Label htmlFor="delivery-day">Day of Week</Label>
                <Select required>
                  <SelectTrigger id="delivery-day">
                    <SelectValue placeholder="Select day" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monday">Monday</SelectItem>
                    <SelectItem value="tuesday">Tuesday</SelectItem>
                    <SelectItem value="wednesday">Wednesday</SelectItem>
                    <SelectItem value="thursday">Thursday</SelectItem>
                    <SelectItem value="friday">Friday</SelectItem>
                    <SelectItem value="saturday">Saturday</SelectItem>
                    <SelectItem value="sunday">Sunday</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {frequency === "monthly" && (
              <div className="space-y-2">
                <Label htmlFor="delivery-date">Day of Month</Label>
                <Select required>
                  <SelectTrigger id="delivery-date">
                    <SelectValue placeholder="Select date" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 31 }, (_, i) => (
                      <SelectItem key={i} value={(i + 1).toString()}>
                        {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="delivery-time">Delivery Time</Label>
              <div className="relative">
                <Clock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input id="delivery-time" type="time" className="pl-8" required />
              </div>
            </div>

            {frequency !== "once" && (
              <div className="space-y-2">
                <Label htmlFor="end-date">End Date (Optional)</Label>
                <Input id="end-date" type="date" />
                <p className="text-xs text-muted-foreground">Leave blank for indefinite scheduling</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href="/dashboard/gifts">
              <Button variant="outline">Cancel</Button>
            </Link>
            <Button type="submit" disabled={loading}>
              {loading ? "Scheduling..." : "Schedule Gift"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
