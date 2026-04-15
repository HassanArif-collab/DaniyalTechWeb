# E-Commerce Website: End-to-End Implementation Guide

> **Companion document to the E-Commerce Website PRD v1.0**
> This guide translates the PRD into a concrete, step-by-step build plan. Every step includes the exact commands, file paths, code patterns, and integration details needed to go from an empty folder to a deployed, production-ready website.

---

## Table of Contents

- [Step 0: Prerequisites & Accounts](#step-0-prerequisites--accounts)
- [Step 1: Project Scaffolding](#step-1-project-scaffolding)
- [Step 2: Design System Setup (Tailwind + Fonts + Colors)](#step-2-design-system-setup)
- [Step 3: Database Schema (Prisma + PostgreSQL)](#step-3-database-schema)
- [Step 4: Payload CMS Integration & Admin Collections](#step-4-payload-cms-integration)
- [Step 5: Cloud Storage Setup (Cloudinary + R2)](#step-5-cloud-storage-setup)
- [Step 6: Layout Components (Navbar, Footer, Layout Shell)](#step-6-layout-components)
- [Step 7: Homepage](#step-7-homepage)
- [Step 8: Category & Product Listing Pages](#step-8-category--product-listing-pages)
- [Step 9: Product Detail Page](#step-9-product-detail-page)
- [Step 10: Search & Faceted Filtering System](#step-10-search--faceted-filtering-system)
- [Step 11: WhatsApp Integration](#step-11-whatsapp-integration)
- [Step 12: SEO Implementation](#step-12-seo-implementation)
- [Step 13: Analytics & Tracking (GA4 + Meta Pixel)](#step-13-analytics--tracking)
- [Step 14: Performance Optimization](#step-14-performance-optimization)
- [Step 15: Deployment & Hosting](#step-15-deployment--hosting)
- [Step 16: Post-Launch Checklist](#step-16-post-launch-checklist)

---

## Step 0: Prerequisites & Accounts

Before writing any code, set up all the free-tier accounts you'll need.

### 0.1 Install Local Tools

```bash
# Node.js 20+ (required for Next.js 15)
node -v  # should be v20.x or higher

# Bun (faster alternative to npm)
curl -fsSL https://bun.sh/install | bash

# Git
git --version
```

### 0.2 Create Free-Tier Accounts

Create accounts in this exact order — save all API keys and connection strings in a password manager.

| Service | URL | What You Get (Free) |
|---------|-----|---------------------|
| **Vercel** | https://vercel.com/signup | 100GB bandwidth/month, serverless functions, auto CI/CD |
| **Neon** | https://neon.tech/signup | 0.5GB PostgreSQL, 100 compute hours/month |
| **Cloudinary** | https://cloudinary.com/users/register_free | 25 credits/month, 2GB storage, 5GB bandwidth |
| **Cloudflare** | https://dash.cloudflare.com/sign-up | Free CDN, R2 storage (10GB), DDoS protection, SSL |
| **Google Analytics** | https://analytics.google.com | GA4 property with e-commerce tracking |
| **Meta Business** | https://business.facebook.com | Pixel for ad tracking |
| **Google Search Console** | https://search.google.com/search-console | SEO monitoring, sitemap submission |
| **GitHub** | https://github.com/signup | Code repository, Vercel integration |

### 0.3 Domain Registration (Optional for MVP)

- **.pk domain**: Purchase via PKNIC (https://pknic.net.pk) — approx PKR 1,800/year (~$6.50)
- **.com domain**: Purchase via Namecheap (https://namecheap.com) — approx $6-9/year
- **Free for MVP**: Use Vercel's `.vercel.app` subdomain during development

---

## Step 1: Project Scaffolding

### 1.1 Create the Next.js Project

```bash
# Create Next.js 15 project with App Router
npx create-next-app@latest ecommerce-store \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --use-bun

cd ecommerce-store
```

### 1.2 Install Core Dependencies

```bash
# Payload CMS 3 (runs inside Next.js)
bun add @payloadcms/next @payloadcms/db-postgres @payloadcms/richtext-lexical

# Prisma ORM
bun add prisma @prisma/client
bun add -D prisma

# UI & Styling
bun add lucide-react clsx tailwind-merge class-variance-authority

# Image handling
bun add next-cloudinary

# SEO
bun add next-sitemap

# Utilities
bun add slugify zod
```

### 1.3 Set Up Environment Variables

Create `.env.local` in the project root:

```bash
# ─── Database (Neon PostgreSQL) ───
DATABASE_URL="postgresql://username:password@ep-xxx-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require"

# ─── Payload CMS ───
PAYLOAD_SECRET="your-32-char-random-secret-here"
NEXT_PUBLIC_PAYLOAD_URL="http://localhost:3000"

# ─── Cloudinary (Images) ───
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
CLOUDINARY_UPLOAD_PRESET="ecommerce-upload"

# ─── Cloudflare R2 (Videos) ───
R2_ACCOUNT_ID="your-account-id"
R2_ACCESS_KEY_ID="your-access-key"
R2_SECRET_ACCESS_KEY="your-secret-key"
R2_BUCKET_NAME="ecommerce-videos"
R2_PUBLIC_URL="https://pub-xxx.r2.dev"

# ─── WhatsApp ───
NEXT_PUBLIC_WHATSAPP_NUMBER="92XXXXXXXXXX"  # Your WhatsApp Business number with country code, no +

# ─── Analytics ───
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-XXXXXXXXXX"
NEXT_PUBLIC_META_PIXEL_ID="XXXXXXXXXXXXXXX"

# ─── Site ───
NEXT_PUBLIC_SITE_URL="https://your-store.vercel.app"
NEXT_PUBLIC_SITE_NAME="YourStoreName"
```

### 1.4 Project Directory Structure

Create the following folder structure inside `src/`:

```
src/
├── app/
│   ├── (frontend)/               # Public-facing route group
│   │   ├── page.tsx              # Homepage
│   │   ├── [category]/
│   │   │   ├── page.tsx          # Category listing
│   │   │   └── [product]/
│   │   │       └── page.tsx      # Product detail
│   │   ├── [category]/[subcategory]/
│   │   │   └── page.tsx          # Subcategory listing
│   │   ├── search/
│   │   │   └── page.tsx          # Search results
│   │   ├── about/
│   │   │   └── page.tsx          # About page
│   │   └── contact/
│   │       └── page.tsx          # Contact page
│   ├── admin/                    # Payload CMS admin (auto-generated)
│   │   └── [[...segments]]/
│   │       └── page.tsx
│   ├── api/                      # API route handlers
│   │   ├── products/
│   │   ├── categories/
│   │   ├── search/
│   │   └── media/
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles + Tailwind
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── MobileMenu.tsx
│   │   └── LayoutShell.tsx
│   ├── product/
│   │   ├── ProductCard.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── ProductGallery.tsx
│   │   ├── ProductInfo.tsx
│   │   └── RelatedProducts.tsx
│   ├── filters/
│   │   ├── FilterSidebar.tsx
│   │   ├── FilterChip.tsx
│   │   ├── PriceSlider.tsx
│   │   └── MobileFilterSheet.tsx
│   ├── search/
│   │   ├── SearchBar.tsx
│   │   └── SearchSuggestions.tsx
│   ├── seo/
│   │   ├── JsonLdProduct.tsx
│   │   ├── JsonLdBreadcrumb.tsx
│   │   └── MetaTags.tsx
│   ├── whatsapp/
│   │   ├── WhatsAppButton.tsx
│   │   └── FloatingWhatsApp.tsx
│   ├── trust/
│   │   ├── TrustBadges.tsx
│   │   └── WarrantyBadge.tsx
│   └── ui/                       # shadcn/ui base components
│       ├── button.tsx
│       ├── badge.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── sheet.tsx
│       ├── skeleton.tsx
│       └── slider.tsx
├── lib/
│   ├── payload.ts                # Payload CMS client config
│   ├── cloudinary.ts             # Cloudinary upload helpers
│   ├── r2.ts                     # R2 upload helpers
│   ├── whatsapp.ts               # WhatsApp URL builder
│   ├── seo.ts                    # SEO metadata generators
│   ├── analytics.ts              # GA4 + Meta Pixel helpers
│   └── utils.ts                  # cn(), formatPKR(), slugify()
├── payload/
│   ├── config.ts                 # Payload main config
│   └── collections/
│       ├── Products.ts
│       ├── Categories.ts
│       ├── Brands.ts
│       ├── Tags.ts
│       ├── Media.ts
│       └── Reviews.ts
└── types/
    └── index.ts                  # Shared TypeScript types
```

### 1.5 Initialize Git

```bash
git init
git add .
git commit -m "Initial project scaffold"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ecommerce-store.git
git push -u origin main
```

---

## Step 2: Design System Setup

This step implements the anti-generic design identity from the PRD — warm earthy tones, premium typography, and deliberate minimalism.

### 2.1 Configure Tailwind CSS with Custom Palette

Update `tailwind.config.ts`:

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ─── Brand Colors (from PRD Section 5.2) ───
        charcoal: "#1A1A2E",
        "warm-sand": "#F5F0EB",
        terracotta: {
          DEFAULT: "#C1694F",
          hover: "#A85540",
          light: "#D4875A",
        },
        "sage-green": "#7C9A82",
        "ivory-cream": "#FAF8F5",
        "deep-slate": "#2D3436",
        "muted-gold": "#C9A84C",
        "soft-clay": "#D4B896",
        "error-red": "#C0392B",
      },
      fontFamily: {
        // ─── Typography (from PRD Section 5.3) ───
        display: ["Clash Display", "Playfair Display", "serif"],
        body: ["Plus Jakarta Sans", "DM Sans", "sans-serif"],
        price: ["Space Grotesk", "JetBrains Mono", "monospace"],
      },
      borderRadius: {
        card: "12px",    // Not the trendy 24px blob radius
        button: "12px",
      },
      spacing: {
        // 8px base unit system (from PRD Section 5.4)
        "1u": "8px",
        "2u": "16px",
        "3u": "24px",
        "4u": "32px",
        "6u": "48px",
        "8u": "64px",
        "12u": "96px",
      },
      boxShadow: {
        // Warm shadows, not cold-gray defaults
        card: "0 2px 8px rgba(26, 26, 46, 0.06)",
        "card-hover": "0 4px 16px rgba(26, 26, 46, 0.10)",
        button: "0 2px 4px rgba(193, 105, 79, 0.25)",
      },
    },
  },
  plugins: [],
};

export default config;
```

### 2.2 Load Custom Fonts

Update `src/app/layout.tsx` to import fonts with `font-display: swap`:

```typescript
import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

// Clash Display — download from fontshare.com and place in /public/fonts/
const clashDisplay = localFont({
  src: [
    { path: "../../public/fonts/ClashDisplay-Semibold.woff2", weight: "600" },
  ],
  variable: "--font-display",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-price",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Electronics Store Pakistan",
  description: "Shop electronics online — mobile phones, AirPods, chargers & accessories. Cash on Delivery available across Pakistan.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${clashDisplay.variable} ${plusJakarta.variable} ${spaceGrotesk.variable}`}
    >
      <body className="font-body bg-warm-sand text-charcoal antialiased">
        {children}
      </body>
    </html>
  );
}
```

### 2.3 Download Clash Display Font

```bash
# Create fonts directory
mkdir -p public/fonts

# Download Clash Display from Fontshare (free)
# Visit https://www.fontshare.com/fonts/clash-display
# Download the woff2 files and place in public/fonts/
# Required file: ClashDisplay-Semibold.woff2
```

### 2.4 Global CSS Base Styles

Update `src/app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  /* Warm sand background everywhere */
  body {
    @apply bg-warm-sand text-charcoal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* Smooth scrolling */
  html {
    scroll-behavior: smooth;
  }

  /* Selection color matches Terracotta accent */
  ::selection {
    @apply bg-terracotta/20 text-charcoal;
  }

  /* Focus rings use Terracotta */
  :focus-visible {
    @apply outline-2 outline-offset-2 outline-terracotta;
  }
}

@layer components {
  /* Container with max-width */
  .container-custom {
    @apply mx-auto max-w-7xl px-4u;
  }

  /* Product card hover animation */
  .card-hover {
    @apply transition-all duration-300 ease-out;
  }
  .card-hover:hover {
    @apply -translate-y-0.5 shadow-card-hover;
  }

  /* Price display with Space Grotesk */
  .price-display {
    @apply font-price text-2u font-medium text-charcoal;
  }

  /* Terracotta CTA button */
  .btn-primary {
    @apply inline-flex items-center justify-center gap-2u
           rounded-button bg-terracotta px-6u py-3u
           font-body text-sm font-semibold text-white
           shadow-button transition-all duration-200
           hover:bg-terracotta-hover hover:-translate-y-px
           active:translate-y-0 active:shadow-none;
  }

  /* Secondary outline button */
  .btn-secondary {
    @apply inline-flex items-center justify-center gap-2u
           rounded-button border-2 border-terracotta bg-transparent
           px-6u py-3u font-body text-sm font-semibold text-terracotta
           transition-all duration-200
           hover:bg-terracotta hover:text-white;
  }
}
```

### 2.5 Utility Functions

Create `src/lib/utils.ts`:

```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes without conflicts */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format number as PKR price: 399999 → "Rs. 3,99,999" */
export function formatPKR(priceInPaisa: number): string {
  const rupees = priceInPaisa / 100;
  return `Rs. ${rupees.toLocaleString("en-PK")}`;
}

/** Format number as PKR from rupees (not paisa) */
export function formatPKRDirect(rupees: number): string {
  return `Rs. ${rupees.toLocaleString("en-PK")}`;
}

/** Generate slug from text */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Truncate text with ellipsis */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

/** Build WhatsApp wa.me URL with pre-filled message */
export function buildWhatsAppURL(
  productName: string,
  productPrice: string,
  productURL: string,
  phoneNumber: string
): string {
  const message = `Hi! I'm interested in ${productName} (${productPrice}). Is it available? ${productURL}`;
  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
}
```

---

## Step 3: Database Schema

### 3.1 Initialize Prisma

```bash
bunx prisma init
```

### 3.2 Write the Complete Schema

Replace `prisma/schema.prisma` with the full schema. This implements the hybrid relational + JSONB approach from the PRD — common filterable fields as columns, variable specifications as JSONB.

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─── CATEGORIES (Hierarchical via Adjacency List) ───
model Category {
  id          String     @id @default(cuid())
  name        String
  slug        String     @unique
  description String?
  image       String?
  parentId    String?
  parent      Category?  @relation("CategoryTree", fields: [parentId], references: [id], onDelete: Cascade)
  children    Category[] @relation("CategoryTree")
  products    Product[]
  filters     FilterConfig[]
  seoTitle       String?
  seoDescription String?
  sortOrder   Int        @default(0)
  isActive    Boolean    @default(true)
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  @@index([parentId])
  @@index([slug])
}

// ─── BRANDS ───
model Brand {
  id          String     @id @default(cuid())
  name        String     @unique
  slug        String     @unique
  logo        String?
  description String?
  products    Product[]
  isActive    Boolean    @default(true)
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  @@index([slug])
}

// ─── TAGS ───
model Tag {
  id        String   @id @default(cuid())
  name      String   @unique
  slug      String   @unique
  products  Product[]
  createdAt DateTime @default(now())

  @@index([slug])
}

// ─── PRODUCTS ───
model Product {
  id               String        @id @default(cuid())
  name             String
  slug             String        @unique
  description      String?
  shortDescription String?       @db.VarChar(300)

  // Relationships
  categoryId       String
  category         Category      @relation(fields: [categoryId], references: [id])
  brandId          String?
  brand            Brand?        @relation(fields: [brandId], references: [id])
  tags             Tag[]         @manyToMany("ProductTags")

  // Pricing — stored in PAISA (1 PKR = 100 paisa) to avoid float issues
  price            Int
  compareAtPrice   Int?
  costPrice        Int?
  currency         String        @default("PKR")

  // Core filterable columns (indexed for fast queries)
  avgRating        Float         @default(0)
  reviewCount      Int           @default(0)
  totalStock       Int           @default(0)
  isInStock        Boolean       @default(true)

  // Dynamic specifications as JSONB
  // Electronics: { "RAM": "8GB", "Storage": "256GB", "Screen": "6.1\"", "Battery": "4000mAh" }
  specifications   Json          @default("{}")

  // Filterable specs extracted for GIN index
  // { "ram": ["8gb"], "storage": ["256gb"], "screen_size": ["6.1"] }
  filterableSpecs  Json          @default("{}")

  // Media
  images           Json          @default("[]")  // [{ url, alt, isFeatured, publicId }]
  videoUrl         String?

  // Warranty (critical for Pakistan)
  warranty         String?       // "Brand Warranty", "Shop Warranty", "None"
  warrantyPeriod   String?       // "12 Months", "6 Months"

  // Shipping
  weight           Float?        // in grams
  shippingFree     Boolean       @default(false)

  // Status
  status           ProductStatus @default(DRAFT)
  isFeatured       Boolean       @default(false)
  publishedAt      DateTime?

  // SEO
  seoTitle         String?
  seoDescription   String?

  // Variants
  variants         ProductVariant[]
  reviews          Review[]

  createdAt        DateTime      @default(now())
  updatedAt        DateTime      @updatedAt

  @@index([categoryId])
  @@index([brandId])
  @@index([slug])
  @@index([price])
  @@index([avgRating])
  @@index([isInStock])
  @@index([status])
  @@index([isFeatured])
  @@index([categoryId, status, isInStock])
}

// ─── PRODUCT VARIANTS ───
model ProductVariant {
  id             String   @id @default(cuid())
  productId      String
  product        Product  @relation(fields: [productId], references: [id], onDelete: Cascade)

  title          String   // "Black / 128GB"
  sku            String   @unique
  price          Int      // variant-level price override (paisa)
  compareAtPrice Int?
  stock          Int      @default(0)

  // Variant attributes: { "color": "Black", "storage": "128GB" }
  attributes     Json     @default("{}")

  // Variant-specific images
  images         Json     @default("[]")

  isActive       Boolean  @default(true)
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  @@index([productId])
  @@index([sku])
}

// ─── FILTER CONFIGURATION (per category) ───
model FilterConfig {
  id          String     @id @default(cuid())
  categoryId  String
  category    Category   @relation(fields: [categoryId], references: [id], onDelete: Cascade)

  name        String     // "RAM", "Storage", "Screen Size"
  slug        String     // "ram", "storage", "screen-size"
  type        FilterType @default(CHECKBOX)
  // options: ["4GB", "8GB", "16GB"] or { min: 0, max: 500000 }
  options     Json       @default("[]")
  sortOrder   Int        @default(0)
  isActive    Boolean    @default(true)

  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  @@unique([categoryId, slug])
  @@index([categoryId])
}

// ─── REVIEWS ───
model Review {
  id          String   @id @default(cuid())
  productId   String
  product     Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  userId      String
  userName    String
  rating      Int      // 1-5
  title       String?
  comment     String?  @db.Text
  isVerified  Boolean  @default(false)
  isApproved  Boolean  @default(false)
  createdAt   DateTime @default(now())

  @@index([productId])
  @@index([productId, isApproved])
}

// ─── ENUMS ───
enum ProductStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}

enum FilterType {
  CHECKBOX
  RANGE
  TOGGLE
}
```

### 3.3 Run Migration

```bash
# Generate Prisma client
bunx prisma generate

# Push schema to Neon database (creates tables)
bunx prisma db push

# If you prefer migrations (production-safe):
# bunx prisma migrate dev --name init
```

### 3.4 Create Prisma Client Singleton

Create `src/lib/prisma.ts`:

```typescript
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
});

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
```

### 3.5 Add GIN Indexes for JSONB Filtering

Run this SQL against your Neon database for performant JSONB queries:

```sql
-- Connect to Neon database
-- psql "postgresql://username:password@ep-xxx.neon.tech/neondb?sslmode=require"

-- GIN index for specifications JSONB
CREATE INDEX IF NOT EXISTS idx_product_specifications
  ON "Product" USING GIN (specifications jsonb_path_ops);

-- GIN index for filterable specs JSONB
CREATE INDEX IF NOT EXISTS idx_product_filterable_specs
  ON "Product" USING GIN (filterableSpecs jsonb_path_ops);

-- Composite index for common filter combinations
CREATE INDEX IF NOT EXISTS idx_product_cat_status_stock
  ON "Product" ("categoryId", status, "isInStock");

CREATE INDEX IF NOT EXISTS idx_product_brand_price
  ON "Product" ("brandId", price);
```

---

## Step 4: Payload CMS Integration

### 4.1 Configure Payload CMS

Create `src/payload.config.ts`:

```typescript
import { buildConfig } from "@payloadcms/next";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { Products } from "./collections/Products";
import { Categories } from "./collections/Categories";
import { Brands } from "./collections/Brands";
import { Tags } from "./collections/Tags";
import { Media } from "./collections/Media";
import { Reviews } from "./collections/Reviews";

export default buildConfig({
  editor: lexicalEditor(),
  collections: [Products, Categories, Brands, Tags, Media, Reviews],
  secret: process.env.PAYLOAD_SECRET!,
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
    },
  }),
  admin: {
    user: "admin", // Admin authentication
  },
  typescript: {
    outputFile: "src/payload-types.ts",
  },
});
```

### 4.2 Create Payload Collections

Create `src/payload/collections/Products.ts`:

```typescript
import type { CollectionConfig } from "@payloadcms/next";

export const Products: CollectionConfig = {
  slug: "products",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "category", "price", "stock", "status"],
    listSearchableFields: ["name", "slug"],
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      unique: true,
      index: true,
      admin: {
        position: "sidebar",
        description: "Auto-generated from name. Edit with caution.",
      },
      hooks: {
        beforeValidate: [({ data, operation }) => {
          if (operation === "create" && !data.slug && data.name) {
            data.slug = data.name
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/(^-|-$)/g, "");
          }
          return data;
        }],
      },
    },
    {
      name: "shortDescription",
      type: "textarea",
      maxLength: 300,
      admin: {
        description: "Brief product summary shown on product cards (max 300 chars)",
      },
    },
    {
      name: "description",
      type: "richText",
    },
    // ─── Relationships ───
    {
      name: "category",
      type: "relationship",
      relationTo: "categories",
      required: true,
      admin: { position: "sidebar" },
    },
    {
      name: "brand",
      type: "relationship",
      relationTo: "brands",
      admin: { position: "sidebar" },
    },
    {
      name: "tags",
      type: "relationship",
      relationTo: "tags",
      hasMany: true,
      admin: { position: "sidebar" },
    },
    // ─── Pricing ───
    {
      name: "pricing",
      type: "group",
      fields: [
        {
          name: "price",
          type: "number",
          required: true,
          min: 0,
          admin: { description: "Price in PKR (whole rupees)" },
        },
        {
          name: "compareAtPrice",
          type: "number",
          min: 0,
          admin: { description: "Original price before discount (strikethrough)" },
        },
        {
          name: "costPrice",
          type: "number",
          min: 0,
          admin: { description: "Your cost price (not shown to customers)" },
        },
      ],
    },
    // ─── Media ───
    {
      name: "images",
      type: "upload",
      relationTo: "media",
      hasMany: true,
      admin: {
        description: "Upload 5-8 product images. First image is the featured image.",
      },
    },
    {
      name: "video",
      type: "upload",
      relationTo: "media",
      filterOptions: { mimeType: { contains: "video" } },
      admin: {
        description: "Optional product demo video (MP4, max 100MB)",
      },
    },
    // ─── Specifications ───
    {
      name: "specifications",
      type: "json",
      admin: {
        description: 'Key-value pairs: { "Screen": "6.1 inch", "RAM": "8GB" }',
      },
    },
    {
      name: "highlights",
      type: "array",
      fields: [
        {
          name: "point",
          type: "text",
        },
      ],
      admin: {
        description: "Key selling points shown as bullet list",
      },
    },
    // ─── Warranty (Pakistan-specific) ───
    {
      name: "warranty",
      type: "select",
      options: [
        { label: "Brand Warranty", value: "brand" },
        { label: "Shop Warranty", value: "shop" },
        { label: "No Warranty", value: "none" },
      ],
      admin: { position: "sidebar" },
    },
    {
      name: "warrantyPeriod",
      type: "select",
      options: [
        { label: "3 Months", value: "3" },
        { label: "6 Months", value: "6" },
        { label: "12 Months", value: "12" },
        { label: "24 Months", value: "24" },
      ],
      admin: { position: "sidebar" },
    },
    // ─── Status & Visibility ───
    {
      name: "stock",
      type: "number",
      defaultValue: 0,
      min: 0,
      admin: { position: "sidebar" },
    },
    {
      name: "status",
      type: "select",
      options: [
        { label: "Draft", value: "draft" },
        { label: "Published", value: "published" },
        { label: "Archived", value: "archived" },
      ],
      defaultValue: "draft",
      admin: { position: "sidebar" },
    },
    {
      name: "isFeatured",
      type: "checkbox",
      defaultValue: false,
      admin: {
        position: "sidebar",
        description: "Featured products appear on homepage",
      },
    },
    // ─── SEO ───
    {
      name: "seo",
      type: "group",
      fields: [
        {
          name: "title",
          type: "text",
          admin: {
            description: "Override meta title. Default: [Brand] [Name] - StoreName",
          },
        },
        {
          name: "description",
          type: "textarea",
          maxLength: 160,
        },
      ],
    },
  ],
};
```

Create `src/payload/collections/Categories.ts`:

```typescript
import type { CollectionConfig } from "@payloadcms/next";

export const Categories: CollectionConfig = {
  slug: "categories",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "slug", "parent", "sortOrder", "isActive"],
  },
  fields: [
    { name: "name", type: "text", required: true },
    {
      name: "slug",
      type: "text",
      unique: true,
      hooks: {
        beforeValidate: [({ data, operation }) => {
          if (operation === "create" && !data.slug && data.name) {
            data.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
          }
          return data;
        }],
      },
    },
    { name: "description", type: "textarea" },
    { name: "image", type: "upload", relationTo: "media" },
    {
      name: "parent",
      type: "relationship",
      relationTo: "categories",
      admin: { description: "Leave empty for top-level category" },
    },
    { name: "sortOrder", type: "number", defaultValue: 0 },
    { name: "isActive", type: "checkbox", defaultValue: true },
    // SEO group
    {
      name: "seo",
      type: "group",
      fields: [
        { name: "title", type: "text" },
        { name: "description", type: "textarea", maxLength: 160 },
      ],
    },
  ],
};
```

Create `src/payload/collections/Tags.ts`:

```typescript
import type { CollectionConfig } from "@payloadcms/next";

export const Tags: CollectionConfig = {
  slug: "tags",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "slug"],
  },
  fields: [
    { name: "name", type: "text", required: true, unique: true },
    {
      name: "slug",
      type: "text",
      unique: true,
      hooks: {
        beforeValidate: [({ data, operation }) => {
          if (operation === "create" && !data.slug && data.name) {
            data.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
          }
          return data;
        }],
      },
    },
  ],
};
```

Create `src/payload/collections/Brands.ts`:

```typescript
import type { CollectionConfig } from "@payloadcms/next";

export const Brands: CollectionConfig = {
  slug: "brands",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "slug"],
  },
  fields: [
    { name: "name", type: "text", required: true, unique: true },
    { name: "slug", type: "text", unique: true },
    { name: "logo", type: "upload", relationTo: "media" },
    { name: "description", type: "textarea" },
    { name: "isActive", type: "checkbox", defaultValue: true },
  ],
};
```

Create `src/payload/collections/Media.ts`:

```typescript
import type { CollectionConfig } from "@payloadcms/next";

export const Media: CollectionConfig = {
  slug: "media",
  upload: {
    staticURL: "/media",
    staticDir: "media",
    imageSizes: [
      { name: "thumbnail", width: 400, height: 400, position: "centre" },
      { name: "small", width: 800, height: 800, position: "centre" },
      { name: "medium", width: 1200, height: 1200, position: "centre" },
      { name: "large", width: 1600, height: 1600, position: "centre" },
    ],
    adminThumbnail: "thumbnail",
    mimeTypes: ["image/*", "video/mp4"],
  },
  fields: [
    { name: "alt", type: "text", required: true },
  ],
};
```

Create `src/payload/collections/Reviews.ts`:

```typescript
import type { CollectionConfig } from "@payloadcms/next";

export const Reviews: CollectionConfig = {
  slug: "reviews",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["product", "userName", "rating", "isApproved"],
  },
  fields: [
    { name: "product", type: "relationship", relationTo: "products", required: true },
    { name: "userName", type: "text", required: true },
    { name: "rating", type: "number", required: true, min: 1, max: 5 },
    { name: "title", type: "text" },
    { name: "comment", type: "textarea" },
    { name: "isVerified", type: "checkbox", defaultValue: false },
    { name: "isApproved", type: "checkbox", defaultValue: false },
  ],
};
```

---

## Step 5: Cloud Storage Setup

### 5.1 Cloudinary Configuration

Create `src/lib/cloudinary.ts`:

```typescript
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

/**
 * Generate optimized image URL with automatic format and quality
 * Uses Cloudinary's f_auto,q_auto for best performance on Pakistani 4G
 */
export function getOptimizedImageUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    quality?: string;
  } = {}
): string {
  const { width, height, quality = "auto:good" } = options;

  return cloudinary.url(publicId, {
    fetch_format: "auto",     // Auto WebP/AVIF
    quality,                   // auto:good = 85% quality
    width,
    height,
    crop: "fill",
    dpr: "auto",
  })!;
}

/**
 * Generate blur placeholder URL (LQIP) for smooth loading
 */
export function getBlurPlaceholderUrl(publicId: string): string {
  return cloudinary.url(publicId, {
    width: 20,
    quality: "auto:low",
    crop: "fill",
    fetch_format: "auto",
  })!;
}

/**
 * Generate responsive image srcset
 * Returns sizes optimized for product cards and detail pages
 */
export function getResponsiveUrls(publicId: string) {
  return {
    thumbnail: getOptimizedImageUrl(publicId, { width: 400 }),
    small: getOptimizedImageUrl(publicId, { width: 800 }),
    medium: getOptimizedImageUrl(publicId, { width: 1200 }),
    large: getOptimizedImageUrl(publicId, { width: 1600 }),
    blur: getBlurPlaceholderUrl(publicId),
  };
}
```

### 5.2 Cloudflare R2 for Video Storage

Create `src/lib/r2.ts`:

```typescript
/**
 * Cloudflare R2 video URL builder
 * Videos are stored in R2 (zero egress) and delivered via public URL
 * For MVP, videos can also be uploaded directly to Cloudinary
 */

export function getVideoUrl(videoKey: string): string {
  const publicUrl = process.env.R2_PUBLIC_URL;
  return `${publicUrl}/${videoKey}`;
}

/**
 * Generate video thumbnail URL from Cloudinary
 * If video is stored in R2, use Cloudinary's fetch API to generate thumbnails
 */
export function getVideoThumbnailUrl(r2VideoUrl: string): string {
  // Use Cloudinary to generate thumbnail from R2 video URL
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  return `https://res.cloudinary.com/${cloudName}/video/so_1,w_800,q_auto,f_auto/${encodeURIComponent(r2VideoUrl)}`;
}
```

---

## Step 6: Layout Components

### 6.1 Navbar Component

Create `src/components/layout/Navbar.tsx`:

```typescript
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Menu, X, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { SearchBar } from "@/components/search/SearchBar";

const navLinks = [
  { href: "/mobile-phones", label: "Mobile Phones" },
  { href: "/audio", label: "Audio" },
  { href: "/chargers-power", label: "Chargers & Power" },
  { href: "/accessories", label: "Accessories" },
  { href: "/wearable-tech", label: "Wearable Tech" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

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
          ? "bg-white/80 backdrop-blur-md shadow-sm border-b border-soft-clay/30"
          : "bg-warm-sand border-b border-transparent"
      )}
    >
      <div className="container-custom flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="font-display text-2xl font-semibold text-charcoal">
          StoreName
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8u">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-body text-sm font-medium text-deep-slate hover:text-terracotta border-b-2 border-transparent hover:border-terracotta transition-all pb-0.5"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3u">
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="p-2u rounded-full hover:bg-ivory-cream transition-colors"
            aria-label="Search"
          >
            <Search className="w-5 h-5 text-deep-slate" />
          </button>
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex p-2u rounded-full hover:bg-ivory-cream transition-colors"
            aria-label="WhatsApp"
          >
            <MessageCircle className="w-5 h-5 text-sage-green" />
          </a>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2u rounded-full hover:bg-ivory-cream transition-colors"
            aria-label="Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Search Overlay */}
      {isSearchOpen && (
        <div className="border-t border-soft-clay/30 bg-white/90 backdrop-blur-md">
          <div className="container-custom py-4u">
            <SearchBar onClose={() => setIsSearchOpen(false)} />
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-soft-clay/30 bg-ivory-cream">
          <div className="container-custom py-4u space-y-2u">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2u font-body text-base font-medium text-deep-slate hover:text-terracotta"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
```

### 6.2 Footer Component

Create `src/components/layout/Footer.tsx`:

```typescript
import Link from "next/link";
import { MessageCircle, Phone, Mail, MapPin } from "lucide-react";

const footerCategories = [
  { href: "/mobile-phones", label: "Mobile Phones" },
  { href: "/audio", label: "Audio" },
  { href: "/chargers-power", label: "Chargers & Power" },
  { href: "/accessories", label: "Accessories" },
];

const footerLinks = [
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];

export function Footer() {
  return (
    <footer className="bg-charcoal text-white/80">
      <div className="container-custom py-12u">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8u">
          {/* Brand */}
          <div>
            <h3 className="font-display text-xl font-semibold text-white mb-4u">
              StoreName
            </h3>
            <p className="font-body text-sm text-white/60 leading-relaxed">
              Your trusted destination for quality electronics in Pakistan.
              Cash on Delivery available across all cities.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-body text-sm font-semibold text-white mb-4u uppercase tracking-wider">
              Categories
            </h4>
            <ul className="space-y-2u">
              {footerCategories.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-body text-sm text-white/60 hover:text-terracotta-light transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-body text-sm font-semibold text-white mb-4u uppercase tracking-wider">
              Support
            </h4>
            <ul className="space-y-2u">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-body text-sm text-white/60 hover:text-terracotta-light transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-body text-sm font-semibold text-white mb-4u uppercase tracking-wider">
              Get in Touch
            </h4>
            <ul className="space-y-3u">
              <li>
                <a
                  href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
                  className="flex items-center gap-2u font-body text-sm text-white/60 hover:text-sage-green transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp Us
                </a>
              </li>
              <li>
                <a href="tel:+92XXXXXXXXXX" className="flex items-center gap-2u font-body text-sm text-white/60 hover:text-terracotta-light transition-colors">
                  <Phone className="w-4 h-4" />
                  +92 XXX XXXXXXX
                </a>
              </li>
              <li>
                <a href="mailto:info@storename.pk" className="flex items-center gap-2u font-body text-sm text-white/60 hover:text-terracotta-light transition-colors">
                  <Mail className="w-4 h-4" />
                  info@storename.pk
                </a>
              </li>
              <li>
                <span className="flex items-center gap-2u font-body text-sm text-white/60">
                  <MapPin className="w-4 h-4" />
                  Lahore, Pakistan
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8u pt-6u border-t border-white/10 text-center">
          <p className="font-body text-xs text-white/40">
            &copy; {new Date().getFullYear()} StoreName. All rights reserved.
            Cash on Delivery available across Pakistan.
          </p>
        </div>
      </div>
    </footer>
  );
}
```

### 6.3 Root Layout Shell

Update `src/app/layout.tsx` to include Navbar and Footer:

```typescript
// ... (font imports from Step 2.2)

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingWhatsApp } from "@/components/whatsapp/FloatingWhatsApp";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${clashDisplay.variable} ${plusJakarta.variable} ${spaceGrotesk.variable}`}>
      <body className="font-body bg-warm-sand text-charcoal antialiased">
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <FloatingWhatsApp />
      </body>
    </html>
  );
}
```

---

## Step 7: Homepage

### 7.1 Homepage Implementation

Create `src/app/(frontend)/page.tsx`:

```typescript
import { prisma } from "@/lib/prisma";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { TrustBadges } from "@/components/trust/TrustBadges";

export default async function HomePage() {
  // Fetch featured products and categories in parallel
  const [featuredProducts, categories] = await Promise.all([
    prisma.product.findMany({
      where: { status: "PUBLISHED", isFeatured: true, isInStock: true },
      take: 8,
      orderBy: { createdAt: "desc" },
      include: { brand: true, category: true },
    }),
    prisma.category.findMany({
      where: { parentId: null, isActive: true },
      include: { children: true },
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  return (
    <>
      <HeroSection />
      <FeaturedProducts products={featuredProducts} />
      <CategoryGrid categories={categories} />
      <TrustBadges />
    </>
  );
}
```

### 7.2 Hero Section

Create `src/components/home/HeroSection.tsx`:

```typescript
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative bg-charcoal text-white overflow-hidden">
      {/* Background with warm gradient overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: "url('/hero-electronics.jpg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-charcoal/90 via-charcoal/70 to-transparent" />

      <div className="container-custom relative z-10 py-16u md:py-20u">
        <div className="max-w-2xl">
          <p className="font-body text-sm font-medium text-muted-gold tracking-wider uppercase mb-4u">
            New Arrivals 2026
          </p>
          <h1 className="font-display text-4u md:text-5u lg:text-6u font-semibold leading-tight mb-6u">
            Premium Electronics,
            <br />
            <span className="text-terracotta-light">Delivered to You</span>
          </h1>
          <p className="font-body text-lg text-white/70 mb-8u max-w-lg">
            Shop the latest smartphones, AirPods, and accessories.
            Cash on Delivery across Pakistan.
          </p>
          <div className="flex flex-wrap gap-4u">
            <Link href="/mobile-phones" className="btn-primary">
              Shop Now <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/about" className="btn-secondary border-white/30 text-white hover:bg-white/10">
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
```

### 7.3 Featured Products Component

Create `src/components/home/FeaturedProducts.tsx`:

```typescript
import { ProductCard } from "@/components/product/ProductCard";

export function FeaturedProducts({ products }: { products: any[] }) {
  if (products.length === 0) return null;

  return (
    <section className="py-12u">
      <div className="container-custom">
        <div className="flex items-end justify-between mb-8u">
          <div>
            <h2 className="font-display text-2u md:text-3u font-semibold text-charcoal">
              Featured Products
            </h2>
            <p className="font-body text-deep-slate mt-1u">
              Hand-picked by our team
            </p>
          </div>
          <a
            href="/mobile-phones"
            className="font-body text-sm font-medium text-terracotta hover:text-terracotta-hover transition-colors"
          >
            View All →
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3u md:gap-4u">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
```

### 7.4 Product Card Component

Create `src/components/product/ProductCard.tsx` — this is the most reused component:

```typescript
import Link from "next/link";
import Image from "next/image";
import { formatPKRDirect } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    compareAtPrice?: number | null;
    images: any[];
    isInStock: boolean;
    category: { slug: string };
    brand?: { name: string } | null;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const primaryImage = product.images?.[0];
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)
    : 0;

  return (
    <Link
      href={`/${product.category.slug}/${product.slug}`}
      className="group block bg-ivory-cream rounded-card overflow-hidden shadow-card card-hover"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-warm-sand">
        {primaryImage ? (
          <Image
            src={primaryImage.url}
            alt={primaryImage.alt || product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            placeholder="blur"
            blurDataURL={primaryImage.blurUrl}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-deep-slate/30">
            <span className="font-body text-sm">No Image</span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2u left-2u flex flex-col gap-1u">
          {hasDiscount && (
            <Badge className="bg-error-red text-white text-xs font-body">
              -{discountPercent}%
            </Badge>
          )}
          {!product.isInStock && (
            <Badge className="bg-deep-slate text-white text-xs font-body">
              Out of Stock
            </Badge>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-3u md:p-4u">
        {product.brand && (
          <p className="font-body text-xs text-deep-slate/60 mb-1u">
            {product.brand.name}
          </p>
        )}
        <h3 className="font-body text-sm font-semibold text-charcoal line-clamp-2 mb-2u">
          {product.name}
        </h3>
        <div className="flex items-baseline gap-2u">
          <span className="price-display text-lg">
            {formatPKRDirect(product.price)}
          </span>
          {hasDiscount && (
            <span className="font-body text-sm text-deep-slate/40 line-through">
              {formatPKRDirect(product.compareAtPrice!)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
```

### 7.5 Category Grid & Trust Badges

Create `src/components/home/CategoryGrid.tsx`:

```typescript
import Link from "next/link";
import Image from "next/image";

export function CategoryGrid({ categories }: { categories: any[] }) {
  return (
    <section className="py-12u bg-ivory-cream">
      <div className="container-custom">
        <h2 className="font-display text-2u md:text-3u font-semibold text-charcoal text-center mb-8u">
          Shop by Category
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3u">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/${cat.slug}`}
              className="group relative aspect-[4/3] rounded-card overflow-hidden bg-warm-sand"
            >
              {cat.image && (
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 20vw"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 to-transparent" />
              <div className="absolute bottom-3u left-3u">
                <h3 className="font-body text-sm font-semibold text-white">
                  {cat.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
```

Create `src/components/trust/TrustBadges.tsx`:

```typescript
import { Truck, Shield, RotateCcw, MessageCircle } from "lucide-react";

const badges = [
  {
    icon: Truck,
    title: "Free Delivery",
    description: "Across Pakistan on orders above PKR 2,000",
  },
  {
    icon: Shield,
    title: "Official Warranty",
    description: "Brand warranty on all electronics",
  },
  {
    icon: RotateCcw,
    title: "7-Day Returns",
    description: "Easy returns, no questions asked",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp Support",
    description: "Chat with us directly for any queries",
  },
];

export function TrustBadges() {
  return (
    <section className="py-8u border-y border-soft-clay/30">
      <div className="container-custom">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4u">
          {badges.map((badge) => (
            <div key={badge.title} className="flex items-start gap-3u">
              <div className="p-2u rounded-lg bg-sage-green/10">
                <badge.icon className="w-5 h-5 text-sage-green" />
              </div>
              <div>
                <h4 className="font-body text-sm font-semibold text-charcoal">
                  {badge.title}
                </h4>
                <p className="font-body text-xs text-deep-slate/60 mt-0.5">
                  {badge.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

---

## Step 8: Category & Product Listing Pages

### 8.1 Category Page (with Server-Side Filtering)

Create `src/app/(frontend)/[category]/page.tsx`:

```typescript
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ProductGrid } from "@/components/product/ProductGrid";
import { FilterSidebar } from "@/components/filters/FilterSidebar";
import { MobileFilterSheet } from "@/components/filters/MobileFilterSheet";
import { JsonLdBreadcrumb } from "@/components/seo/JsonLdBreadcrumb";
import type { Metadata } from "next";

interface CategoryPageProps {
  params: { category: string };
  searchParams: {
    brand?: string;
    price?: string;
    rating?: string;
    in_stock?: string;
    warranty?: string;
    page?: string;
  };
}

// Build metadata for SEO
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = await prisma.category.findUnique({
    where: { slug: params.category },
  });
  if (!category) return { title: "Not Found" };

  return {
    title: category.seoTitle || `${category.name} - StoreName`,
    description: category.seoDescription || `Shop ${category.name} online. Cash on Delivery available across Pakistan.`,
    alternates: { canonical: `/${category.slug}` },
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const category = await prisma.category.findUnique({
    where: { slug: params.category },
    include: {
      children: true,
      filters: { where: { isActive: true }, orderBy: { sortOrder: "asc" } },
    },
  });

  if (!category) notFound();

  // ─── Build filter conditions from searchParams ───
  const page = parseInt(searchParams.page || "1");
  const perPage = 12;

  const where: any = {
    categoryId: category.id,
    status: "PUBLISHED",
  };

  // Brand filter
  if (searchParams.brand) {
    const brands = searchParams.brand.split(",");
    const brandRecords = await prisma.brand.findMany({
      where: { slug: { in: brands } },
      select: { id: true },
    });
    where.brandId = { in: brandRecords.map((b) => b.id) };
  }

  // Price range filter
  if (searchParams.price) {
    const [min, max] = searchParams.price.split("-").map(Number);
    if (min) where.price = { ...where.price, gte: min * 100 }; // Convert to paisa
    if (max) where.price = { ...where.price, lte: max * 100 };
  }

  // Rating filter
  if (searchParams.rating) {
    where.avgRating = { gte: parseInt(searchParams.rating) };
  }

  // In stock filter
  if (searchParams.in_stock === "true") {
    where.isInStock = true;
  }

  // Warranty filter
  if (searchParams.warranty) {
    where.warranty = { in: searchParams.warranty.split(",") };
  }

  // ─── Fetch products with pagination ───
  const [products, totalCount] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { brand: true, category: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.product.count({ where }),
  ]);

  const totalPages = Math.ceil(totalCount / perPage);

  // ─── Fetch all brands for this category (for filter sidebar) ───
  const brands = await prisma.brand.findMany({
    where: { products: { some: { categoryId: category.id, status: "PUBLISHED" } } },
    select: { id: true, name: true, slug: true },
  });

  return (
    <>
      <JsonLdBreadcrumb
        items={[
          { name: "Home", url: "/" },
          { name: category.name, url: `/${category.slug}` },
        ]}
      />

      <div className="container-custom py-8u">
        {/* Breadcrumb */}
        <nav className="font-body text-sm text-deep-slate/60 mb-6u">
          <a href="/" className="hover:text-terracotta">Home</a>
          <span className="mx-2u">/</span>
          <span className="text-charcoal">{category.name}</span>
        </nav>

        <div className="flex gap-6u">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block w-[280px] shrink-0">
            <FilterSidebar
              brands={brands}
              filters={category.filters}
              searchParams={searchParams}
              categorySlug={category.slug}
            />
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <MobileFilterSheet
              brands={brands}
              filters={category.filters}
              searchParams={searchParams}
              categorySlug={category.slug}
            />
            <ProductGrid
              products={products}
              currentPage={page}
              totalPages={totalPages}
              categorySlug={category.slug}
              searchParams={searchParams}
            />
          </div>
        </div>
      </div>
    </>
  );
}
```

### 8.2 Product Grid Component

Create `src/components/product/ProductGrid.tsx`:

```typescript
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: any[];
  currentPage: number;
  totalPages: number;
  categorySlug: string;
  searchParams: Record<string, string | undefined>;
}

export function ProductGrid({
  products,
  currentPage,
  totalPages,
  categorySlug,
  searchParams,
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12u">
        <p className="font-body text-lg text-deep-slate/60">
          No products found matching your filters.
        </p>
        <a
          href={`/${categorySlug}`}
          className="btn-secondary mt-4u inline-block"
        >
          Clear Filters
        </a>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3u md:gap-4u">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2u mt-8u">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
            const params = new URLSearchParams();
            Object.entries(searchParams).forEach(([key, value]) => {
              if (value && key !== "page") params.set(key, value);
            });
            params.set("page", String(page));

            return (
              <a
                key={page}
                href={`/${categorySlug}?${params.toString()}`}
                className={`px-3u py-2u rounded-button font-body text-sm transition-colors ${
                  page === currentPage
                    ? "bg-terracotta text-white"
                    : "bg-ivory-cream text-deep-slate hover:bg-soft-clay"
                }`}
              >
                {page}
              </a>
            );
          })}
        </div>
      )}
    </>
  );
}
```

---

## Step 9: Product Detail Page

### 9.1 Product Detail Page Implementation

Create `src/app/(frontend)/[category]/[product]/page.tsx`:

```typescript
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductInfo } from "@/components/product/ProductInfo";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { JsonLdProduct } from "@/components/seo/JsonLdProduct";
import { JsonLdBreadcrumb } from "@/components/seo/JsonLdBreadcrumb";
import { TrustBadges } from "@/components/trust/TrustBadges";
import type { Metadata } from "next";

interface ProductPageProps {
  params: { category: string; product: string };
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await prisma.product.findUnique({
    where: { slug: params.product },
    include: { brand: true, category: true },
  });
  if (!product) return { title: "Not Found" };

  const title = product.seoTitle || `${product.brand?.name || ""} ${product.name} - StoreName`;
  const description = product.seoDescription ||
    `Shop ${product.name} at StoreName. ${product.warranty || "Quality guaranteed"}. Rs. ${(product.price / 100).toLocaleString("en-PK")} with Cash on Delivery.`;

  return {
    title,
    description,
    alternates: { canonical: `/${params.category}/${params.product}` },
    openGraph: {
      title,
      description,
      images: product.images?.[0]?.url ? [{ url: product.images[0].url }] : [],
      type: "website",
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await prisma.product.findUnique({
    where: { slug: params.product },
    include: {
      brand: true,
      category: { include: { parent: true } },
      tags: true,
      variants: true,
      reviews: { where: { isApproved: true }, orderBy: { createdAt: "desc" }, take: 10 },
    },
  });

  if (!product || product.status !== "PUBLISHED") notFound();

  // Fetch related products (same category, different product)
  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      status: "PUBLISHED",
      id: { not: product.id },
      isInStock: true,
    },
    take: 4,
    include: { brand: true, category: true },
  });

  return (
    <>
      <JsonLdProduct product={product} />
      <JsonLdBreadcrumb
        items={[
          { name: "Home", url: "/" },
          { name: product.category.name, url: `/${product.category.slug}` },
          { name: product.name, url: `/${product.category.slug}/${product.slug}` },
        ]}
      />

      <div className="container-custom py-8u">
        {/* Breadcrumb */}
        <nav className="font-body text-sm text-deep-slate/60 mb-6u">
          <a href="/" className="hover:text-terracotta">Home</a>
          <span className="mx-2u">/</span>
          <a href={`/${product.category.slug}`} className="hover:text-terracotta">{product.category.name}</a>
          <span className="mx-2u">/</span>
          <span className="text-charcoal">{product.name}</span>
        </nav>

        {/* Product Layout: 60/40 split on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8u">
          {/* Left: Gallery (60%) */}
          <div className="lg:col-span-3">
            <ProductGallery images={product.images} videoUrl={product.videoUrl} />
          </div>

          {/* Right: Product Info (40%) */}
          <div className="lg:col-span-2">
            <ProductInfo product={product} />
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-8u">
          <TrustBadges />
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <RelatedProducts products={relatedProducts} />
        )}
      </div>
    </>
  );
}
```

### 9.2 Product Gallery Component

Create `src/components/product/ProductGallery.tsx`:

```typescript
"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";

interface ProductGalleryProps {
  images: Array<{ url: string; alt?: string; blurUrl?: string }>;
  videoUrl?: string | null;
}

export function ProductGallery({ images, videoUrl }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showVideo, setShowVideo] = useState(false);

  return (
    <div className="flex flex-col-reverse md:flex-row gap-3u">
      {/* Thumbnail Strip (vertical on desktop, horizontal on mobile) */}
      <div className="flex md:flex-col gap-2u overflow-x-auto md:overflow-y-auto md:max-h-[600px]">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => { setSelectedIndex(i); setShowVideo(false); }}
            className={`shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-colors ${
              i === selectedIndex && !showVideo
                ? "border-terracotta"
                : "border-transparent hover:border-soft-clay"
            }`}
          >
            <Image src={img.url} alt={img.alt || ""} width={80} height={80} className="object-cover w-full h-full" />
          </button>
        ))}
        {videoUrl && (
          <button
            onClick={() => setShowVideo(true)}
            className={`shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 flex items-center justify-center bg-charcoal/10 transition-colors ${
              showVideo ? "border-terracotta" : "border-transparent hover:border-soft-clay"
            }`}
          >
            <Play className="w-5 h-5 text-charcoal/50" />
          </button>
        )}
      </div>

      {/* Main Image / Video */}
      <div className="flex-1 relative aspect-square rounded-card overflow-hidden bg-ivory-cream">
        {showVideo && videoUrl ? (
          <video
            src={videoUrl}
            controls
            autoPlay
            className="w-full h-full object-cover"
            poster={images[0]?.url}
          />
        ) : images[selectedIndex] ? (
          <Image
            src={images[selectedIndex].url}
            alt={images[selectedIndex].alt || "Product image"}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 60vw"
            priority={selectedIndex === 0}
            placeholder="blur"
            blurDataURL={images[selectedIndex].blurUrl}
          />
        ) : null}
      </div>
    </div>
  );
}
```

### 9.3 Product Info Component (with WhatsApp CTA)

Create `src/components/product/ProductInfo.tsx`:

```typescript
"use client";

import { formatPKRDirect, buildWhatsAppURL } from "@/lib/utils";
import { WhatsAppButton } from "@/components/whatsapp/WhatsAppButton";
import { WarrantyBadge } from "@/components/trust/WarrantyBadge";
import { Badge } from "@/components/ui/badge";
import { Truck, RotateCcw, Shield, Check } from "lucide-react";

interface ProductInfoProps {
  product: any;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const priceInRupees = product.price / 100; // Convert from paisa
  const comparePrice = product.compareAtPrice ? product.compareAtPrice / 100 : null;
  const hasDiscount = comparePrice && comparePrice > priceInRupees;
  const whatsappURL = buildWhatsAppURL(
    product.name,
    formatPKRDirect(priceInRupees),
    `${process.env.NEXT_PUBLIC_SITE_URL}/${product.category.slug}/${product.slug}`,
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER!
  );

  return (
    <div className="space-y-6u">
      {/* Brand */}
      {product.brand && (
        <p className="font-body text-sm text-terracotta font-medium">{product.brand.name}</p>
      )}

      {/* Product Name */}
      <h1 className="font-display text-2u md:text-3u font-semibold text-charcoal leading-tight">
        {product.name}
      </h1>

      {/* Price */}
      <div className="flex items-baseline gap-3u">
        <span className="font-price text-3u md:text-4u font-semibold text-charcoal">
          {formatPKRDirect(priceInRupees)}
        </span>
        {hasDiscount && (
          <>
            <span className="font-body text-lg text-deep-slate/40 line-through">
              {formatPKRDirect(comparePrice)}
            </span>
            <Badge className="bg-error-red text-white text-xs">Sale</Badge>
          </>
        )}
      </div>

      {/* Warranty Badge */}
      {product.warranty && (
        <WarrantyBadge type={product.warranty} period={product.warrantyPeriod} />
      )}

      {/* Short Description */}
      {product.shortDescription && (
        <p className="font-body text-deep-slate leading-relaxed">
          {product.shortDescription}
        </p>
      )}

      {/* Stock Status */}
      <div className="flex items-center gap-2u">
        {product.isInStock ? (
          <>
            <Check className="w-4 h-4 text-sage-green" />
            <span className="font-body text-sm font-medium text-sage-green">In Stock</span>
          </>
        ) : (
          <span className="font-body text-sm font-medium text-error-red">Out of Stock</span>
        )}
      </div>

      {/* Primary CTA: Order via WhatsApp */}
      <div className="space-y-3u">
        {product.isInStock ? (
          <WhatsAppButton
            href={whatsappURL}
            className="btn-primary w-full text-center py-4u text-base"
          />
        ) : (
          <button className="w-full py-4u rounded-button bg-deep-slate/10 font-body text-base font-semibold text-deep-slate/40 cursor-not-allowed">
            Out of Stock
          </button>
        )}
      </div>

      {/* Trust Indicators */}
      <div className="grid grid-cols-3 gap-3u py-4u border-y border-soft-clay/30">
        <div className="text-center">
          <Truck className="w-5 h-5 mx-auto text-sage-green mb-1u" />
          <p className="font-body text-xs text-deep-slate">Free Delivery</p>
        </div>
        <div className="text-center">
          <RotateCcw className="w-5 h-5 mx-auto text-sage-green mb-1u" />
          <p className="font-body text-xs text-deep-slate">7-Day Returns</p>
        </div>
        <div className="text-center">
          <Shield className="w-5 h-5 mx-auto text-sage-green mb-1u" />
          <p className="font-body text-xs text-deep-slate">COD Available</p>
        </div>
      </div>

      {/* Highlights */}
      {product.highlights?.length > 0 && (
        <div>
          <h3 className="font-body text-sm font-semibold text-charcoal mb-3u">Key Features</h3>
          <ul className="space-y-2u">
            {product.highlights.map((h: any, i: number) => (
              <li key={i} className="flex items-start gap-2u">
                <span className="w-1.5 h-1.5 rounded-full bg-terracotta mt-1.5 shrink-0" />
                <span className="font-body text-sm text-deep-slate">{h.point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Specifications Table */}
      {product.specifications && Object.keys(product.specifications).length > 0 && (
        <div>
          <h3 className="font-body text-sm font-semibold text-charcoal mb-3u">Specifications</h3>
          <div className="divide-y divide-soft-clay/30">
            {Object.entries(product.specifications).map(([key, value]) => (
              <div key={key} className="flex py-2u">
                <span className="font-body text-sm text-deep-slate/60 w-1/3">{key}</span>
                <span className="font-body text-sm text-charcoal font-medium w-2/3">{String(value)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tags */}
      {product.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2u">
          {product.tags.map((tag: any) => (
            <span
              key={tag.id}
              className="px-3u py-1u rounded-full bg-soft-clay/30 font-body text-xs text-deep-slate"
            >
              {tag.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## Step 10: Search & Faceted Filtering System

### 10.1 Search Bar Component

Create `src/components/search/SearchBar.tsx`:

```typescript
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  onClose?: () => void;
}

export function SearchBar({ onClose }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Debounced search suggestions
  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=5`);
        const data = await res.json();
        setSuggestions(data.products || []);
      } catch {
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      onClose?.();
    }
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="flex items-center gap-3u">
        <Search className="w-5 h-5 text-deep-slate/40 shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products, brands, categories..."
          className="flex-1 bg-transparent font-body text-base text-charcoal placeholder:text-deep-slate/40 focus:outline-none"
        />
        {query && (
          <button type="button" onClick={() => setQuery("")} className="p-1u">
            <X className="w-4 h-4 text-deep-slate/40" />
          </button>
        )}
      </form>

      {/* Search Suggestions Dropdown */}
      {suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2u bg-white rounded-card shadow-card-hover border border-soft-clay/30 z-50 overflow-hidden">
          {suggestions.map((product) => (
            <a
              key={product.id}
              href={`/${product.categorySlug}/${product.slug}`}
              className="flex items-center gap-3u px-4u py-3u hover:bg-ivory-cream transition-colors"
              onClick={() => onClose?.()}
            >
              <div className="w-10 h-10 rounded-lg bg-warm-sand overflow-hidden shrink-0">
                {product.image && (
                  <img src={product.image} alt="" className="w-full h-full object-cover" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-body text-sm font-medium text-charcoal truncate">{product.name}</p>
                <p className="font-body text-xs text-deep-slate/60">Rs. {product.price.toLocaleString()}</p>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
```

### 10.2 Search API Endpoint

Create `src/app/api/search/route.ts`:

```typescript
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q") || "";
  const limit = parseInt(searchParams.get("limit") || "20");

  if (query.length < 2) {
    return NextResponse.json({ products: [], total: 0 });
  }

  // Search in product name, description, and brand
  const products = await prisma.product.findMany({
    where: {
      status: "PUBLISHED",
      OR: [
        { name: { search: query, mode: "insensitive" } },
        { description: { search: query, mode: "insensitive" } },
        { brand: { name: { search: query, mode: "insensitive" } } },
        { tags: { some: { name: { search: query, mode: "insensitive" } } } },
      ],
    },
    select: {
      id: true,
      name: true,
      slug: true,
      price: true,
      images: true,
      category: { select: { slug: true } },
    },
    take: limit,
  });

  const formatted = products.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price / 100,
    image: p.images?.[0]?.url || null,
    categorySlug: p.category.slug,
  }));

  return NextResponse.json({ products: formatted, total: formatted.length });
}
```

### 10.3 Filter Sidebar Component

Create `src/components/filters/FilterSidebar.tsx`:

```typescript
"use client";

import { useState } from "react";
import { ChevronDown, X } from "lucide-react";
import { PriceSlider } from "./PriceSlider";
import { FilterChip } from "./FilterChip";

interface FilterSidebarProps {
  brands: Array<{ id: string; name: string; slug: string }>;
  filters: Array<{
    name: string;
    slug: string;
    type: string;
    options: any;
  }>;
  searchParams: Record<string, string | undefined>;
  categorySlug: string;
}

export function FilterSidebar({ brands, filters, searchParams, categorySlug }: FilterSidebarProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    price: true,
    brand: true,
    rating: true,
    availability: true,
    warranty: true,
  });

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Build active filter chips
  const activeFilters: Array<{ key: string; value: string; label: string }> = [];
  if (searchParams.brand) {
    searchParams.brand.split(",").forEach((b) => {
      const brand = brands.find((br) => br.slug === b);
      if (brand) activeFilters.push({ key: "brand", value: b, label: brand.name });
    });
  }
  if (searchParams.price) activeFilters.push({ key: "price", value: searchParams.price, label: `PKR ${searchParams.price.replace("-", " - ")}` });
  if (searchParams.rating) activeFilters.push({ key: "rating", value: searchParams.rating, label: `${searchParams.rating}+ Stars` });
  if (searchParams.in_stock === "true") activeFilters.push({ key: "in_stock", value: "true", label: "In Stock Only" });

  const removeFilter = (key: string, value?: string) => {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([k, v]) => {
      if (v && k !== key) params.set(k, v);
      if (v && k === key && value) {
        const remaining = v.split(",").filter((item) => item !== value);
        if (remaining.length > 0) params.set(k, remaining.join(","));
      }
    });
    window.location.href = `/${categorySlug}?${params.toString()}`;
  };

  const clearAll = () => {
    window.location.href = `/${categorySlug}`;
  };

  return (
    <div className="space-y-4u">
      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2u">
            <span className="font-body text-xs font-semibold text-deep-slate uppercase tracking-wider">
              Active Filters
            </span>
            <button onClick={clearAll} className="font-body text-xs text-terracotta hover:text-terracotta-hover">
              Clear All
            </button>
          </div>
          <div className="flex flex-wrap gap-2u">
            {activeFilters.map((f) => (
              <FilterChip
                key={`${f.key}-${f.value}`}
                label={f.label}
                onRemove={() => removeFilter(f.key, f.value)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Price Range */}
      <FilterSection title="Price" expanded={expandedSections.price} onToggle={() => toggleSection("price")}>
        <PriceSlider
          min={0}
          max={500000}
          step={5000}
          value={searchParams.price || ""}
          categorySlug={categorySlug}
          searchParams={searchParams}
        />
      </FilterSection>

      {/* Brand */}
      {brands.length > 0 && (
        <FilterSection title="Brand" expanded={expandedSections.brand} onToggle={() => toggleSection("brand")}>
          <div className="space-y-2u">
            {brands.map((brand) => (
              <label key={brand.id} className="flex items-center gap-2u cursor-pointer group">
                <input
                  type="checkbox"
                  checked={searchParams.brand?.includes(brand.slug) || false}
                  onChange={() => {
                    const current = searchParams.brand?.split(",").filter(Boolean) || [];
                    const newBrands = current.includes(brand.slug)
                      ? current.filter((b) => b !== brand.slug)
                      : [...current, brand.slug];
                    const params = new URLSearchParams(searchParams as any);
                    if (newBrands.length > 0) params.set("brand", newBrands.join(","));
                    else params.delete("brand");
                    window.location.href = `/${categorySlug}?${params.toString()}`;
                  }}
                  className="w-4 h-4 rounded border-soft-clay text-terracotta focus:ring-terracotta"
                />
                <span className="font-body text-sm text-deep-slate group-hover:text-charcoal">{brand.name}</span>
              </label>
            ))}
          </div>
        </FilterSection>
      )}

      {/* Rating */}
      <FilterSection title="Rating" expanded={expandedSections.rating} onToggle={() => toggleSection("rating")}>
        <div className="space-y-2u">
          {["4", "3", "2"].map((rating) => (
            <label key={rating} className="flex items-center gap-2u cursor-pointer group">
              <input
                type="radio"
                name="rating"
                checked={searchParams.rating === rating}
                onChange={() => {
                  const params = new URLSearchParams(searchParams as any);
                  params.set("rating", rating);
                  window.location.href = `/${categorySlug}?${params.toString()}`;
                }}
                className="w-4 h-4 border-soft-clay text-terracotta focus:ring-terracotta"
              />
              <span className="font-body text-sm text-deep-slate">{rating}+ Stars</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Availability */}
      <FilterSection title="Availability" expanded={expandedSections.availability} onToggle={() => toggleSection("availability")}>
        <label className="flex items-center gap-3u cursor-pointer">
          <input
            type="checkbox"
            checked={searchParams.in_stock === "true"}
            onChange={() => {
              const params = new URLSearchParams(searchParams as any);
              if (searchParams.in_stock === "true") params.delete("in_stock");
              else params.set("in_stock", "true");
              window.location.href = `/${categorySlug}?${params.toString()}`;
            }}
            className="w-4 h-4 rounded border-soft-clay text-terracotta focus:ring-terracotta"
          />
          <span className="font-body text-sm text-deep-slate">In Stock Only</span>
        </label>
      </FilterSection>

      {/* Dynamic Category-Specific Filters */}
      {filters.map((filter) => (
        <FilterSection key={filter.slug} title={filter.name} expanded={true} onToggle={() => {}}>
          {filter.type === "CHECKBOX" && Array.isArray(filter.options) && (
            <div className="space-y-2u">
              {filter.options.map((opt: string) => (
                <label key={opt} className="flex items-center gap-2u cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-soft-clay text-terracotta focus:ring-terracotta"
                  />
                  <span className="font-body text-sm text-deep-slate">{opt}</span>
                </label>
              ))}
            </div>
          )}
        </FilterSection>
      ))}
    </div>
  );
}

// Reusable collapsible filter section
function FilterSection({
  title,
  expanded,
  onToggle,
  children,
}: {
  title: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-soft-clay/30 pb-4u">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full py-2u"
      >
        <span className="font-body text-xs font-semibold text-deep-slate uppercase tracking-wider">
          {title}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-deep-slate/40 transition-transform ${expanded ? "rotate-180" : ""}`}
        />
      </button>
      {expanded && <div className="mt-2u">{children}</div>}
    </div>
  );
}
```

---

## Step 11: WhatsApp Integration

### 11.1 WhatsApp URL Builder

Create `src/lib/whatsapp.ts`:

```typescript
/**
 * Build a WhatsApp wa.me deep link with a pre-filled message.
 *
 * Phase 1 (MVP): Uses simple wa.me links — $0 cost, instant setup.
 * Phase 2 (Growth): Upgrade to WhatsApp Business API via Chatwoot.
 */

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "92XXXXXXXXXX";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://your-store.vercel.app";

interface WhatsAppMessageParams {
  productName: string;
  productPrice: string;
  productSlug: string;
  categorySlug: string;
}

/**
 * Generate WhatsApp URL for product purchase inquiry
 */
export function getProductWhatsAppURL(params: WhatsAppMessageParams): string {
  const productURL = `${SITE_URL}/${params.categorySlug}/${params.productSlug}`;
  const message = `Hi! I'm interested in ${params.productName} (${params.productPrice}). Is it available?\n\n${productURL}`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/**
 * Generate WhatsApp URL for general inquiry
 */
export function getGeneralWhatsAppURL(): string {
  const message = "Hi! I have a question about your products.";
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
```

### 11.2 WhatsApp Button Component

Create `src/components/whatsapp/WhatsAppButton.tsx`:

```typescript
"use client";

import { MessageCircle } from "lucide-react";

interface WhatsAppButtonProps {
  href: string;
  className?: string;
}

export function WhatsAppButton({ href, className }: WhatsAppButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className || "btn-primary"}
    >
      <MessageCircle className="w-5 h-5" />
      Order via WhatsApp
    </a>
  );
}
```

### 11.3 Floating WhatsApp Icon

Create `src/components/whatsapp/FloatingWhatsApp.tsx`:

```typescript
"use client";

import { MessageCircle } from "lucide-react";
import { getGeneralWhatsAppURL } from "@/lib/whatsapp";

export function FloatingWhatsApp() {
  const whatsappURL = getGeneralWhatsAppURL();

  return (
    <a
      href={whatsappURL}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6u right-6u z-40 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-6 h-6" />
    </a>
  );
}
```

---

## Step 12: SEO Implementation

### 12.1 JSON-LD Structured Data

Create `src/components/seo/JsonLdProduct.tsx`:

```typescript
interface JsonLdProductProps {
  product: {
    name: string;
    slug: string;
    description?: string;
    price: number;
    compareAtPrice?: number;
    images: any[];
    brand?: { name: string } | null;
    isInStock: boolean;
    avgRating: number;
    reviewCount: number;
    warranty?: string | null;
    category: { slug: string };
  };
}

export function JsonLdProduct({ product }: JsonLdProductProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const priceInRupees = product.price / 100;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images?.map((img: any) => img.url) || [],
    description: product.description || product.name,
    brand: product.brand
      ? { "@type": "Brand", name: product.brand.name }
      : undefined,
    sku: product.slug,
    offers: {
      "@type": "Offer",
      url: `${siteUrl}/${product.category.slug}/${product.slug}`,
      priceCurrency: "PKR",
      price: priceInRupees.toString(),
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      availability: product.isInStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
    ...(product.avgRating > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: product.avgRating.toString(),
        reviewCount: product.reviewCount.toString(),
      },
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

Create `src/components/seo/JsonLdBreadcrumb.tsx`:

```typescript
interface BreadcrumbItem {
  name: string;
  url: string;
}

export function JsonLdBreadcrumb({ items }: { items: BreadcrumbItem[] }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${siteUrl}${item.url}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

### 12.2 Sitemap Generation

Create `next-sitemap.config.js` at the project root:

```javascript
/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "https://your-store.vercel.app",
  generateRobotsTxt: true,
  sitemapSize: 5000,
  changefreq: "daily",
  priority: 0.7,
  exclude: ["/admin/*", "/api/*"],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/search?", "/*?brand=", "/*?price=", "/*?rating=", "/*?sort="],
      },
    ],
  },
  additionalPaths: async (config) => {
    const paths = [];
    // Add dynamic product and category pages
    // Fetch from database and generate paths
    return paths;
  },
};
```

### 12.3 Canonical Tags for Filtered Pages

Add this to your category page metadata:

```typescript
// In the category page's generateMetadata function:
export async function generateMetadata({ params, searchParams }: CategoryPageProps): Promise<Metadata> {
  const category = await prisma.category.findUnique({ where: { slug: params.category } });
  if (!category) return { title: "Not Found" };

  // Check if filters are applied — if so, add noindex for deep filters
  const hasDeepFilters = Object.keys(searchParams).length >= 3;

  return {
    title: category.seoTitle || `${category.name} - StoreName`,
    description: category.seoDescription || `Shop ${category.name} online.`,
    alternates: {
      // Always canonical to the unfiltered category page
      canonical: `/${category.slug}`,
    },
    // Prevent index bloat from filter combinations
    ...(hasDeepFilters && {
      robots: { index: false, follow: true },
    }),
  };
}
```

---

## Step 13: Analytics & Tracking

### 13.1 GA4 Setup

Create `src/lib/analytics.ts`:

```typescript
/**
 * Google Analytics 4 event tracking helpers
 * These fire client-side events for e-commerce tracking
 */

// Track WhatsApp button click
export function trackWhatsAppClick(productName: string, productPrice: number) {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", "contact", {
      method: "WhatsApp",
      item_name: productName,
      value: productPrice,
      currency: "PKR",
    });
  }
}

// Track product view
export function trackProductView(product: { id: string; name: string; price: number; category: string; brand?: string }) {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", "view_item", {
      currency: "PKR",
      value: product.price,
      items: [{
        item_id: product.id,
        item_name: product.name,
        item_category: product.category,
        item_brand: product.brand,
        price: product.price,
      }],
    });
  }
}

// Track search
export function trackSearch(query: string) {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", "search", { search_term: query });
  }
}
```

### 13.2 GA4 Script in Layout

Add the GA4 script to `src/app/layout.tsx`:

```typescript
import Script from "next/script";

// Inside the <head> of your layout:
<Script
  src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
  strategy="afterInteractive"
/>
<Script id="ga4-init" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}', {
      page_path: window.location.pathname,
    });
  `}
</Script>
```

### 13.3 Meta Pixel

Add the Meta Pixel script:

```typescript
<Script id="meta-pixel" strategy="afterInteractive">
  {`
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '${process.env.NEXT_PUBLIC_META_PIXEL_ID}');
    fbq('track', 'PageView');
  `}
</Script>
```

---

## Step 14: Performance Optimization

### 14.1 Next.js Image Configuration

Update `next.config.ts`:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "*.r2.dev",
      },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  experimental: {
    optimizeCss: true,
  },
};

export default nextConfig;
```

### 14.2 ISR for Product Pages

In your product detail page, add ISR revalidation:

```typescript
// At the top of the product page component:
export const revalidate = 60; // Revalidate every 60 seconds

// This enables Incremental Static Regeneration:
// - Pages are pre-rendered at build time
// - Stale pages are served while regenerating in the background
// - Fresh pages are served after revalidation completes
// - Perfect for products with changing prices/stock
```

### 14.3 Service Worker for Offline Support (Phase 2)

```bash
# Install next-pwa for offline capability
bun add next-pwa
```

This is critical for Pakistani users who experience frequent connectivity drops. The service worker caches key pages and product images so users can browse even when offline.

---

## Step 15: Deployment & Hosting

### 15.1 Vercel Deployment (Recommended for MVP)

```bash
# Install Vercel CLI
bun add -g vercel

# Login to Vercel
vercel login

# Deploy to Vercel (first deployment)
vercel

# Set environment variables in Vercel dashboard:
# Go to Project Settings → Environment Variables
# Add ALL variables from your .env.local file

# Redeploy with environment variables
vercel --prod
```

### 15.2 Alternative: Cloudflare Pages Deployment

If Vercel's 100GB bandwidth limit becomes restrictive, migrate to Cloudflare Pages:

```bash
# Install Wrangler CLI
bun add -g wrangler

# Login to Cloudflare
wrangler login

# Build the project
bun run build

# Deploy to Cloudflare Pages
wrangler pages deploy .vercel/output/static --project-name=ecommerce-store
```

### 15.3 Neon Database Setup

1. Go to https://console.neon.tech
2. Create a new project
3. Copy the connection string
4. Set `DATABASE_URL` in your Vercel environment variables
5. Run migrations: `bunx prisma db push`

### 15.4 Cloudflare CDN Setup

1. Go to https://dash.cloudflare.com
2. Add your domain (or use Vercel's .vercel.app subdomain)
3. Update nameservers at your domain registrar
4. Enable these free features: SSL/TLS (Full), Auto Minify, Brotli, HTTP/3, DDoS protection

### 15.5 Custom Domain Setup

1. Purchase domain (Namecheap for .com, PKNIC for .pk)
2. In Vercel: Project Settings → Domains → Add your domain
3. Update DNS records at your registrar:
   - CNAME record: `www` → `cname.vercel-dns.com`
   - A record: `@` → `76.76.21.21`
4. Wait for SSL certificate to auto-provision (usually 1-5 minutes)

---

## Step 16: Post-Launch Checklist

### 16.1 SEO Verification

- [ ] Submit sitemap to Google Search Console (`/sitemap.xml`)
- [ ] Submit sitemap to Bing Webmaster Tools
- [ ] Verify robots.txt is accessible (`/robots.txt`)
- [ ] Test Product schema with Google Rich Results Test
- [ ] Test BreadcrumbList schema
- [ ] Verify canonical tags on filtered pages
- [ ] Check noindex on deep filter combinations (3+ filters)
- [ ] Set geographic target to Pakistan in Google Search Console
- [ ] Create Google Business Profile with Pakistan location

### 16.2 Performance Verification

- [ ] Run Lighthouse audit (target: Performance 90+, SEO 95+, Accessibility 90+)
- [ ] Test on PageSpeed Insights with mobile throttling (1.6 Mbps / 150ms RTT)
- [ ] Verify LCP < 2.0s on 4G (test with WebPageTest from Mumbai/Pakistan)
- [ ] Verify CLS < 0.1 (no layout shifts from images/fonts)
- [ ] Verify INP < 200ms (test by clicking filter checkboxes)
- [ ] Check image formats: all images should be WebP or AVIF
- [ ] Verify font-display: swap is working (no invisible text during load)

### 16.3 Functionality Testing

- [ ] Admin can log in at /admin
- [ ] Admin can create, edit, delete a product
- [ ] Admin can upload product images and reorder them
- [ ] Admin can create categories and subcategories
- [ ] Admin can create and assign tags
- [ ] Admin can set featured products
- [ ] Product pages display correct PKR pricing
- [ ] WhatsApp button opens WhatsApp with pre-filled message
- [ ] Floating WhatsApp icon is visible on all pages
- [ ] Search returns relevant results
- [ ] Filters work correctly (brand, price, rating, availability)
- [ ] Filter URLs are shareable and SEO-safe
- [ ] Pagination works correctly
- [ ] Mobile layout is clean and usable
- [ ] Out-of-stock products show "Out of Stock" instead of WhatsApp button

### 16.4 Analytics Verification

- [ ] GA4 real-time report shows active users
- [ ] Product page views fire view_item event
- [ ] WhatsApp clicks fire contact event
- [ ] Search queries fire search event
- [ ] Meta Pixel PageView fires on all pages
- [ ] Meta Pixel ViewContent fires on product pages

### 16.5 Security Checklist

- [ ] HTTPS is enforced (redirect HTTP → HTTPS)
- [ ] Admin routes require authentication
- [ ] API routes validate input with Zod
- [ ] Image uploads are validated (type, size)
- [ ] Rate limiting on search API (prevent abuse)
- [ ] No sensitive data in client-side code
- [ ] Environment variables are set in Vercel, not in code
- [ ] CSP headers configured for Cloudinary/R2/WhatsApp domains

---

## Quick Reference: Color Palette

| Color | Hex | CSS Variable |
|-------|-----|-------------|
| Charcoal | `#1A1A2E` | `text-charcoal` |
| Warm Sand | `#F5F0EB` | `bg-warm-sand` |
| Terracotta | `#C1694F` | `text-terracotta`, `bg-terracotta` |
| Sage Green | `#7C9A82` | `text-sage-green` |
| Ivory Cream | `#FAF8F5` | `bg-ivory-cream` |
| Deep Slate | `#2D3436` | `text-deep-slate` |
| Muted Gold | `#C9A84C` | `text-muted-gold` |
| Soft Clay | `#D4B896` | `border-soft-clay` |
| Error Red | `#C0392B` | `text-error-red` |
| White | `#FFFFFF` | `bg-white` |

## Quick Reference: Font Stack

| Usage | Tailwind Class | Font Family |
|-------|---------------|-------------|
| Display | `font-display` | Clash Display, Playfair Display, serif |
| Body | `font-body` | Plus Jakarta Sans, DM Sans, sans-serif |
| Price | `font-price` | Space Grotesk, JetBrains Mono, monospace |

## Quick Reference: Free Tier Limits

| Service | Free Limit | What Happens When Exceeded |
|---------|-----------|--------------------------|
| Vercel | 100GB bandwidth/month | Site goes offline; upgrade to Pro ($20/mo) or migrate to Cloudflare Pages |
| Neon | 0.5GB storage, 100 compute hrs/month | Database pauses; upgrade to Pro ($19/mo) |
| Cloudinary | 25 credits/month, 2GB storage | Image transformations stop; upgrade to Plus ($89/mo) |
| Cloudflare R2 | 10GB storage, zero egress | Upload new videos fails; pay-as-you-go $0.015/GB |
| Cloudflare CDN | Unlimited bandwidth | No limit on free tier |

---

*This guide covers the complete end-to-end build of the e-commerce website as specified in the PRD. Follow the steps in order, and each step will produce a working increment that you can test and verify before moving on.*
