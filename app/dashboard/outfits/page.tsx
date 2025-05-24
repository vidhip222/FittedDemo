// app/dashboard/outfits/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { OutfitCard } from '@/components/OutfitCard'
import { Button } from '@/components/ui/button'
import { MixerHorizontalIcon } from '@radix-ui/react-icons'

export default function OutfitsPage() {
  const supabase = createClientComponentClient()
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)
  const [outfits, setOutfits] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // 1) check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) return router.replace('/login')
      setUserId(session.user.id)
    })
    // 2) subscribe to any future auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) router.replace('/login')
      else setUserId(session.user.id)
    })
    return () => subscription.unsubscribe()
  }, [supabase, router])

  const generateOutfits = async () => {
    if (!userId) return
    setLoading(true)
    try {
      const res = await fetch('/api/outfits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      })
      if (!res.ok) throw new Error('Failed to generate')
      const { outfits } = await res.json()
      setOutfits(outfits)
    } catch (err) {
      console.error('Generation error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (!userId) {
    return (
      <div className="h-64 flex items-center justify-center">
        <p>Loading user…</p>
      </div>
    )
  }

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
        {outfits.map((o) => (
          <OutfitCard key={o.id} outfit={o} userId={userId} />
        ))}
      </div>
    </div>
  )
}
