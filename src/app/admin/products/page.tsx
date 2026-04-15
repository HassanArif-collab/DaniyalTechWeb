"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPKR, parseJSON } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  totalStock: number;
  status: string;
  isFeatured: boolean;
  images: string;
  category: { name: string } | null;
  brand: { name: string } | null;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products?limit=100");
      const data = await res.json();
      setProducts(data.products || []);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await fetch(`/api/products/${id}`, { method: "DELETE" });
      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      alert("Failed to delete product");
    }
  };

  const toggleStatus = async (product: Product) => {
    const newStatus = product.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    try {
      await fetch(`/api/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      setProducts(products.map((p) => p.id === product.id ? { ...p, status: newStatus } : p));
    } catch (err) {
      alert("Failed to update status");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl font-bold text-charcoal">Products</h1>
          <p className="text-sm text-muted-foreground mt-1">{products.length} products total</p>
        </div>
        <Link href="/admin/products/new">
          <Button className="bg-terracotta hover:bg-terracotta-hover text-white rounded-xl">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No products yet</p>
          <Link href="/admin/products/new">
            <Button className="bg-terracotta hover:bg-terracotta-hover text-white rounded-xl">Add Your First Product</Button>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(26,26,46,0.06)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-ivory-cream">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-deep-slate">Product</th>
                  <th className="text-left py-3 px-4 font-semibold text-deep-slate">Category</th>
                  <th className="text-left py-3 px-4 font-semibold text-deep-slate">Price</th>
                  <th className="text-left py-3 px-4 font-semibold text-deep-slate">Stock</th>
                  <th className="text-left py-3 px-4 font-semibold text-deep-slate">Status</th>
                  <th className="text-right py-3 px-4 font-semibold text-deep-slate">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-t border-soft-clay/20 hover:bg-ivory-cream/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-md bg-ivory-cream overflow-hidden flex-shrink-0">
                          {(() => {
                            const imgs = parseJSON<{ url: string }[]>(product.images, []);
                            return imgs[0] ? (
                              <img src={imgs[0].url} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">No img</div>
                            );
                          })()}
                        </div>
                        <div>
                          <p className="font-medium text-charcoal line-clamp-1">{product.name}</p>
                          {product.brand && <p className="text-xs text-muted-foreground">{product.brand.name}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{product.category?.name || "—"}</td>
                    <td className="py-3 px-4 font-mono font-medium">{formatPKR(product.price)}</td>
                    <td className="py-3 px-4">
                      <span className={product.totalStock <= 5 ? "text-error-red font-medium" : "text-deep-slate"}>
                        {product.totalStock}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={product.status === "PUBLISHED" ? "default" : "secondary"}
                        className={product.status === "PUBLISHED" ? "bg-sage-green/10 text-sage-green" : "bg-muted text-muted-foreground"}
                      >
                        {product.status}
                      </Badge>
                      {product.isFeatured && (
                        <Badge className="ml-1 bg-muted-gold/10 text-muted-gold">Featured</Badge>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => toggleStatus(product)}
                          title={product.status === "PUBLISHED" ? "Unpublish" : "Publish"}
                        >
                          {product.status === "PUBLISHED" ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Link href={`/admin/products/${product.id}/edit`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-error-red hover:text-error-red"
                          onClick={() => handleDelete(product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
