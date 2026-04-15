import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductInfo } from "@/components/product/ProductInfo";
import { ProductGrid } from "@/components/product/ProductGrid";
import { parseJSON } from "@/lib/utils";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const product = await db.product.findUnique({
    where: { slug },
    include: { category: true, brand: true, tags: { include: { tag: true } } },
  });

  if (!product || product.status !== "PUBLISHED") notFound();

  const images = parseJSON<{ url: string; alt: string }[]>(product.images, []);

  // Get related products (same category, different product)
  const relatedProducts = await db.product.findMany({
    where: {
      status: "PUBLISHED",
      categoryId: product.categoryId,
      id: { not: product.id },
    },
    include: { category: true, brand: true, tags: { include: { tag: true } } },
    take: 4,
    orderBy: { createdAt: "desc" },
  });

  const formattedRelated = relatedProducts.map((p) => ({
    ...p,
    tags: p.tags.map((pt) => pt.tag),
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-terracotta">Home</Link>
        <span className="mx-2">/</span>
        <Link href={`/category/${product.category?.slug}`} className="hover:text-terracotta">{product.category?.name}</Link>
        <span className="mx-2">/</span>
        <span className="text-charcoal font-medium">{product.name}</span>
      </nav>

      {/* Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <ProductGallery images={images} productName={product.name} />
        <ProductInfo product={product} />
      </div>

      {/* Related Products */}
      {formattedRelated.length > 0 && (
        <div className="mt-16">
          <h2 className="font-serif text-2xl font-bold text-charcoal mb-6">You May Also Like</h2>
          <ProductGrid products={formattedRelated} />
        </div>
      )}
    </div>
  );
}
