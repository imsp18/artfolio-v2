"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ArtworkGrid } from "@/components/artwork-grid"
import { ArtworkFilter } from "@/components/artwork-filter"

export default function DiscoverPage() {
  const [filterParams, setFilterParams] = useState({})

  const handleFilterChange = (params) => {
    setFilterParams(params)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-8 px-4 md:px-6 bg-muted/40">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-8">Discover Artwork</h1>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <ArtworkFilter onFilterChange={handleFilterChange} />
            </div>
            <div className="lg:col-span-3">
              <ArtworkGrid />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
