"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Star, X, SlidersHorizontal } from "lucide-react";

interface FilterSidebarProps {
  brands: Array<{ id: string; name: string }>;
  selectedBrands: string[];
  onBrandChange: (brandId: string) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  maxPrice: number;
  inStockOnly: boolean;
  onInStockChange: (value: boolean) => void;
  minRating: number;
  onRatingChange: (rating: number) => void;
  warrantyFilter: string[];
  onWarrantyChange: (warranty: string) => void;
  onClearAll: () => void;
}

export function FilterSidebar({
  brands,
  selectedBrands,
  onBrandChange,
  priceRange,
  onPriceRangeChange,
  maxPrice,
  inStockOnly,
  onInStockChange,
  minRating,
  onRatingChange,
  warrantyFilter,
  onWarrantyChange,
  onClearAll,
}: FilterSidebarProps) {
  const hasActiveFilters = selectedBrands.length > 0 || inStockOnly || minRating > 0 || warrantyFilter.length > 0 || priceRange[0] > 0 || priceRange[1] < maxPrice;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-charcoal flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </h3>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onClearAll} className="text-terracotta hover:text-terracotta-hover text-xs h-7">
            Clear All
          </Button>
        )}
      </div>

      <Separator className="bg-soft-clay/30" />

      {/* Price Range */}
      <div>
        <h4 className="text-sm font-semibold text-deep-slate mb-3">Price Range</h4>
        <Slider
          value={priceRange}
          onValueChange={(value) => onPriceRangeChange(value as [number, number])}
          min={0}
          max={maxPrice}
          step={1000}
          className="mb-2"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Rs. {priceRange[0].toLocaleString()}</span>
          <span>Rs. {priceRange[1].toLocaleString()}</span>
        </div>
      </div>

      <Separator className="bg-soft-clay/30" />

      {/* Brands */}
      {brands.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-deep-slate mb-3">Brands</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {brands.map((brand) => (
              <label key={brand.id} className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={selectedBrands.includes(brand.id)}
                  onCheckedChange={() => onBrandChange(brand.id)}
                  className="border-soft-clay data-[state=checked]:bg-terracotta data-[state=checked]:border-terracotta"
                />
                <span className="text-sm text-deep-slate">{brand.name}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      <Separator className="bg-soft-clay/30" />

      {/* In Stock */}
      <div>
        <h4 className="text-sm font-semibold text-deep-slate mb-3">Availability</h4>
        <label className="flex items-center gap-2 cursor-pointer">
          <Checkbox
            checked={inStockOnly}
            onCheckedChange={(checked) => onInStockChange(checked as boolean)}
            className="border-soft-clay data-[state=checked]:bg-terracotta data-[state=checked]:border-terracotta"
          />
          <span className="text-sm text-deep-slate">In Stock Only</span>
        </label>
      </div>

      <Separator className="bg-soft-clay/30" />

      {/* Rating */}
      <div>
        <h4 className="text-sm font-semibold text-deep-slate mb-3">Minimum Rating</h4>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <button
              key={rating}
              onClick={() => onRatingChange(minRating === rating ? 0 : rating)}
              className={`flex items-center gap-1.5 text-sm w-full text-left px-2 py-1 rounded-md transition-colors ${
                minRating === rating ? "bg-terracotta/10 text-terracotta" : "text-deep-slate hover:bg-soft-clay/20"
              }`}
            >
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3.5 w-3.5 ${
                      i < rating ? "fill-muted-gold text-muted-gold" : "fill-gray-200 text-gray-200"
                    }`}
                  />
                ))}
              </div>
              <span>& Up</span>
            </button>
          ))}
        </div>
      </div>

      <Separator className="bg-soft-clay/30" />

      {/* Warranty */}
      <div>
        <h4 className="text-sm font-semibold text-deep-slate mb-3">Warranty</h4>
        <div className="space-y-2">
          {["brand", "shop"].map((w) => (
            <label key={w} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={warrantyFilter.includes(w)}
                onCheckedChange={() => onWarrantyChange(w)}
                className="border-soft-clay data-[state=checked]:bg-terracotta data-[state=checked]:border-terracotta"
              />
              <span className="text-sm text-deep-slate">{w === "brand" ? "Brand Warranty" : "Shop Warranty"}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
