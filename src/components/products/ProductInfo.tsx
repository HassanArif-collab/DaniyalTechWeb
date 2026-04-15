'use client'

import { Star, Shield, Truck, MessageCircle, CheckCircle, AlertCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { formatPKR, getDiscountPercentage, parseJSON, buildWhatsAppURL } from '@/lib/utils'

interface ProductInfoProps {
  product: {
    id: string
    name: string
    slug: string
    price: number
    compareAtPrice: number | null
    currency: string
    description: string | null
    shortDescription: string | null
    isInStock: boolean
    avgRating: number
    reviewCount: number
    totalStock: number
    specifications: string
    warranty: string | null
    warrantyPeriod: string | null
    category: { name: string; slug: string }
    brand?: { name: string } | null
    productTags?: { tag: { name: string; slug: string } }[]
  }
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const discount = product.compareAtPrice
    ? getDiscountPercentage(product.price, product.compareAtPrice)
    : 0
  const specs = parseJSON<Record<string, string>>(product.specifications, {})
  const whatsappURL = buildWhatsAppURL(
    product.name,
    formatPKR(product.price),
    typeof window !== 'undefined' ? window.location.href : ''
  )

  return (
    <div className="flex flex-col gap-5">
      {/* Tags */}
      {product.productTags && product.productTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {product.productTags.map((pt) => (
            <Badge key={pt.tag.slug} variant="outline" className="text-xs">
              {pt.tag.name}
            </Badge>
          ))}
        </div>
      )}

      {/* Category & Brand */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>{product.category.name}</span>
        {product.brand && (
          <>
            <span>•</span>
            <span className="font-medium text-terracotta">{product.brand.name}</span>
          </>
        )}
      </div>

      {/* Name */}
      <h1 className="text-2xl sm:text-3xl font-bold text-charcoal leading-tight">{product.name}</h1>

      {/* Rating */}
      {product.avgRating > 0 && (
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-4 w-4 ${star <= Math.round(product.avgRating) ? 'fill-muted-gold text-muted-gold' : 'text-muted-foreground/30'}`}
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
        <span className="text-3xl font-bold text-charcoal font-mono">
          {formatPKR(product.price)}
        </span>
        {product.compareAtPrice && product.compareAtPrice > product.price && (
          <>
            <span className="text-lg text-muted-foreground line-through font-mono">
              {formatPKR(product.compareAtPrice)}
            </span>
            <Badge className="bg-error-red text-white font-semibold">
              Save {discount}%
            </Badge>
          </>
        )}
      </div>

      {/* Stock Status */}
      <div className="flex items-center gap-2">
        {product.isInStock ? (
          <>
            <CheckCircle className="h-4 w-4 text-sage-green" />
            <span className="text-sm font-medium text-sage-green">In Stock</span>
            {product.totalStock <= 5 && (
              <span className="text-xs text-muted-gold">Only {product.totalStock} left!</span>
            )}
          </>
        ) : (
          <>
            <AlertCircle className="h-4 w-4 text-error-red" />
            <span className="text-sm font-medium text-error-red">Out of Stock</span>
          </>
        )}
      </div>

      {/* Short Description */}
      {product.shortDescription && (
        <p className="text-sm text-muted-foreground leading-relaxed">{product.shortDescription}</p>
      )}

      <Separator />

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <a href={whatsappURL} target="_blank" rel="noopener noreferrer" className="flex-1">
          <Button className="w-full bg-[#25D366] hover:bg-[#20BD5A] text-white gap-2 h-12 text-base">
            <MessageCircle className="h-5 w-5" />
            Buy on WhatsApp
          </Button>
        </a>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2 rounded-lg bg-sage-green/10 px-3 py-2.5">
          <Truck className="h-4 w-4 text-sage-green shrink-0" />
          <span className="text-xs font-medium text-charcoal">All Pakistan Delivery</span>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-muted-gold/10 px-3 py-2.5">
          <Shield className="h-4 w-4 text-muted-gold shrink-0" />
          <span className="text-xs font-medium text-charcoal">
            {product.warranty || 'Warranty Available'}
          </span>
        </div>
      </div>

      <Separator />

      {/* Specifications */}
      {Object.keys(specs).length > 0 && (
        <div>
          <h3 className="font-semibold text-charcoal mb-3">Specifications</h3>
          <div className="rounded-lg border border-border overflow-hidden">
            {Object.entries(specs).map(([key, value], idx) => (
              <div
                key={key}
                className={`flex items-center justify-between px-4 py-2.5 text-sm ${
                  idx % 2 === 0 ? 'bg-muted/50' : 'bg-card'
                }`}
              >
                <span className="text-muted-foreground font-medium">{key}</span>
                <span className="text-charcoal text-right">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Warranty */}
      {product.warrantyPeriod && (
        <div className="rounded-lg border border-sage-green/20 bg-sage-green/5 px-4 py-3">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-sage-green" />
            <span className="text-sm font-medium text-charcoal">
              Warranty: {product.warrantyPeriod}
            </span>
          </div>
        </div>
      )}

      {/* Full Description */}
      {product.description && (
        <div>
          <h3 className="font-semibold text-charcoal mb-2">Description</h3>
          <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
            {product.description}
          </div>
        </div>
      )}
    </div>
  )
}
