"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LoginForm } from "@/components/auth/login-form"
import { useAuth } from "@/contexts/auth-context"
import { Icons } from "@/components/icons"
import { FirebaseInitCheck } from "@/components/firebase-init-check"

export default function LoginPage() {
  const router = useRouter()
  const { user, loading, error } = useAuth()
  const [isRedirecting, setIsRedirecting] = useState(false)

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (user && !loading) {
      setIsRedirecting(true)
      router.push("/dashboard")
    }
  }, [user, loading, router])

  const handleSkipLogin = () => {
    setIsRedirecting(true)
    router.push("/dashboard")
  }

  if (loading || isRedirecting) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-pink-100 to-orange-100">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Icons.spinner className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            {isRedirecting ? "Redirecting to dashboard..." : "Loading..."}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-pink-100 to-orange-100">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-4xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground">Enter your credentials to sign in to your account</p>
        </div>
        <div className="grid gap-6">
          {error && <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">{error}</div>}
          <LoginForm />
          <Button onClick={handleSkipLogin} variant="outline" className="mt-2">
            Skip Login (Continue as Guest)
          </Button>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/signup" className="underline underline-offset-4 hover:text-primary">
                Sign up
              </Link>
            </p>
          </div>
          <div className="mt-4 p-2 bg-gray-50 rounded-md">
            <FirebaseInitCheck />
          </div>
        </div>
      </div>
    </div>
  )
}
