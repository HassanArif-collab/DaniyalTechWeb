"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [productId, setProductId] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "", slug: "", shortDescription: "", description: "",
    price: "", compareAtPrice: "", totalStock: "0",
    status: "DRAFT", isFeatured: false,
    warranty: "", warrantyPeriod: "",
  });
  const [specPairs, setSpecPairs] = useState<{ key: string; value: string }[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([""]);

  useEffect(() => {
    params.then(({ id }) => {
      setProductId(id);
      fetch(`/api/products/${id}`)
        .then((r) => r.json())
        .then((product) => {
          setForm({
            name: product.name || "",
            slug: product.slug || "",
            shortDescription: product.shortDescription || "",
            description: product.description || "",
            price: product.price?.toString() || "",
            compareAtPrice: product.compareAtPrice?.toString() || "",
            totalStock: product.totalStock?.toString() || "0",
            status: product.status || "DRAFT",
            isFeatured: product.isFeatured || false,
            warranty: product.warranty || "",
            warrantyPeriod: product.warrantyPeriod || "",
          });
          try {
            const specs = JSON.parse(product.specifications || "{}");
            setSpecPairs(Object.entries(specs).map(([key, value]) => ({ key, value: value as string })));
          } catch { setSpecPairs([]); }
          try {
            const imgs = JSON.parse(product.images || "[]");
            setImageUrls(imgs.map((i: any) => i.url || ""));
          } catch { setImageUrls([""]); }
        });
    });
  }, [params]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const specs: Record<string, string> = {};
      specPairs.forEach((p) => { if (p.key && p.value) specs[p.key] = p.value; });
      const images = imageUrls.filter((u) => u.trim()).map((url) => ({ url: url.trim(), alt: form.name }));

      await fetch(`/api/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: parseInt(form.price) || 0,
          compareAtPrice: form.compareAtPrice ? parseInt(form.compareAtPrice) : null,
          totalStock: parseInt(form.totalStock) || 0,
          specifications: specs,
          images,
        }),
      });
      router.push("/admin/products");
    } catch { alert("Failed to update product"); } finally { setSaving(false); }
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/products"><Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button></Link>
        <h1 className="font-serif text-2xl font-bold text-charcoal">Edit Product</h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
        <Card className="border-0 shadow-[0_2px_8px_rgba(26,26,46,0.06)]">
          <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className="text-sm font-medium">Name</label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1.5" /></div>
              <div><label className="text-sm font-medium">Slug</label><Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="mt-1.5" /></div>
            </div>
            <div><label className="text-sm font-medium">Short Description</label><Textarea value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} className="mt-1.5" rows={2} /></div>
            <div><label className="text-sm font-medium">Description</label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="mt-1.5" rows={4} /></div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-[0_2px_8px_rgba(26,26,46,0.06)]">
          <CardHeader><CardTitle>Pricing & Stock</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div><label className="text-sm font-medium">Price (PKR)</label><Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="mt-1.5" /></div>
              <div><label className="text-sm font-medium">Compare-at Price</label><Input type="number" value={form.compareAtPrice} onChange={(e) => setForm({ ...form, compareAtPrice: e.target.value })} className="mt-1.5" /></div>
              <div><label className="text-sm font-medium">Stock</label><Input type="number" value={form.totalStock} onChange={(e) => setForm({ ...form, totalStock: e.target.value })} className="mt-1.5" /></div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-[0_2px_8px_rgba(26,26,46,0.06)]">
          <CardHeader><CardTitle>Specifications</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {specPairs.map((pair, idx) => (
              <div key={idx} className="flex gap-2">
                <Input value={pair.key} onChange={(e) => { const n = [...specPairs]; n[idx] = { ...n[idx], key: e.target.value }; setSpecPairs(n); }} placeholder="Key" />
                <Input value={pair.value} onChange={(e) => { const n = [...specPairs]; n[idx] = { ...n[idx], value: e.target.value }; setSpecPairs(n); }} placeholder="Value" />
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => setSpecPairs([...specPairs, { key: "", value: "" }])}>+ Add Spec</Button>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-[0_2px_8px_rgba(26,26,46,0.06)]">
          <CardHeader><CardTitle>Images</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {imageUrls.map((url, idx) => (
              <Input key={idx} value={url} onChange={(e) => { const n = [...imageUrls]; n[idx] = e.target.value; setImageUrls(n); }} placeholder="Image URL" />
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => setImageUrls([...imageUrls, ""])}>+ Add Image</Button>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-[0_2px_8px_rgba(26,26,46,0.06)]">
          <CardHeader><CardTitle>Status</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} className="rounded" />
              <label className="text-sm">Featured Product</label>
            </div>
            <div>
              <label className="text-sm font-medium">Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="mt-1.5 block w-full rounded-md border border-soft-clay/50 px-3 py-2 text-sm">
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button type="submit" disabled={saving} className="bg-terracotta hover:bg-terracotta-hover text-white rounded-xl">
            <Save className="mr-2 h-4 w-4" />{saving ? "Saving..." : "Update Product"}
          </Button>
          <Link href="/admin/products"><Button type="button" variant="outline" className="rounded-xl">Cancel</Button></Link>
        </div>
      </form>
    </div>
  );
}
