import { Shield, Palette, Users, Coins } from "lucide-react"

export function Features() {
  const features = [
    {
      icon: <Shield className="h-10 w-10 text-primary" />,
      title: "Secure Ownership",
      description: "Blockchain technology ensures your artwork's ownership is securely recorded and verifiable.",
    },
    {
      icon: <Palette className="h-10 w-10 text-primary" />,
      title: "Showcase Your Talent",
      description: "Build your portfolio and gain recognition in the digital art community.",
    },
    {
      icon: <Users className="h-10 w-10 text-primary" />,
      title: "Community Engagement",
      description: "Connect with other artists and collectors in a collaborative environment.",
    },
    {
      icon: <Coins className="h-10 w-10 text-primary" />,
      title: "Monetize Your Art",
      description: "Sell your artwork as NFTs and earn royalties on secondary sales.",
    },
  ]

  return (
    <section className="py-16 px-4 md:px-6">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose Artfolio</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our platform provides artists with the tools they need to showcase, protect, and monetize their digital
            artwork.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
