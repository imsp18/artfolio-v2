import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-muted/50 to-muted">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Showcase Your Art on the Blockchain
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Artfolio is a secure platform for artists to showcase, protect, and sell their digital artwork as NFTs.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button asChild size="lg">
                <Link href="/discover">Explore Artwork</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/create">Create NFT</Link>
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative h-[350px] w-full md:h-[420px] lg:h-[450px]">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg opacity-20"></div>
              <div className="absolute top-4 left-4 right-4 bottom-4 bg-white dark:bg-gray-900 rounded-lg shadow-xl overflow-hidden">
                <img
                  src="/placeholder.svg?height=400&width=600"
                  alt="Digital artwork showcase"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
