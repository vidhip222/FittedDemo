import { type Stripe, loadStripe } from "@stripe/stripe-js"

let stripePromise: Promise<Stripe | null> | null = null

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "")
  }
  return stripePromise
}

export const getServerStripe = () => {
  return null // We don't have a secret key, so we return null for server-side Stripe
}
