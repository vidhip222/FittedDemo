"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { getFirebaseAuth, getFirebaseFirestore, getFirebaseStorage, getFirebaseAnalytics } from "@/lib/firebase"

type FirebaseContextType = {
  auth: any
  db: any
  storage: any
  analytics: any
  isInitialized: boolean
  isInitializing: boolean
  error: string | null
}

const initialState: FirebaseContextType = {
  auth: null,
  db: null,
  storage: null,
  analytics: null,
  isInitialized: false,
  isInitializing: true,
  error: null,
}

const FirebaseContext = createContext<FirebaseContextType>(initialState)

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<FirebaseContextType>(initialState)

  useEffect(() => {
    const initializeFirebase = async () => {
      if (typeof window === "undefined") return

      try {
        setState((prev) => ({ ...prev, isInitializing: true, error: null }))

        // Initialize services one by one
        const auth = await getFirebaseAuth()
        const db = await getFirebaseFirestore()
        const storage = await getFirebaseStorage()
        const analytics = await getFirebaseAnalytics()

        setState({
          auth,
          db,
          storage,
          analytics,
          isInitialized: true,
          isInitializing: false,
          error: null,
        })
      } catch (error) {
        console.error("Error initializing Firebase:", error)
        setState((prev) => ({
          ...prev,
          isInitializing: false,
          isInitialized: false,
          error: "Failed to initialize Firebase",
        }))
      }
    }

    initializeFirebase()
  }, [])

  return <FirebaseContext.Provider value={state}>{children}</FirebaseContext.Provider>
}

export function useFirebase() {
  return useContext(FirebaseContext)
}
