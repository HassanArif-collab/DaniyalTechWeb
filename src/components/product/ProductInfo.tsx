"use client";

import { MessageCircle, Star, ShieldCheck, Truck, Share2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatPKR, getDiscountPercentage, parseJSON, buildWhatsAppURL } from "@/lib/utils";

interface ProductInfoProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    compareAtPrice?: number | null;
    description?: string | null;
    shortDescription?: string | null;
    isInStock: boolean;
    totalStock: number;
    avgRating: number;
    reviewCount: number;
    specifications: string;
    warranty?: string | null;
    warrantyPeriod?: string | null;
    category?: { name: string; slug: string } | null;
    brand?: { name: string } | null;
  };
}

export function ProductInfo({ product }: ProductInfoProps) {
  const specs = parseJSON<Record<string, string>>(product.specifications, {});
  const discount = getDiscountPercentage(product.price, product.compareAtPrice || 0);
  const whatsappURL = typeof window !== "undefined"
    ? buildWhatsAppURL(product.name, formatPKR(product.price), `${window.location.origin}/product/${product.slug}`, "923001234567")
    : "#";

  return (
    <div className="space-y-5">
      {/* Brand & Category */}
      <div className="flex items-center gap-2 flex-wrap">
        {product.brand && (
          <Badge variant="secondary" className="bg-soft-clay/30 text-deep-slate font-medium">
            {product.brand.name}
          </Badge>
        )}
        {product.category && (
          <Badge variant="outline" className="text-muted-foreground">
            {product.category.name}
          </Badge>
        )}
      </div>

      {/* Product Name */}
      <h1 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal leading-tight">
        {product.name}
      </h1>

      {/* Rating */}
      {product.avgRating > 0 && (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-4 w-4 ${
                  star <= Math.round(product.avgRating)
                    ? "fill-muted-gold text-muted-gold"
                    : "fill-gray-200 text-gray-200"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            {product.avgRating.toFixed(1)} ({product.reviewCount} reviews)
          </span>
        </div>
      )}

      {/* Price */}
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-3xl font-bold text-charcoal">
          {formatPKR(product.price)}
        </span>
        {product.compareAtPrice && product.compareAtPrice > product.price && (
          <>
            <span className="font-mono text-lg text-muted-foreground line-through">
              {formatPKR(product.compareAtPrice)}
            </span>
            <Badge className="bg-terracotta text-white text-sm font-semibold rounded-md">
              -{discount}% OFF
            </Badge>
          </>
        )}
      </div>

      {/* Stock Status */}
      <div className="flex items-center gap-2">
        {product.isInStock ? (
          <>
            <Check className="h-4 w-4 text-sage-green" />
            <span className="text-sm font-medium text-sage-green">In Stock</span>
            {product.totalStock <= 5 && product.totalStock > 0 && (
              <span className="text-xs text-terracotta font-medium ml-2">Only {product.totalStock} left!</span>
            )}
          </>
        ) : (
          <span className="text-sm font-medium text-error-red">Out of Stock</span>
        )}
      </div>

      {/* Short Description */}
      {product.shortDescription && (
        <p className="text-deep-slate leading-relaxed">{product.shortDescription}</p>
      )}

      <Separator className="bg-soft-clay/30" />

      {/* Key Info Badges */}
      <div className="flex flex-wrap gap-3">
        {product.warranty && product.warranty !== "none" && (
          <div className="flex items-center gap-1.5 text-sm">
            <ShieldCheck className="h-4 w-4 text-sage-green" />
            <span className="font-medium text-deep-slate">
              {product.warranty === "brand" ? "Brand Warranty" : "Shop Warranty"}
              {product.warrantyPeriod ? ` - ${product.warrantyPeriod}` : ""}
            </span>
          </div>
        )}
        <div className="flex items-center gap-1.5 text-sm">
          <Truck className="h-4 w-4 text-sage-green" />
          <span className="font-medium text-deep-slate">Cash on Delivery</span>
        </div>
      </div>

      {/* WhatsApp Buy Button */}
      <a href={whatsappURL} target="_blank" rel="noopener noreferrer" className="block">
        <Button className="w-full h-14 bg-terracotta hover:bg-terracotta-hover text-white text-base font-semibold rounded-xl shadow-[0_2px_4px_rgba(193,105,79,0.25)] hover:shadow-[0_4px_8px_rgba(193,105,79,0.3)] transition-all">
          <MessageCircle className="h-5 w-5 mr-2" />
          Buy on WhatsApp
        </Button>
      </a>

      <p className="text-xs text-muted-foreground text-center">
        Click the button above to chat with us on WhatsApp and place your order
      </p>

      <Separator className="bg-soft-clay/30" />

      {/* Specifications */}
      {Object.keys(specs).length > 0 && (
        <div>
          <h3 className="font-semibold text-charcoal mb-3">Specifications</h3>
          <div className="space-y-2">
            {Object.entries(specs).map(([key, value]) => (
              <div key={key} className="flex justify-between text-sm py-1.5 border-b border-soft-clay/20">
                <span className="text-muted-foreground font-medium">{key}</span>
                <span className="text-deep-slate font-medium">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Description */}
      {product.description && (
        <div>
          <h3 className="font-semibold text-charcoal mb-2">Description</h3>
          <div className="text-sm text-deep-slate leading-relaxed whitespace-pre-wrap">
            {product.description}
          </div>
        </div>
      )}
    </div>
  );
}
