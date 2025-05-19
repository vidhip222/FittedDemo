import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { FirebaseProvider } from "@/contexts/firebase-context"
import { AuthProvider } from "@/contexts/auth-context"
import { CartProvider } from "@/components/cart/cart-provider"
import { Suspense } from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Fitted - Your Personal Fashion Assistant",
  description: "Discover your style, organize your closet, and shop with confidence.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Suspense fallback={null}>
            <FirebaseProvider>
              <AuthProvider>
                <CartProvider>
                  {children}
                  <Toaster />
                </CartProvider>
              </AuthProvider>
            </FirebaseProvider>
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  )
}
