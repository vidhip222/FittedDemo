"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { supabase } from "@/lib/supabase"

export default function SignupPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const form = e.target as HTMLFormElement
      const nameInput = form.elements.namedItem("name") as HTMLInputElement
      const emailInput = form.elements.namedItem("email") as HTMLInputElement
      const passwordInput = form.elements.namedItem("password") as HTMLInputElement

      const name = nameInput?.value.trim()
      const email = emailInput?.value.trim()
      const password = passwordInput?.value

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error

      // Show success message or redirect
      window.location.href = "/dashboard"
    } catch (err: any) {
      console.error("Signup error:", err)
      setError(err.message || "Signup failed. Please try again.")
      setLoading(false)
    }
  }

  const handleSocialSignup = async (provider: "google" | "apple" | "facebook") => {
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error
    } catch (err: any) {
      console.error("Social signup error:", err)
      setError(err.message || "Social signup failed. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="container relative flex min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <Link href="/" className="absolute left-4 top-4 md:left-8 md:top-8 flex items-center gap-2 text-lg font-medium">
        <ArrowLeft className="h-4 w-4" />
        Back
      </Link>
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-300 to-orange-300" />
        <div className="relative z-20 flex items-center gap-2 text-lg font-medium">
          <Sparkles className="h-5 w-5" />
          <span>Fitted</span>
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              "Fitted has completely transformed how I shop. The AI recommendations are spot-on, and I love discovering
              local boutiques I never knew existed!"
            </p>
            <footer className="text-sm">Sofia Davis</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
            <p className="text-sm text-muted-foreground">Enter your details below to create your account</p>
          </div>
          {error && <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">{error}</div>}
          <Tabs defaultValue="email" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="social">Social</TabsTrigger>
            </TabsList>
            <TabsContent value="email">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" placeholder="John Doe" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" placeholder="m@example.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" name="password" type="password" required />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Creating account..." : "Create account"}
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="social">
              <div className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleSocialSignup("google")}
                  disabled={loading}
                >
                  Continue with Google
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleSocialSignup("apple")}
                  disabled={loading}
                >
                  Continue with Apple
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleSocialSignup("facebook")}
                  disabled={loading}
                >
                  Continue with Facebook
                </Button>
              </div>
            </TabsContent>
          </Tabs>
          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{" "}
            <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
              Privacy Policy
            </Link>
            .
          </p>
          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="underline underline-offset-4 hover:text-primary">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
