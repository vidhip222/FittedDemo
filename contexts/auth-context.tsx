"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import {
  type User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
} from "firebase/auth"
import { useFirebase } from "./firebase-context"

type AuthContextType = {
  user: User | null
  loading: boolean
  error: string | null
  signIn: (email: string, password: string) => Promise<{ success: boolean; error: string | null }>
  signUp: (email: string, password: string, displayName: string) => Promise<{ success: boolean; error: string | null }>
  signOut: () => Promise<{ success: boolean; error: string | null }>
}

const initialState: AuthContextType = {
  user: null,
  loading: true,
  error: null,
  signIn: async () => ({ success: false, error: "Auth not initialized" }),
  signUp: async () => ({ success: false, error: "Auth not initialized" }),
  signOut: async () => ({ success: false, error: "Auth not initialized" }),
}

const AuthContext = createContext<AuthContextType>(initialState)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<Omit<AuthContextType, "signIn" | "signUp" | "signOut">>({
    user: null,
    loading: true,
    error: null,
  })

  const { auth, isInitialized, isInitializing, error: firebaseError } = useFirebase()

  useEffect(() => {
    if (firebaseError) {
      setState((prev) => ({ ...prev, error: firebaseError, loading: false }))
      return
    }

    if (isInitializing) {
      setState((prev) => ({ ...prev, loading: true }))
      return
    }

    if (!isInitialized || !auth) {
      setState((prev) => ({ ...prev, error: "Firebase not initialized", loading: false }))
      return
    }

    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        setState({ user, loading: false, error: null })
      },
      (error) => {
        console.error("Auth state change error:", error)
        setState({ user: null, loading: false, error: error.message })
      },
    )

    return () => unsubscribe()
  }, [auth, isInitialized, isInitializing, firebaseError])

  const signIn = async (email: string, password: string) => {
    if (!auth || !isInitialized) {
      return { success: false, error: "Firebase Auth not initialized" }
    }

    try {
      setState((prev) => ({ ...prev, loading: true, error: null }))
      await signInWithEmailAndPassword(auth, email, password)
      return { success: true, error: null }
    } catch (error: any) {
      console.error("Sign in error:", error)
      setState((prev) => ({ ...prev, loading: false, error: error.message }))
      return { success: false, error: error.message }
    }
  }

  const signUp = async (email: string, password: string, displayName: string) => {
    if (!auth || !isInitialized) {
      return { success: false, error: "Firebase Auth not initialized" }
    }

    try {
      setState((prev) => ({ ...prev, loading: true, error: null }))
      const result = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(result.user, { displayName })
      return { success: true, error: null }
    } catch (error: any) {
      console.error("Sign up error:", error)
      setState((prev) => ({ ...prev, loading: false, error: error.message }))
      return { success: false, error: error.message }
    }
  }

  const signOut = async () => {
    if (!auth || !isInitialized) {
      return { success: false, error: "Firebase Auth not initialized" }
    }

    try {
      setState((prev) => ({ ...prev, loading: true, error: null }))
      await firebaseSignOut(auth)
      return { success: true, error: null }
    } catch (error: any) {
      console.error("Sign out error:", error)
      setState((prev) => ({ ...prev, loading: false, error: error.message }))
      return { success: false, error: error.message }
    }
  }

  return <AuthContext.Provider value={{ ...state, signIn, signUp, signOut }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
