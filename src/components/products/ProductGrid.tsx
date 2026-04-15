import ProductCard from './ProductCard'

interface ProductGridProps {
  products: Array<{
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
  }>
  emptyMessage?: string
}

export default function ProductGrid({ products, emptyMessage = 'No products found' }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="text-6xl mb-4">📦</div>
        <h3 className="text-lg font-semibold text-charcoal mb-2">{emptyMessage}</h3>
        <p className="text-sm text-muted-foreground">Check back soon for new arrivals!</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
