import { Connection, type PublicKey, clusterApiUrl } from "@solana/web3.js"
import type { WalletContextState } from "@solana/wallet-adapter-react"

// Create a connection to the Solana devnet
const connection = new Connection(clusterApiUrl("devnet"))

// Mock database for demo purposes
// In a real application, this would be stored in a database
const mockNFTDatabase: NFT[] = [
  {
    id: "1",
    title: "Abstract Harmony",
    creator: "0x8a23...45f1",
    price: "2.5 SOL",
    image: "/placeholder.svg?height=300&width=300",
    description: "A vibrant abstract piece exploring the harmony of colors and shapes.",
    listed: true,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
  },
  {
    id: "2",
    title: "Digital Dreamscape",
    creator: "0x7b12...9e23",
    price: "1.8 SOL",
    image: "/placeholder.svg?height=300&width=300",
    description: "Journey through a surreal digital landscape of dreams and imagination.",
    listed: true,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
  },
  {
    id: "3",
    title: "Neon Wilderness",
    creator: "0x3f67...12d4",
    price: "3.2 SOL",
    image: "/placeholder.svg?height=300&width=300",
    description: "A neon-infused exploration of wild nature in the digital age.",
    listed: true,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
  },
  {
    id: "4",
    title: "Cosmic Perspective",
    creator: "0x9c34...78b2",
    price: "4.0 SOL",
    image: "/placeholder.svg?height=300&width=300",
    description: "A glimpse into the vastness of the cosmos from a unique perspective.",
    listed: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  },
  {
    id: "5",
    title: "Ethereal Landscape",
    creator: "0x2d56...34a9",
    price: "2.1 SOL",
    image: "/placeholder.svg?height=300&width=300",
    description: "An ethereal landscape that blends reality with the supernatural.",
    listed: true,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  },
  {
    id: "6",
    title: "Pixel Revolution",
    creator: "0x6e87...91c3",
    price: "1.5 SOL",
    image: "/placeholder.svg?height=300&width=300",
    description: "A revolution of pixels creating a nostalgic yet futuristic aesthetic.",
    listed: true,
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
  },
]

interface NFT {
  id: string
  title: string
  creator: string
  price: string
  image: string
  description?: string
  listed?: boolean
  createdAt?: string
}

interface NFTFormData {
  title: string
  description: string
  price: string
  imageUrl: string
}

// Safe fetch function with timeout
async function safeFetch(url: string, timeout = 5000) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, { signal: controller.signal })
    clearTimeout(timeoutId)
    return response
  } catch (error) {
    clearTimeout(timeoutId)
    throw error
  }
}

// Function to create an NFT - DEMO MODE
export async function createNFT(wallet: WalletContextState, formData: NFTFormData): Promise<string | null> {
  if (!wallet.publicKey || !wallet.signTransaction) {
    throw new Error("Wallet not connected")
  }

  try {
    console.log("Creating NFT in demo mode...")

    // Simulate a delay to mimic blockchain transaction time
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Generate a random mock NFT address
    const mockNftAddress = Array.from(
      { length: 44 },
      () => "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"[Math.floor(Math.random() * 62)],
    ).join("")

    // Add the NFT to our mock database
    const newNFT: NFT = {
      id: mockNftAddress,
      title: formData.title,
      creator: wallet.publicKey.toString(),
      price: `${formData.price} SOL`,
      image: formData.imageUrl || "/placeholder.svg?height=300&width=300",
      description: formData.description,
      listed: false, // Initially not listed
      createdAt: new Date().toISOString(),
    }

    mockNFTDatabase.push(newNFT)
    console.log("NFT created with mock address:", mockNftAddress)

    return mockNftAddress
  } catch (error) {
    console.error("Error in demo NFT creation:", error)
    throw new Error("Failed to create NFT in demo mode")
  }
}

