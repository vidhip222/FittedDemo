import Link from "next/link"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CheckoutSuccessPage() {
  return (
    <div className="container max-w-md mx-auto py-12 px-4">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="bg-green-100 p-3 rounded-full">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold">Payment Successful!</h1>
        <p className="text-muted-foreground">
          Thank you for your purchase. Your order has been processed successfully.
        </p>
        <div className="bg-muted p-4 rounded-lg w-full mt-6">
          <h2 className="font-medium mb-2">Order Summary</h2>
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span>Order Number:</span>
              <span className="font-medium">#FTD-{Math.floor(Math.random() * 10000)}</span>
            </div>
            <div className="flex justify-between">
              <span>Date:</span>
              <span>{new Date().toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Payment Method:</span>
              <span>Credit Card</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col space-y-2 w-full mt-4">
          <Link href="/dashboard">
            <Button className="w-full">Continue Shopping</Button>
          </Link>
          <Link href="/dashboard/orders">
            <Button variant="outline" className="w-full">
              View Order History
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
