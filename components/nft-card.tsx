"use client"

import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Tag } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface NFTCardProps {
  nft: {
    id: string
    title: string
    creator: string
    price: string
    image: string
    description?: string
    listed?: boolean
    createdAt?: string
  }
  isOwner?: boolean
  onListForSale?: (id: string) => void
}

export function NFTCard({ nft, isOwner = false, onListForSale }: NFTCardProps) {
  // Check if the NFT was created in the last 24 hours
  const isNew = nft.createdAt ? new Date(nft.createdAt) > new Date(Date.now() - 24 * 60 * 60 * 1000) : false

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="aspect-square relative">
        <Link href={`/nft/${nft.id}`}>
          <img src={nft.image || "/placeholder.svg"} alt={nft.title} className="object-cover w-full h-full" />
          {isNew && <Badge className="absolute top-2 right-2 bg-green-500 hover:bg-green-600">New</Badge>}
        </Link>
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold truncate">
              <Link href={`/nft/${nft.id}`} className="hover:underline">
                {nft.title}
              </Link>
            </h3>
            <p className="text-sm text-muted-foreground">
              by {nft.creator.substring(0, 6)}...{nft.creator.substring(nft.creator.length - 4)}
            </p>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Heart className="h-4 w-4" />
            <span className="sr-only">Add to favorites</span>
          </Button>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <div className="font-medium">{nft.price}</div>
        {isOwner && !nft.listed ? (
          <Button size="sm" onClick={() => onListForSale && onListForSale(nft.id)}>
            <Tag className="h-4 w-4 mr-2" />
            List for Sale
          </Button>
        ) : (
          <Button asChild size="sm">
            <Link href={`/nft/${nft.id}`}>View</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
