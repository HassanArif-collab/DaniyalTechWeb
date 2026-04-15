import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPKR(rupees: number): string {
  return `Rs. ${rupees.toLocaleString("en-PK")}`;
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

export function buildWhatsAppURL(
  productName: string,
  productPrice: string,
  productURL: string,
  phoneNumber: string = "923001234567"
): string {
  const message = `Hi! I'm interested in ${productName} (${productPrice}). Is it available? ${productURL}`;
  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
}

export function getDiscountPercentage(price: number, compareAtPrice: number): number {
  if (!compareAtPrice || compareAtPrice <= price) return 0;
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}

export function parseJSON<T>(str: string, fallback: T): T {
  try {
    return JSON.parse(str) as T;
  } catch {
    return fallback;
  }
}
