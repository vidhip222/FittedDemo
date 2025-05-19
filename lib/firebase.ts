import { initializeApp, getApps, getApp } from "firebase/app"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB2epBCgoX77Nuj1BimYXwLPbOF_Ddkyk0",
  authDomain: "fitted-992a2.firebaseapp.com",
  projectId: "fitted-992a2",
  storageBucket: "fitted-992a2.firebasestorage.app",
  messagingSenderId: "5233050192",
  appId: "1:5233050192:web:7654e8792799a3b813c755",
  measurementId: "G-LT0NK150JF",
}

// Initialize Firebase app (but not services)
let firebaseApp

// Only initialize Firebase on the client side
if (typeof window !== "undefined") {
  firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()
}

// For compatibility with existing code
export let db = null
export let storage = null
export let auth = null

// These functions should only be called on the client side
export const getFirebaseAuth = async () => {
  if (typeof window === "undefined") {
    console.error("Attempted to initialize Firebase Auth on the server")
    return null
  }

  try {
    const { getAuth } = await import("firebase/auth")
    auth = getAuth(firebaseApp)
    return auth
  } catch (error) {
    console.error("Error initializing Firebase Auth:", error)
    return null
  }
}

export const getFirebaseFirestore = async () => {
  if (typeof window === "undefined") {
    console.error("Attempted to initialize Firestore on the server")
    return null
  }

  try {
    const { getFirestore } = await import("firebase/firestore")
    db = getFirestore(firebaseApp)
    return db
  } catch (error) {
    console.error("Error initializing Firestore:", error)
    return null
  }
}

export const getFirebaseStorage = async () => {
  if (typeof window === "undefined") {
    console.error("Attempted to initialize Firebase Storage on the server")
    return null
  }

  try {
    const { getStorage } = await import("firebase/storage")
    storage = getStorage(firebaseApp)
    return storage
  } catch (error) {
    console.error("Error initializing Firebase Storage:", error)
    return null
  }
}

export const getFirebaseAnalytics = async () => {
  if (typeof window === "undefined") {
    console.error("Attempted to initialize Firebase Analytics on the server")
    return null
  }

  try {
    const { getAnalytics } = await import("firebase/analytics")
    return getAnalytics(firebaseApp)
  } catch (error) {
    console.error("Error initializing Firebase Analytics:", error)
    return null
  }
}

// For compatibility with existing code
export const initializeAnalytics = async () => {
  return await getFirebaseAnalytics()
}

// Initialize services on the client side
if (typeof window !== "undefined") {
  // Initialize services asynchronously
  getFirebaseAuth()
  getFirebaseFirestore()
  getFirebaseStorage()
  initializeAnalytics()
}
