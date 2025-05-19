"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, X, ImageIcon } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { storage, db } from "@/lib/firebase"
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"

interface ClosetItem {
  name: string
  category: string
  color: string
  brand?: string
  price?: number
  description?: string
  imageUrl: string
}

const categories = [
  "Tops",
  "Bottoms",
  "Dresses",
  "Outerwear",
  "Shoes",
  "Accessories",
  "Activewear",
  "Formal",
  "Sleepwear",
  "Other",
]

const colors = [
  "Black",
  "White",
  "Gray",
  "Red",
  "Blue",
  "Green",
  "Yellow",
  "Purple",
  "Pink",
  "Orange",
  "Brown",
  "Beige",
  "Multicolor",
  "Other",
]

export function ClosetUpload() {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<ClosetItem>>({
    name: "",
    category: "",
    color: "",
    brand: "",
    price: undefined,
    description: "",
  })
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (!file) return

    // Check file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid File",
        description: "Please upload an image file (JPEG, PNG, etc.).",
        variant: "destructive",
      })
      return
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please upload an image smaller than 5MB.",
        variant: "destructive",
      })
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onload = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Check if image is selected
    if (!imagePreview || !fileInputRef.current?.files?.[0]) {
      toast({
        title: "Image Required",
        description: "Please upload an image of your clothing item.",
        variant: "destructive",
      })
      return
    }

    // Check required fields
    if (!formData.name || !formData.category || !formData.color) {
      toast({
        title: "Missing Information",
        description: "Please fill in the required fields (name, category, color).",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      const file = fileInputRef.current.files[0]
      const fileName = `closet/${Date.now()}_${file.name}`
      const storageRef = ref(storage, fileName)

      // Upload image to Firebase Storage
      const uploadTask = uploadBytesResumable(storageRef, file)

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          setUploadProgress(progress)
        },
        (error) => {
          console.error("Upload error:", error)
          toast({
            title: "Upload Failed",
            description: "Failed to upload the image. Please try again.",
            variant: "destructive",
          })
          setIsUploading(false)
        },
        async () => {
          // Get download URL
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)

          // Save item to Firestore
          const closetItem: ClosetItem = {
            ...(formData as ClosetItem),
            imageUrl: downloadURL,
          }

          await addDoc(collection(db, "closetItems"), {
            ...closetItem,
            createdAt: serverTimestamp(),
            userId: "guest", // Replace with actual user ID when authentication is implemented
          })

          toast({
            title: "Item Added",
            description: "Your clothing item has been added to your closet.",
          })

          // Reset form
          setFormData({
            name: "",
            category: "",
            color: "",
            brand: "",
            price: undefined,
            description: "",
          })
          setImagePreview(null)
          setUploadProgress(0)
          if (fileInputRef.current) {
            fileInputRef.current.value = ""
          }
        },
      )
    } catch (error) {
      console.error("Closet item upload error:", error)
      toast({
        title: "Error",
        description: "Failed to add the item to your closet. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveImage = () => {
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Add to Your Closet</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div>
            <Label htmlFor="image">Item Image (required)</Label>
            <div className="mt-2">
              {imagePreview ? (
                <div className="relative aspect-square w-full max-w-xs mx-auto rounded-md overflow-hidden border">
                  <img
                    src={imagePreview || "/placeholder.svg"}
                    alt="Clothing item preview"
                    className="object-cover w-full h-full"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={handleRemoveImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div
                  className="flex flex-col items-center justify-center border-2 border-dashed rounded-md p-6 cursor-pointer hover:bg-muted/50"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Click to upload an image</p>
                  <p className="text-xs text-muted-foreground mt-1">JPEG, PNG, GIF up to 5MB</p>
                </div>
              )}
              <input
                type="file"
                id="image"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Item Details */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Item Name (required)</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Blue Denim Jacket"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category (required)</Label>
              <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="color">Color (required)</Label>
              <Select value={formData.color} onValueChange={(value) => handleSelectChange("color", value)}>
                <SelectTrigger id="color">
                  <SelectValue placeholder="Select color" />
                </SelectTrigger>
                <SelectContent>
                  {colors.map((color) => (
                    <SelectItem key={color} value={color}>
                      {color}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand">Brand (optional)</Label>
              <Input
                id="brand"
                name="brand"
                value={formData.brand || ""}
                onChange={handleInputChange}
                placeholder="e.g., Levi's"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price (optional)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price || ""}
                onChange={handleInputChange}
                placeholder="e.g., 49.99"
              />
              <p className="text-xs text-muted-foreground">
                AI will analyze the image to estimate price if not provided
              </p>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description || ""}
                onChange={handleInputChange}
                placeholder="Add notes about this item..."
                rows={3}
              />
              <p className="text-xs text-muted-foreground">AI will analyze the image to fill in missing details</p>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setFormData({
              name: "",
              category: "",
              color: "",
              brand: "",
              price: undefined,
              description: "",
            })
            setImagePreview(null)
            if (fileInputRef.current) {
              fileInputRef.current.value = ""
            }
          }}
          disabled={isUploading}
        >
          Clear
        </Button>
        <Button type="submit" onClick={handleSubmit} disabled={isUploading || !imagePreview}>
          {isUploading ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
              Uploading {Math.round(uploadProgress)}%
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Add to Closet
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
