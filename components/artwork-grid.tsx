"use client"

import { useState, useEffect } from "react"
import { NFTCard } from "@/components/nft-card"
import { Skeleton } from "@/components/ui/skeleton"
import { fetchAllNFTs } from "@/lib/solana"

export function ArtworkGrid() {
  const [isLoading, setIsLoading] = useState(true)
  const [nfts, setNfts] = useState([])
  const [filteredNfts, setFilteredNfts] = useState([])
  const [filters, setFilters] = useState({
    sortBy: "newest",
  })

  useEffect(() => {
    const loadNFTs = async () => {
      try {
        setIsLoading(true)
        const allNFTs = await fetchAllNFTs()
        setNfts(allNFTs)
        setFilteredNfts(sortNFTs(allNFTs, filters.sortBy))
      } catch (error) {
        console.error("Error loading NFTs:", error)
        setNfts([])
        setFilteredNfts([])
      } finally {
        setIsLoading(false)
      }
    }

    loadNFTs()
  }, [])

  const handleFilterChange = (filterUpdate) => {
    if (filterUpdate.type === "sort") {
      const newSortBy = filterUpdate.value
      setFilters((prev) => ({ ...prev, sortBy: newSortBy }))
      setFilteredNfts(sortNFTs(nfts, newSortBy))
    } else if (filterUpdate.type === "filters") {
      // Apply other filters here
      setFilters((prev) => ({ ...prev, ...filterUpdate.value }))

      // For now, just apply sorting
      setFilteredNfts(sortNFTs(nfts, filterUpdate.value.sortBy))
    }
  }

  const sortNFTs = (nftList, sortBy) => {
    const sorted = [...nftList]

    switch (sortBy) {
      case "newest":
        return sorted.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
          return dateB - dateA
        })
      case "oldest":
        return sorted.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
          return dateA - dateB
        })
      case "price-low":
        return sorted.sort((a, b) => {
          const priceA = Number.parseFloat(a.price.split(" ")[0]) || 0
          const priceB = Number.parseFloat(b.price.split(" ")[0]) || 0
          return priceA - priceB
        })
      case "price-high":
        return sorted.sort((a, b) => {
          const priceA = Number.parseFloat(a.price.split(" ")[0]) || 0
          const priceB = Number.parseFloat(b.price.split(" ")[0]) || 0
          return priceB - priceA
        })
      default:
        return sorted
    }
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-48 w-full rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (filteredNfts.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium mb-2">No NFTs found</h3>
        <p className="text-muted-foreground">Check back later for new artwork or try a different filter.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredNfts.map((nft) => (
        <NFTCard key={nft.id} nft={nft} />
      ))}
    </div>
  )
}
