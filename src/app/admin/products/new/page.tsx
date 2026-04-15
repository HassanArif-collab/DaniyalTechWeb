"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

interface Category { id: string; name: string }
interface Brand { id: string; name: string }
interface Tag { id: string; name: string }

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [saving, setSaving] = useState(false);
  const [specPairs, setSpecPairs] = useState<{ key: string; value: string }[]>([{ key: "", value: "" }]);
  const [imageUrls, setImageUrls] = useState<string[]>([""]);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    shortDescription: "",
    description: "",
    categoryId: "",
    brandId: "",
    price: "",
    compareAtPrice: "",
    totalStock: "0",
    warranty: "",
    warrantyPeriod: "",
    status: "DRAFT",
    isFeatured: false,
    seoTitle: "",
    seoDescription: "",
    tagIds: [] as string[],
  });

  useEffect(() => {
    Promise.all([
      fetch("/api/categories").then((r) => r.json()),
      fetch("/api/brands").then((r) => r.json()),
      fetch("/api/tags").then((r) => r.json()),
    ]).then(([cats, brs, tgs]) => {
      setCategories(Array.isArray(cats) ? cats : []);
      setBrands(Array.isArray(brs) ? brs : []);
      setTags(Array.isArray(tgs) ? tgs : []);
    });
  }, []);

  const handleNameChange = (name: string) => {
    setForm({
      ...form,
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const specs: Record<string, string> = {};
      specPairs.forEach((pair) => {
        if (pair.key && pair.value) specs[pair.key] = pair.value;
      });

      const images = imageUrls.filter((url) => url.trim()).map((url) => ({ url: url.trim(), alt: form.name }));

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: parseInt(form.price) || 0,
          compareAtPrice: form.compareAtPrice ? parseInt(form.compareAtPrice) : null,
          totalStock: parseInt(form.totalStock) || 0,
          brandId: form.brandId || null,
          specifications: specs,
          images,
          tagIds: form.tagIds,
        }),
      });

      if (res.ok) {
        router.push("/admin/products");
      } else {
        const data = await res.json();
        alert("Error: " + data.error);
      }
    } catch (err) {
      alert("Failed to create product");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/products">
          <Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button>
        </Link>
        <div>
          <h1 className="font-serif text-2xl font-bold text-charcoal">New Product</h1>
          <p className="text-sm text-muted-foreground">Add a new product to your store</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
        <Card className="border-0 shadow-[0_2px_8px_rgba(26,26,46,0.06)]">
          <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Product Name *</Label>
                <Input required value={form.name} onChange={(e) => handleNameChange(e.target.value)} placeholder="e.g., Samsung Galaxy S24 Ultra" className="mt-1.5" />
              </div>
              <div>
                <Label>Slug</Label>
                <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="auto-generated" className="mt-1.5" />
              </div>
            </div>
            <div>
              <Label>Short Description</Label>
              <Textarea value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} placeholder="Brief product summary (max 300 chars)" maxLength={300} className="mt-1.5" rows={2} />
            </div>
            <div>
              <Label>Full Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Detailed product description" className="mt-1.5" rows={4} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-[0_2px_8px_rgba(26,26,46,0.06)]">
          <CardHeader><CardTitle>Category & Brand</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Category *</Label>
                <Select value={form.categoryId} onValueChange={(v) => setForm({ ...form, categoryId: v })}>
                  <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (<SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Brand</Label>
                <Select value={form.brandId} onValueChange={(v) => setForm({ ...form, brandId: v })}>
                  <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select brand" /></SelectTrigger>
                  <SelectContent>
                    {brands.map((brand) => (<SelectItem key={brand.id} value={brand.id}>{brand.name}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2 mt-1.5">
                {tags.map((tag) => (
                  <label key={tag.id} className="flex items-center gap-1.5 text-sm cursor-pointer bg-ivory-cream px-3 py-1.5 rounded-md">
                    <input
                      type="checkbox"
                      className="rounded border-soft-clay text-terracotta focus:ring-terracotta"
                      checked={form.tagIds.includes(tag.id)}
                      onChange={(e) => {
                        setForm({
                          ...form,
                          tagIds: e.target.checked ? [...form.tagIds, tag.id] : form.tagIds.filter((t) => t !== tag.id),
                        });
                      }}
                    />
                    {tag.name}
                  </label>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-[0_2px_8px_rgba(26,26,46,0.06)]">
          <CardHeader><CardTitle>Pricing & Stock</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label>Price (PKR) *</Label>
                <Input required type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="39999" className="mt-1.5" />
              </div>
              <div>
                <Label>Compare-at Price (PKR)</Label>
                <Input type="number" value={form.compareAtPrice} onChange={(e) => setForm({ ...form, compareAtPrice: e.target.value })} placeholder="44999" className="mt-1.5" />
              </div>
              <div>
                <Label>Stock Quantity</Label>
                <Input type="number" value={form.totalStock} onChange={(e) => setForm({ ...form, totalStock: e.target.value })} placeholder="10" className="mt-1.5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-[0_2px_8px_rgba(26,26,46,0.06)]">
          <CardHeader><CardTitle>Specifications</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {specPairs.map((pair, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <Input placeholder="Key (e.g., RAM)" value={pair.key} onChange={(e) => {
                  const newPairs = [...specPairs];
                  newPairs[idx] = { ...newPairs[idx], key: e.target.value };
                  setSpecPairs(newPairs);
                }} />
                <Input placeholder="Value (e.g., 8GB)" value={pair.value} onChange={(e) => {
                  const newPairs = [...specPairs];
                  newPairs[idx] = { ...newPairs[idx], value: e.target.value };
                  setSpecPairs(newPairs);
                }} />
                <Button type="button" variant="ghost" size="icon" onClick={() => setSpecPairs(specPairs.filter((_, i) => i !== idx))} disabled={specPairs.length === 1}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => setSpecPairs([...specPairs, { key: "", value: "" }])} className="mt-2">
              <Plus className="h-4 w-4 mr-1" /> Add Specification
            </Button>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-[0_2px_8px_rgba(26,26,46,0.06)]">
          <CardHeader><CardTitle>Images</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {imageUrls.map((url, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <Input placeholder="Image URL (e.g., https://picsum.photos/seed/myproduct/800/800)" value={url} onChange={(e) => {
                  const newUrls = [...imageUrls];
                  newUrls[idx] = e.target.value;
                  setImageUrls(newUrls);
                }} />
                <Button type="button" variant="ghost" size="icon" onClick={() => setImageUrls(imageUrls.filter((_, i) => i !== idx))} disabled={imageUrls.length === 1}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => setImageUrls([...imageUrls, ""])} className="mt-2">
              <Plus className="h-4 w-4 mr-1" /> Add Image
            </Button>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-[0_2px_8px_rgba(26,26,46,0.06)]">
          <CardHeader><CardTitle>Warranty & Status</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Warranty Type</Label>
                <Select value={form.warranty} onValueChange={(v) => setForm({ ...form, warranty: v })}>
                  <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select warranty" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="brand">Brand Warranty</SelectItem>
                    <SelectItem value="shop">Shop Warranty</SelectItem>
                    <SelectItem value="none">No Warranty</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Warranty Period</Label>
                <Select value={form.warrantyPeriod} onValueChange={(v) => setForm({ ...form, warrantyPeriod: v })}>
                  <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select period" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3 Months">3 Months</SelectItem>
                    <SelectItem value="6 Months">6 Months</SelectItem>
                    <SelectItem value="12 Months">12 Months</SelectItem>
                    <SelectItem value="24 Months">24 Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={form.isFeatured} onCheckedChange={(v) => setForm({ ...form, isFeatured: v })} />
              <Label>Featured Product (shows on homepage)</Label>
            </div>
            <div>
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="PUBLISHED">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button type="submit" disabled={saving} className="bg-terracotta hover:bg-terracotta-hover text-white rounded-xl">
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Saving..." : "Create Product"}
          </Button>
          <Link href="/admin/products">
            <Button type="button" variant="outline" className="rounded-xl">Cancel</Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
