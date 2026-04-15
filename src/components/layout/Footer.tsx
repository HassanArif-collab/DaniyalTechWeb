import Link from "next/link";
import { MessageCircle, Phone, MapPin, Mail } from "lucide-react";

const footerCategories = [
  { href: "/category/mobile-phones", label: "Mobile Phones" },
  { href: "/category/audio", label: "Audio" },
  { href: "/category/chargers-power", label: "Chargers & Power" },
  { href: "/category/accessories", label: "Accessories" },
  { href: "/category/wearable-tech", label: "Wearable Tech" },
];

const customerService = [
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Us" },
  { href: "/category/mobile-phones", label: "All Products" },
];

export function Footer() {
  return (
    <footer className="bg-charcoal text-white mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="font-serif text-xl font-bold text-warm-sand mb-4">DaniyalTech</h3>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">
              Premium electronics delivered across Pakistan. Cash on Delivery available on all orders. Brand warranty on every product.
            </p>
            <div className="flex items-center gap-2 text-sage-green">
              <MessageCircle className="h-5 w-5" />
              <span className="text-sm font-medium">WhatsApp: +92 300 1234567</span>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold text-warm-sand mb-4">Categories</h4>
            <ul className="space-y-2">
              {footerCategories.map((cat) => (
                <li key={cat.href}>
                  <Link href={cat.href} className="text-sm text-gray-400 hover:text-terracotta-light transition-colors">
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold text-warm-sand mb-4">Customer Service</h4>
            <ul className="space-y-2">
              {customerService.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-gray-400 hover:text-terracotta-light transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-warm-sand mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <Phone className="h-4 w-4 text-terracotta-light" />
                +92 300 1234567
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <Mail className="h-4 w-4 text-terracotta-light" />
                info@daniyaltech.pk
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-400">
                <MapPin className="h-4 w-4 text-terracotta-light mt-0.5" />
                Lahore, Punjab, Pakistan
              </li>
            </ul>
            <div className="mt-4 flex gap-2">
              <span className="inline-flex items-center rounded-md bg-sage-green/20 px-2 py-1 text-xs font-medium text-sage-green">
                Cash on Delivery
              </span>
              <span className="inline-flex items-center rounded-md bg-muted-gold/20 px-2 py-1 text-xs font-medium text-muted-gold">
                Brand Warranty
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} DaniyalTech. All rights reserved.
          </p>
          <p className="text-xs text-gray-600">
            Prices in PKR. All products are PTA approved where applicable.
          </p>
        </div>
      </div>
    </footer>
  );
}
