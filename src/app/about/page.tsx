import Link from "next/link";
import { ShieldCheck, Truck, CreditCard, Smartphone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <nav className="mb-6 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-terracotta">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-charcoal font-medium">About Us</span>
      </nav>

      <div className="max-w-3xl">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal mb-6">About DaniyalTech</h1>

        <div className="prose prose-lg max-w-none space-y-6">
          <p className="text-deep-slate leading-relaxed text-lg">
            DaniyalTech is Pakistan&apos;s trusted online electronics store, bringing you the latest smartphones, audio devices, chargers, and accessories at the best prices. Founded with a mission to make premium technology accessible to every Pakistani, we ensure every product meets the highest standards of quality and authenticity.
          </p>

          <p className="text-deep-slate leading-relaxed">
            We understand the unique needs of the Pakistani market. That is why we offer Cash on Delivery on all orders, brand warranty on every product, and PTA-approved mobile phones that work seamlessly on all local networks. Our commitment to customer satisfaction drives everything we do.
          </p>

          <h2 className="font-serif text-2xl font-bold text-charcoal mt-8 mb-4">Why Choose DaniyalTech?</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
            <div className="flex gap-3 items-start p-4 rounded-xl bg-white shadow-[0_2px_8px_rgba(26,26,46,0.06)]">
              <CreditCard className="h-6 w-6 text-terracotta mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-charcoal">Cash on Delivery</h3>
                <p className="text-sm text-muted-foreground mt-1">Pay when you receive your order. No advance payment needed.</p>
              </div>
            </div>
            <div className="flex gap-3 items-start p-4 rounded-xl bg-white shadow-[0_2px_8px_rgba(26,26,46,0.06)]">
              <ShieldCheck className="h-6 w-6 text-sage-green mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-charcoal">Brand Warranty</h3>
                <p className="text-sm text-muted-foreground mt-1">Every product comes with official brand or shop warranty.</p>
              </div>
            </div>
            <div className="flex gap-3 items-start p-4 rounded-xl bg-white shadow-[0_2px_8px_rgba(26,26,46,0.06)]">
              <Truck className="h-6 w-6 text-muted-gold mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-charcoal">Fast Delivery</h3>
                <p className="text-sm text-muted-foreground mt-1">Delivery across Pakistan within 2-5 business days.</p>
              </div>
            </div>
            <div className="flex gap-3 items-start p-4 rounded-xl bg-white shadow-[0_2px_8px_rgba(26,26,46,0.06)]">
              <Smartphone className="h-6 w-6 text-terracotta-light mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-charcoal">PTA Approved</h3>
                <p className="text-sm text-muted-foreground mt-1">All mobile phones are PTA approved and work on all networks.</p>
              </div>
            </div>
          </div>

          <div className="mt-8 p-6 bg-ivory-cream rounded-xl">
            <h2 className="font-serif text-xl font-bold text-charcoal mb-3">Have Questions?</h2>
            <p className="text-deep-slate mb-4">
              Our team is available on WhatsApp to help you with any questions about products, orders, or warranties.
            </p>
            <a href="https://wa.me/923001234567?text=Hi! I have a question about DaniyalTech." target="_blank" rel="noopener noreferrer">
              <Button className="bg-sage-green hover:bg-sage-green/90 text-white rounded-xl">
                <MessageCircle className="mr-2 h-4 w-4" />
                Chat on WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
