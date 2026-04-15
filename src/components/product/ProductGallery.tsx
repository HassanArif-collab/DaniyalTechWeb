"use client";

import { useState } from "react";
import Image from "next/image";

interface ProductGalleryProps {
  images: Array<{ url: string; alt: string }>;
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const displayImages = images.length > 0 ? images : [{ url: "https://picsum.photos/seed/default/800/800", alt: productName }];

  return (
    <div className="space-y-3">
      {/* Main Image */}
      <div className="relative aspect-square overflow-hidden rounded-xl bg-ivory-cream">
        <Image
          src={displayImages[selectedIndex]?.url || displayImages[0].url}
          alt={displayImages[selectedIndex]?.alt || productName}
          fill
          className="object-cover transition-all duration-300"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>

      {/* Thumbnails */}
      {displayImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {displayImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                idx === selectedIndex
                  ? "border-terracotta shadow-[0_2px_4px_rgba(193,105,79,0.25)]"
                  : "border-transparent hover:border-soft-clay"
              }`}
            >
              <Image
                src={img.url}
                alt={img.alt}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
