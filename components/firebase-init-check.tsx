"use client"

import { useFirebase } from "@/contexts/firebase-context"
import { Icons } from "@/components/icons"

export function FirebaseInitCheck() {
  const { isInitialized, isInitializing, error } = useFirebase()

  if (isInitializing) {
    return (
      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
        <Icons.spinner className="h-4 w-4 animate-spin" />
        <span>Initializing Firebase...</span>
      </div>
    )
  }

  if (error) {
    return <div className="text-sm text-red-500">Firebase Error: {error}</div>
  }

  if (!isInitialized) {
    return <div className="text-sm text-red-500">Firebase not initialized</div>
  }

  return <div className="text-sm text-green-500">Firebase initialized successfully</div>
}
