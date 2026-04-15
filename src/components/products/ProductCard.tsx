'use client'

import Image from 'next/image'
import Link from 'next/link'
import { MessageCircle, Star, ShoppingCart } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatPKR, getDiscountPercentage, parseJSON, buildWhatsAppURL } from '@/lib/utils'

interface ProductCardProps {
  product: {
    id: string
    name: string
    slug: string
    price: number
    compareAtPrice: number | null
    images: string
    shortDescription: string | null
    isInStock: boolean
    avgRating: number
    reviewCount: number
    totalStock: number
    category?: { name: string; slug: string }
    brand?: { name: string } | null
    productTags?: { tag: { name: string; slug: string } }[]
  }
}

export default function ProductCard({ product }: ProductCardProps) {
  const images = parseJSON<string[]>(product.images, [])
  const mainImage = images[0] || 'https://picsum.photos/seed/default/400/400'
  const discount = product.compareAtPrice
    ? getDiscountPercentage(product.price, product.compareAtPrice)
    : 0
  const whatsappURL = buildWhatsAppURL(
    product.name,
    formatPKR(product.price),
    typeof window !== 'undefined' ? window.location.origin + '/product/' + product.slug : ''
  )

  return (
    <Card className="product-card group overflow-hidden border-border bg-card h-full flex flex-col">
      <Link href={`/product/${product.slug}`} className="block relative overflow-hidden aspect-square bg-muted">
        <Image
          src={mainImage}
          alt={product.name}
          fill
          className="object-cover img-zoom"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {discount > 0 && (
            <Badge className="bg-error-red text-white text-xs font-semibold">
              -{discount}%
            </Badge>
          )}
          {!product.isInStock && (
            <Badge variant="secondary" className="text-xs">
              Out of Stock
            </Badge>
          )}
          {product.totalStock > 0 && product.totalStock <= 5 && product.isInStock && (
            <Badge className="bg-muted-gold text-charcoal text-xs font-semibold">
              Only {product.totalStock} left
            </Badge>
          )}
        </div>
        {product.productTags && product.productTags.length > 0 && (
          <div className="absolute top-2 right-2 flex flex-col gap-1">
            {product.productTags.slice(0, 2).map((pt) => (
              <Badge key={pt.tag.slug} variant="outline" className="bg-card/90 text-xs backdrop-blur-sm">
                {pt.tag.name}
              </Badge>
            ))}
          </div>
        )}
      </Link>

      <CardContent className="p-4 flex flex-col flex-1">
        {/* Category & Brand */}
        <div className="flex items-center gap-2 mb-1.5">
          {product.category && (
            <span className="text-xs text-muted-foreground">{product.category.name}</span>
          )}
          {product.brand && (
            <>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs font-medium text-terracotta">{product.brand.name}</span>
            </>
          )}
        </div>

        {/* Name */}
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-semibold text-sm text-charcoal line-clamp-2 hover:text-terracotta transition-colors mb-2">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        {product.avgRating > 0 && (
          <div className="flex items-center gap-1 mb-2">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-3 w-3 ${star <= Math.round(product.avgRating) ? 'fill-muted-gold text-muted-gold' : 'text-muted-foreground/30'}`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
          </div>
        )}

        {/* Price */}
        <div className="mt-auto">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-lg font-bold text-charcoal font-mono">
              {formatPKR(product.price)}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-sm text-muted-foreground line-through font-mono">
                {formatPKR(product.compareAtPrice)}
              </span>
            )}
          </div>

          {/* WhatsApp CTA */}
          <a href={whatsappURL} target="_blank" rel="noopener noreferrer" className="block">
            <Button className="w-full bg-[#25D366] hover:bg-[#20BD5A] text-white gap-2 h-9">
              <MessageCircle className="h-4 w-4" />
              Buy on WhatsApp
            </Button>
          </a>
        </div>
      </CardContent>
    </Card>
  )
}
