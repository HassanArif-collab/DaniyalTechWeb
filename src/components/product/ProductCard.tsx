"use client";

import Link from "next/link";
import Image from "next/image";
import { MessageCircle, Star, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPKR, getDiscountPercentage, parseJSON, cn } from "@/lib/utils";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    compareAtPrice?: number | null;
    shortDescription?: string | null;
    images: string;
    isInStock: boolean;
    totalStock: number;
    avgRating: number;
    warranty?: string | null;
    warrantyPeriod?: string | null;
    category?: { name: string; slug: string } | null;
    brand?: { name: string } | null;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const images = parseJSON<{ url: string; alt: string }[]>(product.images, []);
  const mainImage = images[0]?.url || "https://picsum.photos/seed/default/400/400";
  const discount = getDiscountPercentage(product.price, product.compareAtPrice || 0);

  const whatsappURL = typeof window !== "undefined"
    ? `https://wa.me/923001234567?text=${encodeURIComponent(
        `Hi! I'm interested in ${product.name} (${formatPKR(product.price)}). Is it available? ${window.location.origin}/product/${product.slug}`
      )}`
    : "#";

  return (
    <Card className="group overflow-hidden border-0 shadow-[0_2px_8px_rgba(26,26,46,0.06)] hover:shadow-[0_4px_16px_rgba(26,26,46,0.10)] transition-all duration-300 hover:-translate-y-0.5 bg-white rounded-xl">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-ivory-cream">
          <Image
            src={mainImage}
            alt={images[0]?.alt || product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          {discount > 0 && (
            <Badge className="absolute top-3 left-3 bg-terracotta text-white text-xs font-semibold rounded-md">
              -{discount}%
            </Badge>
          )}
          {!product.isInStock && (
            <div className="absolute inset-0 bg-charcoal/50 flex items-center justify-center">
              <span className="text-white font-semibold text-sm bg-error-red px-3 py-1 rounded-md">Out of Stock</span>
            </div>
          )}
        </div>
      </Link>
      <CardContent className="p-4">
        {product.brand && (
          <p className="text-xs text-muted-foreground font-medium mb-1">{product.brand.name}</p>
        )}
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-semibold text-charcoal text-sm leading-snug line-clamp-2 hover:text-terracotta transition-colors min-h-[2.5rem]">
            {product.name}
          </h3>
        </Link>
        {product.shortDescription && (
          <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{product.shortDescription}</p>
        )}
        <div className="flex items-baseline gap-2 mt-2">
          <span className="font-mono text-lg font-semibold text-charcoal">
            {formatPKR(product.price)}
          </span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="font-mono text-sm text-muted-foreground line-through">
              {formatPKR(product.compareAtPrice)}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-1">
          {product.avgRating > 0 && (
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-muted-gold text-muted-gold" />
              <span className="text-xs text-muted-foreground">{product.avgRating.toFixed(1)}</span>
            </div>
          )}
          {product.warranty && product.warranty !== "none" && (
            <div className="flex items-center gap-1">
              <ShieldCheck className="h-3 w-3 text-sage-green" />
              <span className="text-xs text-sage-green font-medium">{product.warranty === "brand" ? "Brand Warranty" : "Shop Warranty"}</span>
            </div>
          )}
        </div>
        <a href={whatsappURL} target="_blank" rel="noopener noreferrer" className="block mt-3">
          <Button className="w-full bg-terracotta hover:bg-terracotta-hover text-white text-sm rounded-lg h-9">
            <MessageCircle className="h-4 w-4 mr-1.5" />
            Buy on WhatsApp
          </Button>
        </a>
      </CardContent>
    </Card>
  );
}
