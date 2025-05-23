// app/dashboard/outfits/page.tsx
"use client"

import { useState, useEffect } from "react";
import { createClientComponentClient } from '@supabase/ssr'
import { OutfitCard } from "@/components/OutfitCard.tsx";
import { Button } from "@/components/ui/button";
import { MixerHorizontalIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";

export default function OutfitsPage() {
  const supabase = createClientComponentClient()
  const router = useRouter()
  const [outfits, setOutfits] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) {
        router.push('/login')
        return
      }
      setUserId(session.user.id)
    }
    checkAuth()
  }, [supabase, router])

  const generateOutfits = async () => {
    if (!userId) return
    
    setLoading(true)
    try {
      const res = await fetch('/api/outfits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      })
      if (!res.ok) throw new Error('Failed to generate')
      const { outfits } = await res.json()
      setOutfits(outfits)
    } catch (error) {
      console.error('Generation error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!userId) return (
    <div className="flex items-center justify-center h-64">
      <p>Loading user...</p>
    </div>
  )

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Your Outfits</h1>
        <Button onClick={generateOutfits} disabled={loading}>
          <MixerHorizontalIcon className="mr-2" />
          {loading ? 'Generating...' : 'New Outfits'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {outfits.map((outfit) => (
          <OutfitCard key={outfit.id} outfit={outfit} userId={userId} />
        ))}
      </div>
    </div>
  )
}