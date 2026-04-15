import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { ProductGrid } from "@/components/product/ProductGrid";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const sp = await searchParams;

  const category = await db.category.findFirst({ where: { slug } });
  if (!category) notFound();

  // Build where clause
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
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-muted-foreground">
        <a href="/" className="hover:text-terracotta">Home</a>
        <span className="mx-2">/</span>
        <span className="text-charcoal font-medium">{category.name}</span>
      </nav>

      {/* Category Header */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-charcoal">{category.name}</h1>
        {category.description && (
          <p className="text-muted-foreground mt-2 max-w-2xl">{category.description}</p>
        )}
        <p className="text-sm text-muted-foreground mt-1">{products.length} products found</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filter Sidebar - Desktop */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <FilterSidebarWrapper
            brands={brands}
            maxPrice={maxProductPrice}
            slug={slug}
            currentBrands={brandIds}
            currentMinPrice={minPrice || 0}
            currentMaxPrice={maxPrice || maxProductPrice}
            currentInStock={inStock}
          />
        </div>

        {/* Products */}
        <div className="flex-1">
          {/* Sort Bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex lg:hidden">
              <MobileFilterButton slug={slug} />
            </div>
            <SortSelect currentSort={sort} slug={slug} />
          </div>
          <ProductGrid products={formattedProducts} />
        </div>
      </div>
    </div>
  );
}

function FilterSidebarWrapper({ brands, maxPrice, slug, currentBrands, currentMinPrice, currentMaxPrice, currentInStock }: {
  brands: any[]; maxPrice: number; slug: string;
  currentBrands: string[]; currentMinPrice: number; currentMaxPrice: number; currentInStock: boolean;
}) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-[0_2px_8px_rgba(26,26,46,0.06)]">
      <h3 className="font-semibold text-charcoal mb-4">Filters</h3>

      {/* Brand Filter */}
      {brands.length > 0 && (
        <div className="mb-5">
          <h4 className="text-sm font-semibold text-deep-slate mb-3">Brands</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {brands.map((brand) => (
              <label key={brand.id} className="flex items-center gap-2 cursor-pointer text-sm">
                <input
                  type="checkbox"
                  className="rounded border-soft-clay text-terracotta focus:ring-terracotta"
                  defaultChecked={currentBrands.includes(brand.id)}
                  onChange={() => {
                    const url = new URL(window.location.href);
                    const current = url.searchParams.get("brands")?.split(",").filter(Boolean) || [];
                    const newBrands = current.includes(brand.id)
                      ? current.filter((b) => b !== brand.id)
                      : [...current, brand.id];
                    if (newBrands.length > 0) {
                      url.searchParams.set("brands", newBrands.join(","));
                    } else {
                      url.searchParams.delete("brands");
                    }
                    window.location.href = url.toString();
                  }}
                />
                {brand.name}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Price Range */}
      <div className="mb-5">
        <h4 className="text-sm font-semibold text-deep-slate mb-2">Price Range</h4>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Rs. {currentMinPrice.toLocaleString()}</span>
          <span>-</span>
          <span>Rs. {currentMaxPrice.toLocaleString()}</span>
        </div>
      </div>

      {/* In Stock */}
      <div className="mb-5">
        <label className="flex items-center gap-2 cursor-pointer text-sm">
          <input
            type="checkbox"
            className="rounded border-soft-clay text-terracotta focus:ring-terracotta"
            defaultChecked={currentInStock}
            onChange={() => {
              const url = new URL(window.location.href);
              if (currentInStock) {
                url.searchParams.delete("inStock");
              } else {
                url.searchParams.set("inStock", "true");
              }
              window.location.href = url.toString();
            }}
          />
          In Stock Only
        </label>
      </div>

      {/* Clear Filters */}
      <a href={`/category/${slug}`} className="text-sm text-terracotta hover:text-terracotta-hover font-medium">
        Clear All Filters
      </a>
    </div>
  );
}

function MobileFilterButton({ slug }: { slug: string }) {
  return (
    <a href={`/category/${slug}`} className="text-sm text-terracotta hover:text-terracotta-hover font-medium flex items-center gap-1">
      Clear Filters
    </a>
  );
}

function SortSelect({ currentSort, slug }: { currentSort: string; slug: string }) {
  const options = [
    { value: "newest", label: "Newest First" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
    { value: "rating", label: "Highest Rated" },
  ];

  return (
    <select
      className="text-sm border border-soft-clay/50 rounded-lg px-3 py-2 bg-white text-deep-slate focus:border-terracotta focus:ring-terracotta/20"
      defaultValue={currentSort}
      onChange={(e) => {
        const url = new URL(window.location.href);
        url.searchParams.set("sort", e.target.value);
        window.location.href = url.toString();
      }}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  );
}
