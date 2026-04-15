import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MessageCircle, Sparkles, Zap, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/components/product/ProductGrid";
import { TrustBadges } from "@/components/trust/TrustBadges";
import { db } from "@/lib/db";

async function getFeaturedProducts() {
  const products = await db.product.findMany({
    where: { status: "PUBLISHED", isFeatured: true },
    include: { category: true, brand: true, tags: { include: { tag: true } } },
    take: 8,
    orderBy: { createdAt: "desc" },
  });
  return products.map((p) => ({ ...p, tags: p.tags.map((pt) => pt.tag) }));
}

async function getCategories() {
  return db.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: { where: { status: "PUBLISHED" } } } } },
  });
}

export default async function HomePage() {
  const [featuredProducts, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
  ]);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-charcoal via-charcoal/95 to-deep-slate">
        <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/techhero/1920/800')] bg-cover bg-center opacity-15" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-terracotta/10 border border-terracotta/20 rounded-full px-4 py-1.5 mb-6">
              <Sparkles className="h-4 w-4 text-terracotta" />
              <span className="text-sm text-terracotta-light font-medium">New Arrivals Just Dropped</span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-warm-sand leading-tight">
              Premium Electronics, Delivered Across Pakistan
            </h1>
            <p className="mt-4 text-lg text-gray-300 leading-relaxed max-w-xl">
              Shop the latest smartphones, AirPods, chargers and accessories. Cash on Delivery available on all orders with brand warranty.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/category/mobile-phones">
                <Button className="bg-terracotta hover:bg-terracotta-hover text-white font-semibold rounded-xl h-12 px-8 shadow-[0_2px_4px_rgba(193,105,79,0.25)] hover:shadow-[0_4px_8px_rgba(193,105,79,0.3)] transition-all">
                  Shop Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <a href="https://wa.me/923001234567?text=Hi! I want to inquire about your products." target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="border-sage-green/50 text-sage-green hover:bg-sage-green/10 hover:border-sage-green rounded-xl h-12 px-8">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Chat on WhatsApp
                </Button>
              </a>
            </div>
            <div className="mt-8 flex items-center gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-1.5">
                <Shield className="h-4 w-4 text-sage-green" />
                <span>Brand Warranty</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="h-4 w-4 text-muted-gold" />
                <span>Cash on Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <TrustBadges />
      </section>

      {/* Categories Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal">Shop by Category</h2>
            <p className="text-muted-foreground mt-1">Find exactly what you need</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="group relative overflow-hidden rounded-xl bg-white shadow-[0_2px_8px_rgba(26,26,46,0.06)] hover:shadow-[0_4px_16px_rgba(26,26,46,0.10)] transition-all duration-300 hover:-translate-y-0.5"
            >
              <div className="aspect-[4/3] relative">
                <Image
                  src={category.image || "https://picsum.photos/seed/cat-default/400/300"}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="font-semibold text-white text-sm sm:text-base">{category.name}</h3>
                <p className="text-xs text-gray-300 mt-0.5">{category._count.products} products</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-ivory-cream py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal">Featured Products</h2>
              <p className="text-muted-foreground mt-1">Hand-picked best deals for you</p>
            </div>
            <Link href="/category/mobile-phones">
              <Button variant="ghost" className="text-terracotta hover:text-terracotta-hover hover:bg-terracotta/5">
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
          {featuredProducts.length > 0 ? (
            <ProductGrid products={featuredProducts} />
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg mb-4">No products yet. Seed the database first!</p>
              <a href="/api/seed">
                <Button className="bg-terracotta hover:bg-terracotta-hover text-white rounded-xl">
                  Seed Database
                </Button>
              </a>
            </div>
          )}
        </div>
      </section>

      {/* WhatsApp CTA Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-sage-green/10 via-ivory-cream to-soft-clay/20 p-8 sm:p-12">
          <div className="max-w-xl">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal">
              Questions? Chat with us on WhatsApp
            </h2>
            <p className="mt-3 text-deep-slate leading-relaxed">
              Our team is available on WhatsApp to help you choose the right product, answer your questions, and process your order. Fast and easy!
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <a href="https://wa.me/923001234567?text=Hi! I want to inquire about your products." target="_blank" rel="noopener noreferrer">
                <Button className="bg-sage-green hover:bg-sage-green/90 text-white font-semibold rounded-xl h-12 px-8">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Chat on WhatsApp
                </Button>
              </a>
              <Link href="/contact">
                <Button variant="outline" className="border-terracotta text-terracotta hover:bg-terracotta hover:text-white rounded-xl h-12 px-8">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
