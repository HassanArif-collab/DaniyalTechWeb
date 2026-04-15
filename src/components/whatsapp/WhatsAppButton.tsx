"use client";

import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function WhatsAppButton({
  productName,
  productPrice,
  productSlug,
}: {
  productName: string;
  productPrice: string;
  productSlug: string;
}) {
  const whatsappURL = typeof window !== "undefined"
    ? `https://wa.me/923001234567?text=${encodeURIComponent(
        `Hi! I'm interested in ${productName} (${productPrice}). Is it available? ${window.location.origin}/product/${productSlug}`
      )}`
    : "#";

  return (
    <a href={whatsappURL} target="_blank" rel="noopener noreferrer">
      <Button className="bg-terracotta hover:bg-terracotta-hover text-white font-semibold rounded-xl shadow-[0_2px_4px_rgba(193,105,79,0.25)] hover:shadow-[0_4px_8px_rgba(193,105,79,0.3)] transition-all hover:-translate-y-px active:translate-y-0">
        <MessageCircle className="h-4 w-4 mr-2" />
        Buy on WhatsApp
      </Button>
    </a>
  );
}
