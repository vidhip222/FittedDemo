"use client"
import { ClosetUpload } from "@/components/closet-upload"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function ClosetAddPage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (formData: FormData) => {
    setLoading(true)

    try {
      // In a real app, this would send the data to your backend
      // For now, we'll simulate a successful upload

      setTimeout(() => {
        toast({
          title: "Success",
          description: "Item added to your closet successfully!",
        })
        router.push("/dashboard/closet")
      }, 1500)
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Add to Closet</h1>
        <p className="text-muted-foreground">
          Upload clothing items to your virtual closet for AI styling recommendations.
        </p>
      </div>

      <ClosetUpload onSubmit={handleSubmit} />
    </div>
  )
}
