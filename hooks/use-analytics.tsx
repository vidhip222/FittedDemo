"use client"

import { useEffect, useState } from "react"
import { initializeAnalytics } from "@/lib/firebase"

export function useAnalytics() {
  const [analytics, setAnalytics] = useState(null)

  useEffect(() => {
    const initAnalytics = async () => {
      const analyticsInstance = await initializeAnalytics()
      setAnalytics(analyticsInstance)
    }

    initAnalytics()
  }, [])

  return analytics
}
