"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useWallet } from "@/hooks/use-wallet"
import { listNFTForSale } from "@/lib/solana"

interface ListNFTDialogProps {
  nftId: string
  nftTitle: string
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function ListNFTDialog({ nftId, nftTitle, isOpen, onClose, onSuccess }: ListNFTDialogProps) {
  const [price, setPrice] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const wallet = useWallet()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!price || Number.parseFloat(price) <= 0) {
      toast({
        title: "Invalid price",
        description: "Please enter a valid price greater than 0",
        variant: "destructive",
      })
      return
    }

    try {
      setIsLoading(true)
      await listNFTForSale(wallet, nftId, price)

      toast({
        title: "NFT Listed",
        description: "Your NFT has been successfully listed for sale",
      })

      onSuccess()
      onClose()
    } catch (error) {
      console.error("Error listing NFT:", error)
      toast({
        title: "Error listing NFT",
        description: "There was an error listing your NFT. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>List NFT for Sale</DialogTitle>
          <DialogDescription>Set a price for your NFT "{nftTitle}" to list it on the marketplace.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Price
              </Label>
              <div className="col-span-3 flex items-center">
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  className="flex-1"
                />
                <span className="ml-2">SOL</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Listing..." : "List for Sale"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
