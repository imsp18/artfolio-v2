"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useWallet } from "@/hooks/use-wallet"
import { getNFTs } from "@/lib/solana"
import { NFTCard } from "@/components/nft-card"
import { Skeleton } from "@/components/ui/skeleton"
import { ListNFTDialog } from "@/components/list-nft-dialog"

export default function ProfilePage() {
  const { connected, publicKey } = useWallet()
  const [isLoading, setIsLoading] = useState(true)
  const [nfts, setNfts] = useState([])
  const [selectedNFT, setSelectedNFT] = useState(null)
  const [isListDialogOpen, setIsListDialogOpen] = useState(false)

  useEffect(() => {
    const fetchNFTs = async () => {
      if (connected && publicKey) {
        try {
          setIsLoading(true)
          const userNFTs = await getNFTs(publicKey)
          setNfts(userNFTs)
        } catch (error) {
          console.error("Error fetching NFTs:", error)
        } finally {
          setIsLoading(false)
        }
      } else {
        setIsLoading(false)
      }
    }

    fetchNFTs()
  }, [connected, publicKey])

  const handleListForSale = (nft) => {
    setSelectedNFT(nft)
    setIsListDialogOpen(true)
  }

  const handleListSuccess = () => {
    // Refresh NFTs after listing
    if (connected && publicKey) {
      getNFTs(publicKey).then(setNfts)
    }
  }

  if (!connected) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 py-8 px-4 md:px-6 bg-muted/40">
          <div className="container mx-auto max-w-4xl">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-10">
                  <h2 className="text-xl font-semibold mb-4">Connect Your Wallet</h2>
                  <p className="text-muted-foreground mb-6">You need to connect your wallet to view your profile</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // Filter NFTs by listed status
  const createdNFTs = nfts.filter((nft) => !nft.listed)
  const listedNFTs = nfts.filter((nft) => nft.listed)

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-8 px-4 md:px-6 bg-muted/40">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Profile" />
                <AvatarFallback>{publicKey?.toString().substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>

              <div className="flex-1 text-center md:text-left">
                <h1 className="text-2xl font-bold">
                  {publicKey?.toString().substring(0, 6)}...
                  {publicKey?.toString().substring(publicKey.toString().length - 4)}
                </h1>
                <p className="text-muted-foreground mb-4">Joined April 2023</p>
                <Button variant="outline" size="sm">
                  Edit Profile
                </Button>
              </div>
            </div>
          </div>

          <Tabs defaultValue="created">
            <TabsList className="mb-6">
              <TabsTrigger value="created">Created</TabsTrigger>
              <TabsTrigger value="listed">Listed</TabsTrigger>
              <TabsTrigger value="collected">Collected</TabsTrigger>
              <TabsTrigger value="favorited">Favorited</TabsTrigger>
            </TabsList>

            <TabsContent value="created" className="mt-0">
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <Card key={i}>
                      <CardContent className="p-0">
                        <Skeleton className="w-full h-48" />
                        <div className="p-4">
                          <Skeleton className="h-4 w-3/4 mb-2" />
                          <Skeleton className="h-4 w-1/2" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : createdNFTs.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {createdNFTs.map((nft) => (
                    <NFTCard key={nft.id} nft={nft} isOwner={true} onListForSale={() => handleListForSale(nft)} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium mb-2">No NFTs created yet</h3>
                  <p className="text-muted-foreground mb-6">Start creating your first NFT to showcase your artwork</p>
                  <Button asChild>
                    <a href="/create">Create NFT</a>
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="listed" className="mt-0">
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <Card key={i}>
                      <CardContent className="p-0">
                        <Skeleton className="w-full h-48" />
                        <div className="p-4">
                          <Skeleton className="h-4 w-3/4 mb-2" />
                          <Skeleton className="h-4 w-1/2" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : listedNFTs.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {listedNFTs.map((nft) => (
                    <NFTCard key={nft.id} nft={nft} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium mb-2">No NFTs listed for sale</h3>
                  <p className="text-muted-foreground mb-6">List your created NFTs for sale on the marketplace</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="collected" className="mt-0">
              <div className="text-center py-12">
                <h3 className="text-lg font-medium mb-2">No collected NFTs</h3>
                <p className="text-muted-foreground mb-6">Explore the marketplace to find and collect NFTs</p>
                <Button asChild>
                  <a href="/discover">Explore Marketplace</a>
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="favorited" className="mt-0">
              <div className="text-center py-12">
                <h3 className="text-lg font-medium mb-2">No favorited NFTs</h3>
                <p className="text-muted-foreground mb-6">Browse the marketplace and favorite NFTs you like</p>
                <Button asChild>
                  <a href="/discover">Explore Marketplace</a>
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />

      {selectedNFT && (
        <ListNFTDialog
          nftId={selectedNFT.id}
          nftTitle={selectedNFT.title}
          isOpen={isListDialogOpen}
          onClose={() => setIsListDialogOpen(false)}
          onSuccess={handleListSuccess}
        />
      )}
    </div>
  )
}
