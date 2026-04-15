"use client";

import Link from "next/link";
import { LayoutDashboard, Package, FolderTree, Tags, Building2, Home } from "lucide-react";

const sidebarLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/brands", label: "Brands", icon: Building2 },
  { href: "/admin/tags", label: "Tags", icon: Tags },
  { href: "/", label: "View Store", icon: Home },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-ivory-cream">
      {/* Sidebar */}
      <aside className="w-60 bg-charcoal text-white flex-shrink-0 hidden md:flex flex-col">
        <div className="p-5 border-b border-gray-700">
          <Link href="/admin" className="font-serif text-xl font-bold text-warm-sand">DaniyalTech</Link>
          <p className="text-xs text-gray-400 mt-0.5">Admin Panel</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {sidebarLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-white border-b border-soft-clay/30 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="md:hidden font-serif text-lg font-bold text-charcoal">DaniyalTech Admin</Link>
            <span className="hidden md:inline text-sm text-muted-foreground">Welcome to Admin Panel</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/" className="text-sm text-terracotta hover:text-terracotta-hover font-medium">
              View Store →
            </Link>
          </div>
        </header>

        {/* Mobile Nav */}
        <div className="md:hidden bg-white border-b border-soft-clay/30 px-4 py-2 flex gap-1 overflow-x-auto">
          {sidebarLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-deep-slate hover:bg-terracotta/5 hover:text-terracotta whitespace-nowrap"
            >
              <link.icon className="h-3.5 w-3.5" />
              {link.label}
            </Link>
          ))}
        </div>

        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
