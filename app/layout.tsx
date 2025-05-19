import type React from "react"
import "@/app/globals.css"
import { Montserrat, Merriweather } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"

const montserrat = Montserrat({ subsets: ["latin"] })
const merriweather = Merriweather({ weight: ["400", "700"], subsets: ["latin"] })

export const metadata = {
  title: "Fitted - AI-Powered Styling Platform",
  description: "Your vibe. Your fit. Your world—styled in real life.",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={montserrat.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
