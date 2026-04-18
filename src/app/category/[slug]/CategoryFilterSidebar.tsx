"use client";

export function CategoryFilterSidebar({
  brands,
  maxPrice,
  slug,
  currentBrands,
  currentMinPrice,
  currentMaxPrice,
  currentInStock,
  currentSort,
}: {
  brands: any[];
  maxPrice: number;
  slug: string;
  currentBrands: string[];
  currentMinPrice: number;
  currentMaxPrice: number;
  currentInStock: boolean;
  currentSort: string;
}) {
  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
    { value: "rating", label: "Highest Rated" },
  ];

  return (
    <div className="lg:w-64 flex-shrink-0">
      <div className="hidden lg:block">
        <div className="bg-white rounded-xl p-5 shadow-[0_2px_8px_rgba(26,26,46,0.06)] mb-6">
          <h3 className="font-semibold text-charcoal mb-4">Filters</h3>

          {brands.length > 0 && (
            <div className="mb-5">
              <h4 className="text-sm font-semibold text-deep-slate mb-3">Brands</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {brands.map((brand) => (
                  <label key={brand.id} className="flex items-center gap-2 cursor-pointer text-sm">
                    <input
                      type="checkbox"
                      className="rounded border-soft-clay text-terracotta focus:ring-terracotta"
                      defaultChecked={currentBrands.includes(brand.id)}
                      onChange={() => {
                        const url = new URL(window.location.href);
                        const current = url.searchParams.get("brands")?.split(",").filter(Boolean) || [];
                        const newBrands = current.includes(brand.id)
                          ? current.filter((b) => b !== brand.id)
                          : [...current, brand.id];
                        if (newBrands.length > 0) {
                          url.searchParams.set("brands", newBrands.join(","));
                        } else {
                          url.searchParams.delete("brands");
                        }
                        window.location.href = url.toString();
                      }}
                    />
                    {brand.name}
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="mb-5">
            <h4 className="text-sm font-semibold text-deep-slate mb-2">Price Range</h4>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Rs. {currentMinPrice.toLocaleString()}</span>
              <span>-</span>
              <span>Rs. {currentMaxPrice.toLocaleString()}</span>
            </div>
          </div>

          <div className="mb-5">
            <label className="flex items-center gap-2 cursor-pointer text-sm">
              <input
                type="checkbox"
                className="rounded border-soft-clay text-terracotta focus:ring-terracotta"
                defaultChecked={currentInStock}
                onChange={() => {
                  const url = new URL(window.location.href);
                  if (currentInStock) {
                    url.searchParams.delete("inStock");
                  } else {
                    url.searchParams.set("inStock", "true");
                  }
                  window.location.href = url.toString();
                }}
              />
              In Stock Only
            </label>
          </div>

          <a href={`/category/${slug}`} className="text-sm text-terracotta hover:text-terracotta-hover font-medium">
            Clear All Filters
          </a>
        </div>
      </div>

      <select
        className="text-sm border border-soft-clay/50 rounded-lg px-3 py-2 bg-white text-deep-slate focus:border-terracotta focus:ring-terracotta/20 mb-6 w-full lg:w-auto"
        defaultValue={currentSort}
        onChange={(e) => {
          const url = new URL(window.location.href);
          url.searchParams.set("sort", e.target.value);
          window.location.href = url.toString();
        }}
      >
        {sortOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}
