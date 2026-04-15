"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Menu, X, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { SearchBar } from "@/components/search/SearchBar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navLinks = [
  { href: "/category/mobile-phones", label: "Mobile Phones" },
  { href: "/category/audio", label: "Audio" },
  { href: "/category/chargers-power", label: "Chargers & Power" },
  { href: "/category/accessories", label: "Accessories" },
  { href: "/category/wearable-tech", label: "Wearable Tech" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-soft-clay/30"
          : "bg-warm-sand border-b border-transparent"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="font-serif text-2xl font-bold text-charcoal tracking-tight">
            DaniyalTech
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-deep-slate hover:text-terracotta transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="text-deep-slate hover:text-terracotta"
            >
              <Search className="h-5 w-5" />
            </Button>
            <a
              href={`https://wa.me/923001234567?text=${encodeURIComponent("Hi! I want to inquire about your products.")}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="ghost" size="icon" className="text-sage-green hover:text-sage-green">
                <MessageCircle className="h-5 w-5" />
              </Button>
            </a>
            <Link href="/admin">
              <Button variant="outline" size="sm" className="border-terracotta text-terracotta hover:bg-terracotta hover:text-white">
                Admin
              </Button>
            </Link>
          </div>

          {/* Mobile Actions */}
          <div className="flex lg:hidden items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="text-deep-slate"
            >
              <Search className="h-5 w-5" />
            </Button>
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-deep-slate">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 bg-warm-sand">
                <div className="flex flex-col gap-6 mt-8">
                  <Link href="/" className="font-serif text-xl font-bold text-charcoal" onClick={() => setIsMobileMenuOpen(false)}>
                    DaniyalTech
                  </Link>
                  <div className="flex flex-col gap-3">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="text-base font-medium text-deep-slate hover:text-terracotta transition-colors py-2 border-b border-soft-clay/30"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                  <div className="flex flex-col gap-3 mt-4">
                    <a
                      href={`https://wa.me/923001234567?text=${encodeURIComponent("Hi! I want to inquire about your products.")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button className="w-full bg-sage-green hover:bg-sage-green/90 text-white">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Chat on WhatsApp
                      </Button>
                    </a>
                    <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full border-terracotta text-terracotta hover:bg-terracotta hover:text-white">
                        Admin Panel
                      </Button>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Search Bar Dropdown */}
      {isSearchOpen && (
        <div className="border-t border-soft-clay/30 bg-white/95 backdrop-blur-md px-4 py-3">
          <div className="mx-auto max-w-2xl">
            <SearchBar onClose={() => setIsSearchOpen(false)} />
          </div>
        </div>
      )}
    </nav>
  );
}
