import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Check, Sparkles, Smartphone, MapPin, Shirt, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <Shirt className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Fitted</span>
            </Link>
            <nav className="hidden md:flex gap-6">
              <Link href="#features" className="text-sm font-medium hover:text-primary">
                Features
              </Link>
              <Link href="#how-it-works" className="text-sm font-medium hover:text-primary">
                How It Works
              </Link>
              <Link href="#testimonials" className="text-sm font-medium hover:text-primary">
                Testimonials
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-12 md:pt-32 md:pb-20">
        <div className="container flex flex-col items-center text-center">
          <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm">
            <Sparkles className="mr-1 h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-medium">Introducing Fitted v11</span>
          </div>
          <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Your <span className="text-primary">AI-Powered</span> Personal Stylist
          </h1>
          <p className="mt-6 max-w-3xl text-muted-foreground text-lg sm:text-xl">
            Discover your perfect style, shop smarter, and build a wardrobe you love with personalized AI
            recommendations and seamless shopping experiences.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/dashboard">
              <Button size="lg" className="h-12 px-8">
                Try Fitted Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button size="lg" variant="outline" className="h-12 px-8">
                See How It Works
              </Button>
            </Link>
          </div>
          <div className="mt-16 relative w-full max-w-5xl">
            <div className="aspect-[16/9] overflow-hidden rounded-xl border shadow-xl">
              <Image
                src="/placeholder.svg?height=720&width=1280&text=Fitted+App+Interface"
                alt="Fitted App Interface"
                width={1280}
                height={720}
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 md:-bottom-8 md:-right-8 w-24 h-24 md:w-32 md:h-32 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg md:text-xl p-4 text-center leading-tight">
              AI-Powered Style
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24 bg-slate-50">
        <div className="container">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Revolutionize Your Wardrobe</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
              Fitted combines cutting-edge AI with personalized styling to transform how you shop, dress, and express
              yourself.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="bg-white rounded-xl border p-6 shadow-sm">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">AI Stylist</h3>
              <p className="mt-2 text-muted-foreground">
                Chat with your personal AI stylist for outfit recommendations, style advice, and fashion tips tailored
                to your preferences.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-xl border p-6 shadow-sm">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Shirt className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Virtual Closet</h3>
              <p className="mt-2 text-muted-foreground">
                Digitize your wardrobe and get AI-powered outfit combinations from clothes you already own.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-xl border p-6 shadow-sm">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <ShoppingBag className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Smart Shopping</h3>
              <p className="mt-2 text-muted-foreground">
                Discover clothing items that match your style and budget from thousands of retailers, all in one place.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-xl border p-6 shadow-sm">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Local Discovery</h3>
              <p className="mt-2 text-muted-foreground">
                Find fashion items at nearby stores and get them delivered to your door within hours.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white rounded-xl border p-6 shadow-sm">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Smartphone className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Weekly Drops</h3>
              <p className="mt-2 text-muted-foreground">
                Stay on trend with curated weekly collections and exclusive influencer bundles.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white rounded-xl border p-6 shadow-sm">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Check className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Style Analytics</h3>
              <p className="mt-2 text-muted-foreground">
                Track your style evolution and get insights into your fashion preferences and habits.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 md:py-24">
        <div className="container">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">How Fitted Works</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
              Experience the future of fashion with our seamless, AI-powered platform.
            </p>
          </div>

          <div className="mt-16 grid gap-12 md:grid-cols-3">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold mb-6">
                1
              </div>
              <h3 className="text-xl font-bold">Upload Your Closet</h3>
              <p className="mt-2 text-muted-foreground">
                Take photos of your clothing items or upload existing images to build your virtual closet.
              </p>
              <div className="mt-6 aspect-square relative w-full max-w-xs rounded-xl overflow-hidden border">
                <Image
                  src="/placeholder.svg?height=300&width=300&text=Upload+Closet"
                  alt="Upload your closet"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold mb-6">
                2
              </div>
              <h3 className="text-xl font-bold">Get AI Recommendations</h3>
              <p className="mt-2 text-muted-foreground">
                Chat with your AI stylist to get personalized outfit recommendations and style advice.
              </p>
              <div className="mt-6 aspect-square relative w-full max-w-xs rounded-xl overflow-hidden border">
                <Image
                  src="/placeholder.svg?height=300&width=300&text=AI+Recommendations"
                  alt="AI Recommendations"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold mb-6">
                3
              </div>
              <h3 className="text-xl font-bold">Shop & Deliver</h3>
              <p className="mt-2 text-muted-foreground">
                Find items at nearby stores or online retailers and get them delivered to your door.
              </p>
              <div className="mt-6 aspect-square relative w-full max-w-xs rounded-xl overflow-hidden border">
                <Image
                  src="/placeholder.svg?height=300&width=300&text=Shop+and+Deliver"
                  alt="Shop and Deliver"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 md:py-24 bg-slate-50">
        <div className="container">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">What Our Users Say</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
              Join thousands of fashion enthusiasts who have transformed their style with Fitted.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Testimonial 1 */}
            <div className="bg-white rounded-xl border p-6 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-full bg-slate-200 overflow-hidden">
                  <Image src="/placeholder.svg?height=48&width=48&text=JD" alt="User" width={48} height={48} />
                </div>
                <div>
                  <h4 className="font-medium">Jessica D.</h4>
                  <p className="text-sm text-muted-foreground">Fashion Blogger</p>
                </div>
              </div>
              <p className="italic text-muted-foreground">
                "Fitted has completely changed how I approach my wardrobe. The AI stylist gives me combinations I never
                would have thought of!"
              </p>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white rounded-xl border p-6 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-full bg-slate-200 overflow-hidden">
                  <Image src="/placeholder.svg?height=48&width=48&text=MT" alt="User" width={48} height={48} />
                </div>
                <div>
                  <h4 className="font-medium">Michael T.</h4>
                  <p className="text-sm text-muted-foreground">Business Professional</p>
                </div>
              </div>
              <p className="italic text-muted-foreground">
                "As someone who hates shopping, Fitted is a game-changer. I can find exactly what I need without
                spending hours at the mall."
              </p>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white rounded-xl border p-6 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-full bg-slate-200 overflow-hidden">
                  <Image src="/placeholder.svg?height=48&width=48&text=AL" alt="User" width={48} height={48} />
                </div>
                <div>
                  <h4 className="font-medium">Aisha L.</h4>
                  <p className="text-sm text-muted-foreground">Student</p>
                </div>
              </div>
              <p className="italic text-muted-foreground">
                "The local delivery option is amazing! I found a dress at a boutique nearby and had it delivered in
                under 2 hours."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="rounded-2xl bg-primary p-8 md:p-12 text-white text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Ready to Transform Your Style?</h2>
            <p className="mt-4 text-lg text-white/80 max-w-2xl mx-auto">
              Join Fitted today and experience the future of fashion with AI-powered styling, personalized
              recommendations, and seamless shopping.
            </p>
            <div className="mt-8">
              <Link href="/dashboard">
                <Button size="lg" variant="secondary" className="h-12 px-8">
                  Get Started Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Shirt className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Fitted</span>
            </div>
            <div className="flex gap-8">
              <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
                Privacy Policy
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
                Terms of Service
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
                Contact Us
              </Link>
            </div>
          </div>
          <div className="mt-8 text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Fitted. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
