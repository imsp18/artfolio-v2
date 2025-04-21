"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export function ArtworkFilter({ onFilterChange }) {
  const [priceRange, setPriceRange] = useState([0, 10])
  const [sortBy, setSortBy] = useState("newest")

  const categories = [
    { id: "digital", label: "Digital Art" },
    { id: "illustration", label: "Illustration" },
    { id: "photography", label: "Photography" },
    { id: "3d", label: "3D Art" },
    { id: "animation", label: "Animation" },
    { id: "pixel", label: "Pixel Art" },
  ]

  const handleSortChange = (value) => {
    setSortBy(value)
    if (onFilterChange) {
      onFilterChange({ type: "sort", value })
    }
  }

  const handleApplyFilters = () => {
    if (onFilterChange) {
      onFilterChange({
        type: "filters",
        value: {
          priceRange,
          sortBy,
        },
      })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Filters</h3>
        <div className="relative">
          <Input placeholder="Search artwork..." />
        </div>
      </div>

      <Accordion type="single" collapsible defaultValue="sort">
        <AccordionItem value="sort">
          <AccordionTrigger>Sort By</AccordionTrigger>
          <AccordionContent>
            <RadioGroup value={sortBy} onValueChange={handleSortChange}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="newest" id="newest" />
                <Label htmlFor="newest">Newest</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="oldest" id="oldest" />
                <Label htmlFor="oldest">Oldest</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="price-low" id="price-low" />
                <Label htmlFor="price-low">Price: Low to High</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="price-high" id="price-high" />
                <Label htmlFor="price-high">Price: High to Low</Label>
              </div>
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="categories">
          <AccordionTrigger>Categories</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox id={category.id} />
                  <Label htmlFor={category.id}>{category.label}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price">
          <AccordionTrigger>Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <Slider defaultValue={[0, 10]} max={10} step={0.1} value={priceRange} onValueChange={setPriceRange} />
              <div className="flex items-center justify-between">
                <span>{priceRange[0]} SOL</span>
                <span>{priceRange[1]} SOL</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Button className="w-full" onClick={handleApplyFilters}>
        Apply Filters
      </Button>
    </div>
  )
}
