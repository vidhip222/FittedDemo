import { NextResponse } from "next/server"

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
    schedule: "Weekdays at 9:00 AM",
    nextDelivery: "Monday, May 8, 2023",
    store: "Blue Bottle Coffee",
    status: "paused",
  },
  {
    id: 4,
    recipient: "Partner",
    item: "Chocolate",
    schedule: "Monthly on the 1st",
    nextDelivery: "Thursday, June 1, 2023",
    store: "Dandelion Chocolate",
    status: "active",
  },
]

export async function GET() {
  return NextResponse.json(gifts)
}

export async function POST(request: Request) {
  try {
    const newGift = await request.json()

    // In a real app, we would validate the input and save to a database
    const gift = {
      id: gifts.length + 1,
      ...newGift,
      status: "active",
    }

    // For mock purposes, we'll just return the new gift
    return NextResponse.json(gift, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create gift" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const updatedGift = await request.json()

    // In a real app, we would validate the input and update in a database
    // For mock purposes, we'll just return the updated gift
    return NextResponse.json(updatedGift)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update gift" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    // In a real app, we would delete from a database
    // For mock purposes, we'll just return success
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete gift" }, { status: 500 })
  }
}
