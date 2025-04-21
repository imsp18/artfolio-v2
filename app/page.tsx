import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { Features } from "@/components/features"
import { HeroSection } from "@/components/hero-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <Features />
        <section className="py-16 px-4 md:px-6 bg-muted/40">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to showcase your art?</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join Artfolio today and start showcasing your artwork, protect your intellectual property, and connect
              with a community of artists and collectors.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/discover">Explore Artwork</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/create">Create NFT</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
