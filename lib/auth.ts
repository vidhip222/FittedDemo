import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth"
import { getFirebaseAuth } from "./firebase"

export async function signIn(email: string, password: string): Promise<{ user: User | null; error: string | null }> {
  try {
    const auth = await getFirebaseAuth()
    if (!auth) {
      return { user: null, error: "Auth not initialized" }
    }

    const result = await signInWithEmailAndPassword(auth, email, password)
    return { user: result.user, error: null }
  } catch (error: any) {
    return {
      user: null,
      error: error.message || "Failed to sign in",
    }
  }
}

export async function signUp(email: string, password: string): Promise<{ user: User | null; error: string | null }> {
  try {
    const auth = await getFirebaseAuth()
    if (!auth) {
      return { user: null, error: "Auth not initialized" }
    }

    const result = await createUserWithEmailAndPassword(auth, email, password)
    return { user: result.user, error: null }
  } catch (error: any) {
    return {
      user: null,
      error: error.message || "Failed to sign up",
    }
  }
}

export async function signOut(): Promise<{ error: string | null }> {
  try {
    const auth = await getFirebaseAuth()
    if (!auth) {
      return { error: "Auth not initialized" }
    }

    await firebaseSignOut(auth)
    return { error: null }
  } catch (error: any) {
    return {
      error: error.message || "Failed to sign out",
    }
  }
}

// For compatibility with existing code
export async function getCurrentUserId(): Promise<number | null> {
  try {
    const auth = await getFirebaseAuth()
    if (!auth) {
      return null
    }

    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        unsubscribe()
        if (user) {
          // Convert Firebase UID to a number for compatibility
          // This is just a placeholder implementation
          const numericId = Number.parseInt(user.uid.replace(/[^0-9]/g, "").substring(0, 9), 10) || 1
          resolve(numericId)
        } else {
          resolve(null)
        }
      })
    })
  } catch (error) {
    console.error("Error getting current user ID:", error)
    return null
  }
}
