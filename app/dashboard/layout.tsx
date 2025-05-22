"use client"

import type { ReactNode } from "react"
import { useEffect, useState } from "react"
import Link from "next/link"
import {
  Sparkles,
  Home,
  ShoppingBag,
  Shirt,
  Gift,
  MapPin,
  Settings,
  LogOut,
  Menu,
  Calendar,
  Search,
  MessageSquare,
  Store,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Suspense } from "react"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [userName, setUserName] = useState<string>("")
  const [userInitials, setUserInitials] = useState<string>("")

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user?.user_metadata?.name) {
        setUserName(user.user_metadata.name)
        // Get initials from name
        const initials = user.user_metadata.name
          .split(" ")
          .map((n: string) => n[0])
          .join("")
          .toUpperCase()
        setUserInitials(initials)
      }
    }

    fetchUser()
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-8">
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72">
                <div className="flex items-center gap-2 font-bold text-xl mb-8">
                  <Sparkles className="h-5 w-5" />
                  <span>Fitted</span>
                </div>
                <nav className="grid gap-2 text-lg font-medium">
                  <Link href="/dashboard" className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-accent">
                    <Home className="h-5 w-5" />
                    Dashboard
                  </Link>
                  <Link
                    href="/dashboard/closet"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-accent"
                  >
                    <Shirt className="h-5 w-5" />
                    My Closet
                  </Link>
                  <Link
                    href="/dashboard/outfits"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-accent"
                  >
                    <ShoppingBag className="h-5 w-5" />
                    Outfits
                  </Link>
                  <Link
                    href="/dashboard/drops"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-accent"
                  >
                    <Calendar className="h-5 w-5" />
                    Weekly Drops
                  </Link>
                  <Link
                    href="/dashboard/ai-stylist"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-accent"
                  >
                    <MessageSquare className="h-5 w-5" />
                    AI Stylist
                  </Link>
                  <Link
                    href="/dashboard/gifts"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-accent"
                  >
                    <Gift className="h-5 w-5" />
                    Gifts
                  </Link>
                  <Link
                    href="/dashboard/stores"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-accent"
                  >
                    <MapPin className="h-5 w-5" />
                    Nearby Stores
                  </Link>
                  <div className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground pointer-events-none">
                    <Store className="h-5 w-5" />
                    Pop-Up Experience
                    <Badge className="ml-1 bg-yellow-500 text-white text-xs">Coming Soon</Badge>
                  </div>
                  <Link
                    href="/dashboard/stores/search"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-accent"
                  >
                    <Search className="h-5 w-5" />
                    Search & Deliver
                  </Link>
                  <Link
                    href="/dashboard/settings"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-accent"
                  >
                    <Settings className="h-5 w-5" />
                    Settings
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
            <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl">
              <Sparkles className="h-5 w-5" />
              <span>Fitted</span>
            </Link>
          </div>
          <div className="flex items-center gap-4 pr-8">
            <Avatar>
              <AvatarImage src="/placeholder-user.jpg" alt={userName} />
              <AvatarFallback>{userInitials}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="hidden w-64 border-r bg-muted/40 md:block">
          <div className="flex h-full max-h-screen flex-col gap-2 p-4">
            <nav className="grid gap-2 text-sm font-medium">
              <Link href="/dashboard" className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-accent">
                <Home className="h-5 w-5" />
                Dashboard
              </Link>
              <Link href="/dashboard/closet" className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-accent">
                <Shirt className="h-5 w-5" />
                My Closet
              </Link>
              <Link href="/dashboard/outfits" className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-accent">
                <ShoppingBag className="h-5 w-5" />
                Outfits
              </Link>
              <Link href="/dashboard/drops" className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-accent">
                <Calendar className="h-5 w-5" />
                Weekly Drops
              </Link>
              <Link
                href="/dashboard/ai-stylist"
                className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-accent"
              >
                <MessageSquare className="h-5 w-5" />
                AI Stylist
              </Link>
              <Link href="/dashboard/gifts" className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-accent">
                <Gift className="h-5 w-5" />
                Gifts
              </Link>
              <Link href="/dashboard/stores" className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-accent">
                <MapPin className="h-5 w-5" />
                Nearby Stores
              </Link>
              <div className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground pointer-events-none">
                <Store className="h-5 w-5" />
                Pop-Up Experience
                <Badge className="ml-1 bg-yellow-500 text-white text-xs">Coming Soon</Badge>
              </div>
              <Link
                href="/dashboard/stores/search"
                className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-accent"
              >
                <Search className="h-5 w-5" />
                Search & Deliver
              </Link>
              <Link href="/dashboard/settings" className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-accent">
                <Settings className="h-5 w-5" />
                Settings
              </Link>
            </nav>
            <div className="mt-auto">
              <Link href="/dashboard/settings" className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-accent">
                <Settings className="h-5 w-5" />
                Settings
              </Link>
              <Link
                href="/"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                <LogOut className="h-5 w-5" />
                Log out
              </Link>
            </div>
          </div>
        </aside>
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <Suspense>{children}</Suspense>
        </main>
      </div>
    </div>
  )
}
