"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { useWallet } from "@/hooks/use-wallet"
import { createNFT } from "@/lib/solana"
import { UploadDropzone } from "@/components/upload-dropzone"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function CreateNFTPage() {
  const router = useRouter()
  const { toast } = useToast()
  const wallet = useWallet()
  const { connected } = wallet
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    imageUrl: "",
  })

  const handleImageUpload = (url: string) => {
    setFormData({ ...formData, imageUrl: url })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!connected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to create an NFT",
        variant: "destructive",
      })
      return
    }

    if (!formData.title || !formData.description || !formData.price) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    try {
      setIsLoading(true)

      // Create the NFT using the Solana wallet and form data
      const nftAddress = await createNFT(wallet, formData)

      toast({
        title: "NFT Created!",
        description: "Your artwork has been successfully minted as an NFT",
      })

      router.push("/profile")
    } catch (error) {
      console.error(error)
      toast({
        title: "Error creating NFT",
        description: "There was an error creating your NFT. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-8 px-4 md:px-6 bg-muted/40">
        <div className="container mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold mb-8">Create NFT</h1>

          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Demo Mode</AlertTitle>
            <AlertDescription>
              This is running in demo mode. NFTs will be created with mock data and won't be minted on the actual
              blockchain.
            </AlertDescription>
          </Alert>

          {!connected ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-10">
                  <h2 className="text-xl font-semibold mb-4">Connect Your Wallet</h2>
                  <p className="text-muted-foreground mb-6">You need to connect your wallet to create an NFT</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <form onSubmit={handleSubmit}>
              <Card className="mb-8">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Enter the title of your artwork"
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Describe your artwork"
                        rows={4}
                      />
                    </div>

                    <div>
                      <Label htmlFor="price">Price (SOL)</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        placeholder="Set a price in SOL"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="mb-8">
                <CardContent className="pt-6">
                  <Label>Upload Artwork (Optional for Demo)</Label>
                  <p className="text-sm text-muted-foreground mb-4">
                    For this demo, image upload is optional. A placeholder image will be used if none is provided.
                  </p>
                  <UploadDropzone onUpload={handleImageUpload} />

                  {formData.imageUrl && (
                    <div className="mt-4 rounded-md overflow-hidden">
                      <img
                        src={formData.imageUrl || "/placeholder.svg"}
                        alt="Artwork preview"
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button type="submit" size="lg" disabled={isLoading}>
                  {isLoading ? "Creating..." : "Create NFT"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
