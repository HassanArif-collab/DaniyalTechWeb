"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Package, FolderTree, Building2, Tags, Database, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Stats {
  products: number;
  categories: number;
  brands: number;
  tags: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [productsRes, categoriesRes, brandsRes, tagsRes] = await Promise.all([
        fetch("/api/products?limit=1"),
        fetch("/api/categories"),
        fetch("/api/brands"),
        fetch("/api/tags"),
      ]);
      const [products, categories, brands, tags] = await Promise.all([
        productsRes.json(),
        categoriesRes.json(),
        categoriesRes.json(),
        tagsRes.json(),
      ]);
      setStats({
        products: products.total || 0,
        categories: Array.isArray(categories) ? categories.length : 0,
        brands: Array.isArray(brands) ? brands.length : 0,
        tags: Array.isArray(tags) ? tags.length : 0,
      });
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  };

  const handleSeed = async () => {
    setSeeding(true);
    try {
      const res = await fetch("/api/seed");
      const data = await res.json();
      if (data.success) {
        alert("Database seeded successfully! Refreshing...");
        fetchStats();
      } else {
        alert("Error seeding database: " + data.error);
      }
    } catch (err) {
      alert("Failed to seed database");
    } finally {
      setSeeding(false);
    }
  };

  const statCards = [
    { title: "Products", count: stats?.products || 0, icon: Package, href: "/admin/products", color: "text-terracotta" },
    { title: "Categories", count: stats?.categories || 0, icon: FolderTree, href: "/admin/categories", color: "text-sage-green" },
    { title: "Brands", count: stats?.brands || 0, icon: Building2, href: "/admin/brands", color: "text-muted-gold" },
    { title: "Tags", count: stats?.tags || 0, icon: Tags, href: "/admin/tags", color: "text-deep-slate" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-2xl font-bold text-charcoal">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your store products and settings</p>
        </div>
        <Button
          onClick={handleSeed}
          disabled={seeding}
          className="bg-sage-green hover:bg-sage-green/90 text-white rounded-xl"
        >
          <Database className="mr-2 h-4 w-4" />
          {seeding ? "Seeding..." : "Seed Database"}
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => (
          <Link key={card.title} href={card.href}>
            <Card className="hover:shadow-[0_4px_16px_rgba(26,26,46,0.10)] transition-shadow border-0 shadow-[0_2px_8px_rgba(26,26,46,0.06)] cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
                <card.icon className={`h-5 w-5 ${card.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-charcoal">{card.count}</div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  Manage {card.title.toLowerCase()} <ArrowRight className="h-3 w-3" />
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="border-0 shadow-[0_2px_8px_rgba(26,26,46,0.06)]">
        <CardHeader>
          <CardTitle className="text-lg">Quick Start</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            If this is your first time, click <strong>&quot;Seed Database&quot;</strong> to populate the store with sample products. Then you can manage everything from the sidebar.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/admin/products/new">
              <Button className="bg-terracotta hover:bg-terracotta-hover text-white rounded-xl">Add New Product</Button>
            </Link>
            <Link href="/admin/categories">
              <Button variant="outline" className="border-soft-clay text-deep-slate rounded-xl">Manage Categories</Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="border-terracotta text-terracotta hover:bg-terracotta hover:text-white rounded-xl">View Store</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
