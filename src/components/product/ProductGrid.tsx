"use client";

import { ProductCard } from "@/components/product/ProductCard";

interface ProductGridProps {
  products: Array<{
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
  }>;
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground text-lg">No products found</p>
        <p className="text-sm text-muted-foreground mt-2">Try adjusting your filters or search terms</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
