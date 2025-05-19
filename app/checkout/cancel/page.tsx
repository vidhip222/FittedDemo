import Link from "next/link"
import { XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CheckoutCancelPage() {
  return (
    <div className="container max-w-md mx-auto py-12 px-4">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="bg-red-100 p-3 rounded-full">
          <XCircle className="h-12 w-12 text-red-600" />
        </div>
        <h1 className="text-2xl font-bold">Payment Cancelled</h1>
        <p className="text-muted-foreground">Your payment was cancelled. No charges were made to your account.</p>
        <div className="flex flex-col space-y-2 w-full mt-4">
          <Link href="/dashboard">
            <Button className="w-full">Continue Shopping</Button>
          </Link>
          <Link href="/cart">
            <Button variant="outline" className="w-full">
              Return to Cart
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
