"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { useWallet } from "@/hooks/use-wallet"
import { buyNFT } from "@/lib/solana"
import { NFTCard } from "@/components/nft-card"
import { fetchNFTById, fetchAllNFTs } from "@/lib/solana"
import { AlertCircle, ArrowLeft, Share2, Heart, ExternalLink, Info, Tag } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"

export default function NFTDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const wallet = useWallet()
  const { connected, publicKey } = wallet
  const [nft, setNft] = useState(null)
  const [relatedNFTs, setRelatedNFTs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isPurchasing, setIsPurchasing] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const nftId = params.id

  useEffect(() => {
    const loadNFT = async () => {
      try {
        setIsLoading(true)
        const nftData = await fetchNFTById(nftId)
        setNft(nftData)

        // Fetch related NFTs
        const allNFTs = await fetchAllNFTs()
        const related = allNFTs
          .filter((item) => item.id !== nftId)
          .sort(() => 0.5 - Math.random())
          .slice(0, 3)
        setRelatedNFTs(related)
      } catch (error) {
        console.error("Error loading NFT:", error)
        toast({
          title: "Error",
          description: "Failed to load NFT details. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (nftId) {
      loadNFT()
    }
  }, [nftId, toast])

  const handlePurchase = async () => {
    if (!connected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to purchase this NFT",
        variant: "destructive",
      })
      return
    }

    try {
      setIsPurchasing(true)
      const price = Number.parseFloat(nft.price.split(" ")[0])
      const txSignature = await buyNFT(wallet, nft.id, price)

      toast({
        title: "Purchase Successful!",
        description: "You have successfully purchased this NFT",
      })

      // Refresh the page to update ownership
      router.refresh()
    } catch (error) {
      console.error("Error purchasing NFT:", error)
      toast({
        title: "Purchase Failed",
        description: "There was an error purchasing this NFT. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsPurchasing(false)
    }
  }

  const isOwner = connected && publicKey && nft?.creator === publicKey.toString()

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 py-8 px-4 md:px-6 bg-muted/40">
          <div className="container mx-auto max-w-6xl">
            <div className="mb-6">
              <Skeleton className="h-8 w-32" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Skeleton className="aspect-square w-full rounded-lg" />
              <div className="space-y-6">
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!nft) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 py-8 px-4 md:px-6 bg-muted/40">
          <div className="container mx-auto max-w-6xl text-center py-12">
            <h2 className="text-2xl font-bold mb-4">NFT Not Found</h2>
            <p className="text-muted-foreground mb-6">The NFT you're looking for doesn't exist or has been removed.</p>
            <Button asChild>
              <Link href="/discover">Back to Discover</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // Check if the NFT was created in the last 24 hours
  const isNew = nft.createdAt ? new Date(nft.createdAt) > new Date(Date.now() - 24 * 60 * 60 * 1000) : false

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-8 px-4 md:px-6 bg-muted/40">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-6">
            <Button variant="ghost" size="sm" asChild className="mb-4">
              <Link href="/discover">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Discover
              </Link>
            </Button>
          </div>

          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Demo Mode</AlertTitle>
            <AlertDescription>
              This is running in demo mode. NFT purchases will be simulated and won't involve actual blockchain
              transactions.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* NFT Image */}
            <div className="relative">
              <div
                className={`relative ${
                  isFullscreen
                    ? "fixed inset-0 z-50 flex items-center justify-center bg-background/90 p-8"
                    : "aspect-square"
                }`}
              >
                <img
                  src={nft.image || "/placeholder.svg"}
                  alt={nft.title}
                  className={`${
                    isFullscreen ? "max-h-full max-w-full object-contain" : "w-full h-full object-cover rounded-lg"
                  }`}
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute top-4 right-4 bg-background/50 backdrop-blur-sm"
                  onClick={toggleFullscreen}
                >
                  {isFullscreen ? <ArrowLeft className="h-4 w-4" /> : <ExternalLink className="h-4 w-4" />}
                </Button>
                {isNew && <Badge className="absolute top-4 left-4 bg-green-500 hover:bg-green-600">New</Badge>}
              </div>
            </div>

            {/* NFT Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">{nft.title}</h1>
                <p className="text-muted-foreground">
                  Created by{" "}
                  <span className="font-medium">
                    {nft.creator.substring(0, 6)}...{nft.creator.substring(nft.creator.length - 4)}
                  </span>
                </p>
              </div>

              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm">
                  <Heart className="mr-2 h-4 w-4" />
                  Favorite
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">Description</h2>
                <p className="text-muted-foreground">{nft.description || "No description provided."}</p>
              </div>

              <Card>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Current Price</p>
                      <p className="text-2xl font-bold">{nft.price}</p>
                    </div>
                    {nft.listed && !isOwner ? (
                      <Button onClick={handlePurchase} disabled={isPurchasing || !connected}>
                        {isPurchasing ? "Processing..." : "Buy Now"}
                      </Button>
                    ) : isOwner ? (
                      <Badge>You Own This</Badge>
                    ) : (
                      <Badge variant="outline">Not For Sale</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Tabs defaultValue="details">
                <TabsList className="w-full">
                  <TabsTrigger value="details" className="flex-1">
                    Details
                  </TabsTrigger>
                  <TabsTrigger value="properties" className="flex-1">
                    Properties
                  </TabsTrigger>
                  <TabsTrigger value="history" className="flex-1">
                    History
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="details" className="space-y-4 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Contract Address</p>
                      <p className="font-mono text-sm truncate">{nft.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Token Standard</p>
                      <p>Solana NFT</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Blockchain</p>
                      <p>Solana</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Created</p>
                      <p>{nft.createdAt ? new Date(nft.createdAt).toLocaleDateString() : "Unknown"}</p>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="properties" className="pt-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="border rounded-md p-3">
                      <p className="text-xs text-muted-foreground uppercase">Type</p>
                      <p className="font-medium">Digital Art</p>
                    </div>
                    <div className="border rounded-md p-3">
                      <p className="text-xs text-muted-foreground uppercase">Size</p>
                      <p className="font-medium">2048 x 2048</p>
                    </div>
                    <div className="border rounded-md p-3">
                      <p className="text-xs text-muted-foreground uppercase">Format</p>
                      <p className="font-medium">PNG</p>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="history" className="pt-4">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="mt-1 bg-primary/10 p-2 rounded-full">
                        <Info className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Minted</p>
                        <p className="text-sm text-muted-foreground">
                          {nft.createdAt ? new Date(nft.createdAt).toLocaleString() : "Unknown date"}
                        </p>
                      </div>
                    </div>
                    {nft.listed && (
                      <div className="flex items-start space-x-3">
                        <div className="mt-1 bg-primary/10 p-2 rounded-full">
                          <Tag className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Listed for sale</p>
                          <p className="text-sm text-muted-foreground">
                            {nft.createdAt
                              ? new Date(new Date(nft.createdAt).getTime() + 3600000).toLocaleString()
                              : "Unknown date"}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Related NFTs */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">More Like This</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedNFTs.map((relatedNft) => (
                <NFTCard key={relatedNft.id} nft={relatedNft} />
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
