"use client"

import { useEffect, useState } from "react"
import { getSupabaseClient } from "@/lib/supabase"
import { Card, CardContent } from "@/components/ui/card"

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [metrics, setMetrics] = useState({ users: 0, chats: 0, uploads: 0 })
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const supabase = getSupabaseClient()
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

        if (sessionError) {
          throw sessionError
        }

        const token = sessionData.session?.access_token
        if (!token) {
          setError("Not authenticated")
          setLoading(false)
          return
        }

        const res = await fetch("/api/admin/metrics", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!res.ok) {
          throw new Error(`API error: ${res.status}`)
        }

        const data = await res.json()
        setMetrics(data)
      } catch (err: any) {
        console.error("Error fetching metrics:", err)
        setError(err.message || "Failed to load metrics")
      } finally {
        setLoading(false)
      }
    }

    fetchMetrics()
  }, [])

  return (
    <div className="p-6 space-y-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
      {loading ? (
        <p>Loading metrics...</p>
      ) : error ? (
        <div className="bg-red-50 text-red-500 p-4 rounded-md">{error}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Total Users</p>
              <p className="text-xl font-bold">{metrics.users}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Total Chats</p>
              <p className="text-xl font-bold">{metrics.chats}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Total Uploads</p>
              <p className="text-xl font-bold">{metrics.uploads}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
