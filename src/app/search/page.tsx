import { db } from "@/lib/db";
import { ProductGrid } from "@/components/product/ProductGrid";
import Link from "next/link";

interface SearchPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : "";

  let products: any[] = [];
  if (q) {
    products = await db.product.findMany({
      where: {
        status: "PUBLISHED",
        OR: [
          { name: { contains: q } },
          { shortDescription: { contains: q } },
          { description: { contains: q } },
        ],
      },
      include: { category: true, brand: true, tags: { include: { tag: true } } },
      take: 50,
      orderBy: { createdAt: "desc" },
    });
    products = products.map((p) => ({ ...p, tags: p.tags.map((pt) => pt.tag) }));
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <nav className="mb-6 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-terracotta">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-charcoal font-medium">Search</span>
      </nav>

      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-charcoal">
          {q ? `Search results for "${q}"` : "Search Products"}
        </h1>
        {q && (
          <p className="text-muted-foreground mt-2">{products.length} product{products.length !== 1 ? "s" : ""} found</p>
        )}
      </div>

      {!q ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg">Enter a search term to find products</p>
        </div>
      ) : (
        <ProductGrid products={products} />
      )}
    </div>
  );
}
