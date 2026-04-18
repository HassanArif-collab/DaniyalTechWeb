import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { ProductGrid } from "@/components/product/ProductGrid";
import { CategoryFilterSidebar } from "./CategoryFilterSidebar";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const sp = await searchParams;

  const category = await db.category.findFirst({ where: { slug } });
  if (!category) notFound();

  const where: any = { status: "PUBLISHED", categoryId: category.id };

  const sort = typeof sp.sort === "string" ? sp.sort : "newest";
  const brandIds = typeof sp.brands === "string" ? sp.brands.split(",") : [];
  const minPrice = typeof sp.minPrice === "string" ? parseInt(sp.minPrice) : undefined;
  const maxPrice = typeof sp.maxPrice === "string" ? parseInt(sp.maxPrice) : undefined;
  const inStock = sp.inStock === "true";

  if (brandIds.length > 0) where.brandId = { in: brandIds };
  if (inStock) where.isInStock = true;
  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) where.price.gte = minPrice;
    if (maxPrice !== undefined) where.price.lte = maxPrice;
  }

  const orderBy: any = {};
  switch (sort) {
    case "price-asc": orderBy.price = "asc"; break;
    case "price-desc": orderBy.price = "desc"; break;
    case "rating": orderBy.avgRating = "desc"; break;
    default: orderBy.createdAt = "desc"; break;
  }

  const [products, brands] = await Promise.all([
    db.product.findMany({
      where,
      include: { category: true, brand: true, tags: { include: { tag: true } } },
      orderBy,
    }),
    db.brand.findMany({
      where: { products: { some: { categoryId: category.id, status: "PUBLISHED" } } },
      orderBy: { name: "asc" },
    }),
  ]);

  const formattedProducts = products.map((p) => ({
    ...p,
    tags: p.tags.map((pt) => pt.tag),
  }));

  const maxProductPrice = products.length > 0 ? Math.max(...products.map((p) => p.price)) : 500000;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <nav className="mb-6 text-sm text-muted-foreground">
        <a href="/" className="hover:text-terracotta">Home</a>
        <span className="mx-2">/</span>
        <span className="text-charcoal font-medium">{category.name}</span>
      </nav>

      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-charcoal">{category.name}</h1>
        {category.description && (
          <p className="text-muted-foreground mt-2 max-w-2xl">{category.description}</p>
        )}
        <p className="text-sm text-muted-foreground mt-1">{products.length} products found</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <CategoryFilterSidebar
          brands={brands}
          maxPrice={maxProductPrice}
          slug={slug}
          currentBrands={brandIds}
          currentMinPrice={minPrice || 0}
          currentMaxPrice={maxPrice || maxProductPrice}
          currentInStock={inStock}
          currentSort={sort}
        />
        <div className="flex-1">
          <ProductGrid products={formattedProducts} />
        </div>
      </div>
    </div>
  );
}
