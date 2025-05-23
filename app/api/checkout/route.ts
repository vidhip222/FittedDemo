import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
})

export async function POST(req: Request) {
  try {
    const { items, deliveryMethod, address } = await req.json()

    // Calculate total amount
    const total = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0)
    
    // Add delivery fee if applicable
    const deliveryFee = deliveryMethod === "doordash" ? 5.99 : 0
    const finalAmount = total + deliveryFee

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        ...items.map((item: any) => ({
          price_data: {
            currency: "usd",
            product_data: {
              name: item.name,
              images: [item.image],
            },
            unit_amount: Math.round(item.price * 100), // Convert to cents
          },
          quantity: item.quantity,
        })),
        // Add delivery fee as a separate line item if applicable
        ...(deliveryFee > 0 ? [{
          price_data: {
            currency: "usd",
            product_data: {
              name: "Delivery Fee",
            },
            unit_amount: Math.round(deliveryFee * 100),
          },
          quantity: 1,
        }] : []),
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/orders/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/orders/cancel`,
      metadata: {
        deliveryMethod,
        address: JSON.stringify(address),
        items: JSON.stringify(items),
      },
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error("Checkout error:", error)
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    )
  }
} 