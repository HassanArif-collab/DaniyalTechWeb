"use client";

import { MessageCircle } from "lucide-react";

export function FloatingWhatsApp() {
  const whatsappURL = `https://wa.me/923001234567?text=${encodeURIComponent("Hi! I want to inquire about your products.")}`;

  return (
    <a
      href={whatsappURL}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-sage-green hover:bg-sage-green/90 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 group"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="h-6 w-6" />
      <span className="absolute -top-1 -right-1 flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sage-green opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-sage-green"></span>
      </span>
    </a>
  );
}
