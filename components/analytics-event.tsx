"use client"

import { useAnalyticsContext } from "./analytics-provider"
import { useEffect } from "react"

interface AnalyticsEventProps {
  eventName: string
  eventParams?: Record<string, any>
}

export function AnalyticsEvent({ eventName, eventParams = {} }: AnalyticsEventProps) {
  const analytics = useAnalyticsContext()

  useEffect(() => {
    if (analytics) {
      // Import logEvent dynamically to avoid server-side issues
      import("firebase/analytics")
        .then(({ logEvent }) => {
          logEvent(analytics, eventName, eventParams)
        })
        .catch((error) => {
          console.error("Error logging event:", error)
        })
    }
  }, [analytics, eventName, eventParams])

  return null
}
