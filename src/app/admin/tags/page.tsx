"use client";

import { useState, useEffect } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface Tag {
  id: string;
  name: string;
  slug: string;
  _count?: { products: number };
}

export default function AdminTagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", slug: "" });

  useEffect(() => { fetchTags(); }, []);

  const fetchTags = async () => {
    try {
      const res = await fetch("/api/tags");
      const data = await res.json();
      setTags(Array.isArray(data) ? data : []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const resetForm = () => {
    setForm({ name: "", slug: "" });
    setEditing(null);
  };

  const handleEdit = (tag: Tag) => {
    setForm({ name: tag.name, slug: tag.slug });
    setEditing(tag.id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editing ? `/api/tags/${editing}` : "/api/tags";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          slug: form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
        }),
      });
      if (res.ok) { resetForm(); fetchTags(); }
      else { const data = await res.json(); alert("Error: " + data.error); }
    } catch { alert("Failed to save tag"); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this tag? It will be removed from all products.")) return;
    try {
      await fetch(`/api/tags/${id}`, { method: "DELETE" });
      fetchTags();
    } catch { alert("Failed to delete"); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl font-bold text-charcoal">Tags</h1>
          <p className="text-sm text-muted-foreground mt-1">{tags.length} tags</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border-0 shadow-[0_2px_8px_rgba(26,26,46,0.06)]">
          <CardHeader>
            <CardTitle className="text-lg">{editing ? "Edit Tag" : "Add Tag"}</CardTitle>
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
                  placeholder="e.g., PTA Approved"
                />
              </div>
              <div>
                <Label>Slug</Label>
                <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="mt-1.5" />
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
              ) : tags.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">No tags yet. Add your first tag above.</div>
              ) : (
                <div className="divide-y divide-soft-clay/20">
                  {tags.map((tag) => (
                    <div key={tag.id} className="flex items-center justify-between p-4 hover:bg-ivory-cream/50 transition-colors">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-charcoal">{tag.name}</span>
                        <Badge variant="outline" className="text-xs text-muted-foreground">{tag.slug}</Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(tag)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-error-red" onClick={() => handleDelete(tag.id)}>
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