// Function to list an NFT for sale - DEMO MODE
export async function listNFTForSale(wallet: WalletContextState, nftId: string, price: string): Promise<boolean> {
  if (!wallet.publicKey) {
    throw new Error("Wallet not connected")
  }

  try {
    console.log("Listing NFT for sale in demo mode...")

    // Simulate a delay to mimic blockchain transaction time
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Find the NFT in our mock database
    const nftIndex = mockNFTDatabase.findIndex((nft) => nft.id === nftId)
    if (nftIndex === -1) {
      throw new Error("NFT not found")
    }

    // Check if the NFT belongs to the wallet
    if (mockNFTDatabase[nftIndex].creator !== wallet.publicKey.toString()) {
      throw new Error("You don't own this NFT")
    }

    // Update the NFT in our mock database
    mockNFTDatabase[nftIndex] = {
      ...mockNFTDatabase[nftIndex],
      price: `${price} SOL`,
      listed: true,
    }

    console.log("NFT listed for sale:", nftId)
    return true
  } catch (error) {
    console.error("Error listing NFT for sale:", error)
    throw error
  }
}

// Function to fetch NFTs owned by a wallet - DEMO MODE
export async function getNFTs(publicKey: PublicKey): Promise<NFT[]> {
  try {
    console.log("Fetching NFTs in demo mode...")

    // Filter NFTs owned by this wallet from our mock database
    const userNFTs = mockNFTDatabase.filter((nft) => nft.creator === publicKey.toString())

    // If the user has no NFTs yet, return some mock ones
    if (userNFTs.length === 0) {
      return [
        {
          id: "user-nft-1",
          title: "My First NFT",
          creator: publicKey.toString(),
          price: "1.5 SOL",
          image: "/placeholder.svg?height=300&width=300",
          description: "This is a demo NFT created on the Solana blockchain.",
          listed: false,
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "user-nft-2",
          title: "Digital Masterpiece",
          creator: publicKey.toString(),
          price: "2.0 SOL",
          image: "/placeholder.svg?height=300&width=300",
          description: "A beautiful digital artwork created as an NFT.",
          listed: true,
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ]
    }

    return userNFTs
  } catch (error) {
    console.error("Error fetching NFTs in demo mode:", error)
    return []
  }
}

// Function to fetch a specific NFT by ID - DEMO MODE
export async function fetchNFTById(id: string): Promise<NFT | null> {
  try {
    console.log("Fetching NFT by ID in demo mode:", id)

    // Find the NFT in our mock database
    const nft = mockNFTDatabase.find((nft) => nft.id === id)

    if (!nft) {
      console.log("NFT not found:", id)
      return null
    }

    return nft
  } catch (error) {
    console.error("Error fetching NFT by ID:", error)
    return null
  }
}

// Function to fetch all NFTs in the marketplace - DEMO MODE
export async function fetchAllNFTs(): Promise<NFT[]> {
  try {
    // Return all listed NFTs from our mock database
    return mockNFTDatabase.filter((nft) => nft.listed)
  } catch (error) {
    console.error("Error fetching marketplace NFTs:", error)
    return []
  }
}

// Function to buy an NFT - DEMO MODE
export async function buyNFT(wallet: WalletContextState, nftAddress: string, price: number): Promise<string> {
  if (!wallet.publicKey || !wallet.signTransaction) {
    throw new Error("Wallet not connected")
  }

  try {
    console.log("Buying NFT in demo mode...")

    // Simulate a delay to mimic blockchain transaction time
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Find the NFT in our mock database
    const nftIndex = mockNFTDatabase.findIndex((nft) => nft.id === nftAddress)
    if (nftIndex === -1) {
      throw new Error("NFT not found")
    }

    // Update the NFT in our mock database
    mockNFTDatabase[nftIndex] = {
      ...mockNFTDatabase[nftIndex],
      creator: wallet.publicKey.toString(), // Transfer ownership
      listed: false, // No longer listed after purchase
    }

    // Generate a mock transaction signature
    const mockSignature = Array.from(
      { length: 88 },
      () => "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"[Math.floor(Math.random() * 62)],
    ).join("")

    console.log("NFT purchased with mock transaction:", mockSignature)

    return mockSignature
  } catch (error) {
    console.error("Error in demo NFT purchase:", error)
    throw new Error("Failed to purchase NFT in demo mode")
  }
}
