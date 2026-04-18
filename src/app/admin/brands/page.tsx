"use client";

import { useState, useEffect } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface Brand {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  description: string | null;
  isActive: boolean;
  _count?: { products: number };
}

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", slug: "", description: "", isActive: true });

  useEffect(() => { fetchBrands(); }, []);

  const fetchBrands = async () => {
    try {
      const res = await fetch("/api/brands");
      const data = await res.json();
      setBrands(Array.isArray(data) ? data : []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const resetForm = () => {
    setForm({ name: "", slug: "", description: "", isActive: true });
    setEditing(null);
  };

  const handleEdit = (brand: Brand) => {
    setForm({ name: brand.name, slug: brand.slug, description: brand.description || "", isActive: brand.isActive });
    setEditing(brand.id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editing ? `/api/brands/${editing}` : "/api/brands";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          slug: form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
        }),
      });
      if (res.ok) { resetForm(); fetchBrands(); }
      else { const data = await res.json(); alert("Error: " + data.error); }
    } catch { alert("Failed to save brand"); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this brand? Products with this brand will lose their brand reference.")) return;
    try {
      await fetch(`/api/brands/${id}`, { method: "DELETE" });
      fetchBrands();
    } catch { alert("Failed to delete"); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl font-bold text-charcoal">Brands</h1>
          <p className="text-sm text-muted-foreground mt-1">{brands.length} brands</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border-0 shadow-[0_2px_8px_rgba(26,26,46,0.06)]">
          <CardHeader>
            <CardTitle className="text-lg">{editing ? "Edit Brand" : "Add Brand"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Name *</Label>
                <Input
                  required
                  value={form.name}
                  onChange={(e) => setForm({
                    ...form,
                    name: e.target.value,
                    slug: form.slug || e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
                  })}
                  className="mt-1.5"
                  placeholder="e.g., Samsung"
                />
              </div>
              <div>
                <Label>Slug</Label>
                <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="mt-1.5" />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="mt-1.5" rows={3} />
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={form.isActive} onCheckedChange={(v) => setForm({ ...form, isActive: v })} />
                <Label>Active</Label>
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="bg-terracotta hover:bg-terracotta-hover text-white rounded-xl flex-1">
                  {editing ? "Update" : "Create"}
                </Button>
                {editing && (
                  <Button type="button" variant="outline" onClick={resetForm} className="rounded-xl">Cancel</Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          <Card className="border-0 shadow-[0_2px_8px_rgba(26,26,46,0.06)]">
            <CardContent className="p-0">
              {loading ? (
                <div className="p-8 text-center text-muted-foreground">Loading...</div>
              ) : brands.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">No brands yet. Add your first brand above.</div>
              ) : (
                <div className="divide-y divide-soft-clay/20">
                  {brands.map((brand) => (
                    <div key={brand.id} className="flex items-center justify-between p-4 hover:bg-ivory-cream/50 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-charcoal">{brand.name}</span>
                          <Badge variant="outline" className="text-xs text-muted-foreground">{brand.slug}</Badge>
                          {!brand.isActive && <Badge variant="secondary" className="text-xs">Inactive</Badge>}
                        </div>
                        {brand.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{brand.description}</p>}
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(brand)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-error-red" onClick={() => handleDelete(brand.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
