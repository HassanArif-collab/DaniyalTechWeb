import { ShieldCheck, Truck, CreditCard, Smartphone } from "lucide-react";

const badges = [
  {
    icon: CreditCard,
    title: "Cash on Delivery",
    description: "Pay when you receive your order",
  },
  {
    icon: ShieldCheck,
    title: "Brand Warranty",
    description: "Genuine products with official warranty",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Delivery across Pakistan in 2-5 days",
  },
  {
    icon: Smartphone,
    title: "PTA Approved",
    description: "All mobile phones are PTA approved",
  },
];

export function TrustBadges() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
      {badges.map((badge) => (
        <div
          key={badge.title}
          className="flex flex-col items-center text-center p-4 sm:p-6 rounded-xl bg-white shadow-[0_2px_8px_rgba(26,26,46,0.06)] hover:shadow-[0_4px_16px_rgba(26,26,46,0.10)] transition-shadow duration-300"
        >
          <div className="w-12 h-12 rounded-full bg-terracotta/10 flex items-center justify-center mb-3">
            <badge.icon className="h-6 w-6 text-terracotta" />
          </div>
          <h3 className="font-semibold text-charcoal text-sm">{badge.title}</h3>
          <p className="text-xs text-muted-foreground mt-1">{badge.description}</p>
        </div>
      ))}
    </div>
  );
}
