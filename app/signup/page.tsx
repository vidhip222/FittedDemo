"use client"
import Link from "next/link"
import { SignUpForm } from "@/components/auth/signup-form"

export default function SignupPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-pink-100 to-orange-100">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-4xl font-bold tracking-tight">Create an account</h1>
          <p className="text-sm text-muted-foreground">Enter your information below to create your account</p>
        </div>
        <div className="grid gap-6">
          <SignUpForm />
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="underline underline-offset-4 hover:text-primary">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
