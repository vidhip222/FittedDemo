"use client"

import type React from "react"

import { useAnalytics } from "@/hooks/use-analytics"
import { createContext, useContext } from "react"

const AnalyticsContext = createContext(null)

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const analytics = useAnalytics()

  return <AnalyticsContext.Provider value={analytics}>{children}</AnalyticsContext.Provider>
}

export function useAnalyticsContext() {
  return useContext(AnalyticsContext)
}
