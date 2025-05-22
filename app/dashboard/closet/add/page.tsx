"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { createClient } from "@supabase/supabase-js"
import { toast } from "sonner"

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function AddClosetItemPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [showCamera, setShowCamera] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [isCameraInitializing, setIsCameraInitializing] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    color: "",
    brand: "",
    size: "",
    description: ""
  })
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    // Cleanup function to stop camera when component unmounts
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  // Add effect to handle camera initialization
  useEffect(() => {
    if (showCamera && videoRef.current && !streamRef.current) {
      startCamera()
    }
  }, [showCamera])

  const startCamera = async () => {
    try {
      setIsCameraInitializing(true)
      setCameraError(null)
      console.log('Starting camera...')
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      })
      console.log('Camera stream obtained:', stream)

      if (!videoRef.current) {
        throw new Error('Video element not found')
      }

      videoRef.current.srcObject = stream
      await videoRef.current.play()
      console.log('Video element playing')
      streamRef.current = stream
    } catch (error: any) {
      console.error('Error accessing camera:', error)
      setCameraError(error.message || 'Failed to access camera')
      setShowCamera(false)
    } finally {
      setIsCameraInitializing(false)
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setShowCamera(false)
  }

  const handleCameraToggle = () => {
    if (showCamera) {
      stopCamera()
    } else {
      setShowCamera(true)
    }
  }

  const capturePhoto = () => {
    console.log('Attempting to capture photo...')
    if (videoRef.current && videoRef.current.srcObject) {
      console.log('Video element and stream available')
      const canvas = document.createElement('canvas')
      canvas.width = videoRef.current.videoWidth
      canvas.height = videoRef.current.videoHeight
      console.log('Canvas dimensions:', canvas.width, 'x', canvas.height)
      const ctx = canvas.getContext('2d')
      
      if (ctx) {
        console.log('Drawing image to canvas')
        ctx.drawImage(videoRef.current, 0, 0)
        const imageUrl = canvas.toDataURL('image/jpeg', 0.8)
        console.log('Image captured successfully')
        setPreview(imageUrl)
        stopCamera()
      } else {
        console.error('Failed to get canvas context')
      }
    } else {
      console.error('Video element or stream not available')
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!preview) {
        throw new Error('Please add an image first')
      }

      // Convert base64 preview to File object
      const base64Data = preview.split(',')[1]
      const byteCharacters = atob(base64Data)
      const byteArrays = []
      
      for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512)
        const byteNumbers = new Array(slice.length)
        
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i)
        }
        
        const byteArray = new Uint8Array(byteNumbers)
        byteArrays.push(byteArray)
      }
      
      const blob = new Blob(byteArrays, { type: 'image/jpeg' })
      const imageFile = new File([blob], 'closet-item.jpg', { type: 'image/jpeg' })
      
      // Upload image to Supabase Storage
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('closet-images')
        .upload(fileName, imageFile)

      if (uploadError) {
        console.error('Upload error:', uploadError)
        throw new Error(`Failed to upload image: ${uploadError.message}`)
      }

      if (!uploadData) {
        throw new Error('No upload data returned')
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('closet-images')
        .getPublicUrl(fileName)

      if (!publicUrl) {
        throw new Error('Failed to get public URL for uploaded image')
      }

      // Save item to database
      const { error: dbError, data: dbData } = await supabase
        .from('closet_items')
        .insert([
          {
            name: formData.name,
            category: formData.category,
            color: formData.color,
            brand: formData.brand,
            size: formData.size,
            description: formData.description,
            image_url: publicUrl
          }
        ])
        .select()

      if (dbError) {
        console.error('Database error details:', dbError)
        throw new Error(`Failed to save item: ${dbError.message || 'Unknown database error'}`)
      }

      if (!dbData) {
        throw new Error('No data returned from database insert')
      }

      toast.success('Item added to closet successfully!')
      router.push('/dashboard/closet')
    } catch (error: any) {
      console.error('Error adding item:', error)
      toast.error(error.message || 'Failed to add item to closet')
      setCameraError(error.message || 'Failed to add item to closet')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
          </svg>
          <span className="sr-only">Back</span>
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Add to Closet</h2>
          <p className="text-muted-foreground">Add a new item to your virtual wardrobe</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center gap-4">
              {cameraError && (
                <div className="text-destructive text-sm mb-4">
                  {cameraError}
                </div>
              )}
              {showCamera ? (
                <div className="relative w-full aspect-square">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover rounded-md bg-black"
                    style={{ transform: 'scaleX(-1)' }}
                  />
                  {isCameraInitializing ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <div className="text-white">Initializing camera...</div>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      onClick={capturePhoto}
                      className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10"
                    >
                      Capture
                    </Button>
                  )}
                </div>
              ) : (
                <div className="relative flex h-40 w-40 items-center justify-center rounded-md border-2 border-dashed border-muted-foreground/25 px-6 py-10">
                  {preview ? (
                    <div className="relative">
                      <img src={preview} alt="Preview" className="h-full w-full object-cover rounded-md" />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2"
                        onClick={() => setPreview(null)}
                      >
                        <span className="sr-only">Remove image</span>
                        ×
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mx-auto h-12 w-12 text-muted-foreground"
                      >
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                      </svg>
                      <div className="mt-4 flex text-sm leading-6 text-muted-foreground">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer rounded-md font-semibold text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-primary"
                        >
                          <span>Upload a file</span>
                          <Input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={handleImageUpload}
                          />
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              )}
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => document.getElementById("file-upload")?.click()}>
                  Upload
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleCameraToggle}
                  disabled={isCameraInitializing}
                >
                  {showCamera ? "Stop Camera" : "Take Photo"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Item Name</Label>
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
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleSelectChange("category", value)}
              required
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tops">Tops</SelectItem>
                <SelectItem value="bottoms">Bottoms</SelectItem>
                <SelectItem value="dresses">Dresses</SelectItem>
                <SelectItem value="outerwear">Outerwear</SelectItem>
                <SelectItem value="shoes">Shoes</SelectItem>
                <SelectItem value="accessories">Accessories</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="color">Color</Label>
            <Input
              id="color"
              name="color"
              value={formData.color}
              onChange={handleInputChange}
              placeholder="e.g., Blue"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="brand">Brand</Label>
            <Input
              id="brand"
              name="brand"
              value={formData.brand}
              onChange={handleInputChange}
              placeholder="e.g., Levi's"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="size">Size</Label>
            <Input
              id="size"
              name="size"
              value={formData.size}
              onChange={handleInputChange}
              placeholder="e.g., M"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Add any notes about this item..."
            />
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !preview}
              className="border border-input bg-background hover:bg-accent hover:text-accent-foreground"
            >
              {loading ? "Adding..." : "Add to Closet"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
