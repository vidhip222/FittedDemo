import Link from "next/link"
import { ArrowRight, Clock, Gift, MapPin, ShoppingBag, Smartphone, Star, Store } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center px-8">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Star className="h-6 w-6 text-primary" />
            <span>Fitted</span>
          </Link>
          <div className="ml-auto flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline" className="hidden md:flex">
                Log in
              </Button>
            </Link>
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-br from-pink-100 to-orange-100">
          <div className="container px-8 md:px-8">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">Fitted</h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Your vibe. Your fit. Your world—styled in real life.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/signup">
                    <Button>
                      Download App
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative aspect-video overflow-hidden rounded-xl bg-gradient-to-br from-pink-200 to-orange-200 md:aspect-square lg:order-last lg:aspect-auto">
                  <img
                    alt="Fitted App Preview"
                    className="object-cover"
                    src="/placeholder.svg?height=550&width=450"
                    width={550}
                    height={450}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-orange-50 to-pink-50">
          <div className="container px-8 md:px-8">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-pink-100 px-3 py-1 text-sm text-primary">Core Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Style Your Life with AI</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  From your closet to your campus, from your first apartment to your first date, Fitted makes curating
                  your aesthetic effortless, affordable, and fun.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm bg-background">
                <div className="rounded-full bg-pink-100 p-3">
                  <Smartphone className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">AI Stylist</h3>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Get personalized outfit bundles based on your vibe, whether it's "Intern Chic," "Coastal Girl," or
                  "Street Goth."
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm bg-background">
                <div className="rounded-full bg-pink-100 p-3">
                  <ShoppingBag className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Smart Closet</h3>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Upload your closet and let our AI reuse what you own while suggesting new pieces that match your
                  style.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm bg-background">
                <div className="rounded-full bg-pink-100 p-3">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Local Shopping</h3>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Get instant outfit recommendations from nearby stores, small brands, or thrift shops.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm bg-background">
                <div className="rounded-full bg-pink-100 p-3">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Fast Delivery</h3>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Enjoy real-time delivery in hours from mall runners or partners, bringing fashion to your doorstep.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm bg-background">
                <div className="rounded-full bg-pink-100 p-3">
                  <Gift className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Gift Scheduling</h3>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Set repeat gifts or deliveries, like "Boba to my girlfriend every Friday at 5 PM."
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm bg-background">
                <div className="rounded-full bg-pink-100 p-3">
                  <Store className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Pop-Up Experience</h3>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Visit our interactive Smart Mirror Assistant for styling advice and real-time outfit suggestions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Update the rest of the sections with pastel sunset theme */}
        <section
          id="how-it-works"
          className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-pink-50 to-orange-50"
        >
          <div className="container px-8 md:px-8">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-pink-100 px-3 py-1 text-sm text-primary">How It Works</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Simple. Stylish. Smart.</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Our AI-powered platform makes styling your life effortless in just a few steps.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-12 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-pink-100 text-primary">
                  <span className="text-2xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-bold">Upload Your Closet</h3>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Take photos of your clothing items and our AI will categorize them automatically.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-pink-100 text-primary">
                  <span className="text-2xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-bold">Set Your Vibe</h3>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Choose your style preferences and let our AI understand your unique aesthetic.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-pink-100 text-primary">
                  <span className="text-2xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-bold">Get Styled</h3>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Receive personalized outfit recommendations and shop directly from local stores.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          id="testimonials"
          className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-orange-50 to-pink-50"
        >
          <div className="container px-8 md:px-8">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-pink-100 px-3 py-1 text-sm text-primary">Testimonials</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">What Our Users Say</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Join thousands of fashion-forward individuals who have transformed their style with Fitted.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col justify-between rounded-lg border p-6 shadow-sm bg-background">
                <div className="space-y-2">
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-current text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-500 dark:text-gray-400">
                    "Fitted has completely transformed how I shop. The AI recommendations are spot on, and I love
                    discovering local boutiques I never knew existed!"
                  </p>
                </div>
                <div className="mt-6 flex items-center space-x-4">
                  <div className="rounded-full bg-pink-200 h-10 w-10"></div>
                  <div>
                    <p className="text-sm font-medium">Alex Johnson</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">College Student</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-between rounded-lg border p-6 shadow-sm bg-background">
                <div className="space-y-2">
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-current text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-500 dark:text-gray-400">
                    "The gift scheduling feature is a game-changer! My partner loves getting surprise deliveries, and I
                    love how easy it is to set up."
                  </p>
                </div>
                <div className="mt-6 flex items-center space-x-4">
                  <div className="rounded-full bg-orange-200 h-10 w-10"></div>
                  <div>
                    <p className="text-sm font-medium">Taylor Smith</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Young Professional</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-between rounded-lg border p-6 shadow-sm bg-background">
                <div className="space-y-2">
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-current text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-500 dark:text-gray-400">
                    "The Smart Mirror at their pop-up shop was mind-blowing! It suggested outfits I would never have put
                    together but absolutely loved."
                  </p>
                </div>
                <div className="mt-6 flex items-center space-x-4">
                  <div className="rounded-full bg-pink-200 h-10 w-10"></div>
                  <div>
                    <p className="text-sm font-medium">Jordan Lee</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Fashion Enthusiast</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-pink-300 to-orange-300 text-white">
          <div className="container px-8 md:px-8">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Ready to Transform Your Style?</h2>
                <p className="max-w-[900px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Download the Fitted app today and experience the future of fashion.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button className="bg-white text-primary hover:bg-gray-100">
                  Download Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline" className="border-white text-white hover:bg-pink-400">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t py-6 md:py-0 bg-gradient-to-r from-pink-50 to-orange-50">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row px-8">
          <div className="flex items-center gap-2">
            <Star className="h-6 w-6 text-primary" />
            <p className="text-sm text-gray-500 dark:text-gray-400">© 2025 Fitted. All rights reserved.</p>
          </div>
          <div className="flex gap-4 md:gap-6">
            <Link href="#" className="text-sm font-medium hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="text-sm font-medium hover:text-primary transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="text-sm font-medium hover:text-primary transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
