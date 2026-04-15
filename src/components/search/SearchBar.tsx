"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  onClose?: () => void;
}

export function SearchBar({ onClose }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      onClose?.();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search products... (e.g., Samsung Galaxy, AirPods)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 h-11 bg-white border-soft-clay/40 focus:border-terracotta focus:ring-terracotta/20 rounded-xl"
          autoFocus
        />
      </div>
      <button type="button" onClick={onClose} className="p-2 text-muted-foreground hover:text-charcoal">
        <X className="h-5 w-5" />
      </button>
    </form>
  );
}
