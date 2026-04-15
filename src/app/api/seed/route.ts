import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    // Create Categories
    const categories = await Promise.all([
      db.category.upsert({
        where: { slug: "mobile-phones" },
        update: {},
        create: { name: "Mobile Phones", slug: "mobile-phones", description: "Latest smartphones and mobile phones from top brands", image: "https://picsum.photos/seed/phones/400/300", sortOrder: 1, isActive: true },
      }),
      db.category.upsert({
        where: { slug: "audio" },
        update: {},
        create: { name: "Audio", slug: "audio", description: "AirPods, earbuds, headphones and speakers", image: "https://picsum.photos/seed/audio/400/300", sortOrder: 2, isActive: true },
      }),
      db.category.upsert({
        where: { slug: "chargers-power" },
        update: {},
        create: { name: "Chargers & Power", slug: "chargers-power", description: "Fast chargers, power banks and cables", image: "https://picsum.photos/seed/chargers/400/300", sortOrder: 3, isActive: true },
      }),
      db.category.upsert({
        where: { slug: "accessories" },
        update: {},
        create: { name: "Accessories", slug: "accessories", description: "Phone cases, screen protectors and more", image: "https://picsum.photos/seed/accessories/400/300", sortOrder: 4, isActive: true },
      }),
      db.category.upsert({
        where: { slug: "wearable-tech" },
        update: {},
        create: { name: "Wearable Tech", slug: "wearable-tech", description: "Smartwatches and fitness trackers", image: "https://picsum.photos/seed/wearables/400/300", sortOrder: 5, isActive: true },
      }),
    ]);

    // Create Brands
    const brands = await Promise.all([
      db.brand.upsert({ where: { slug: "samsung" }, update: {}, create: { name: "Samsung", slug: "samsung", description: "South Korean electronics giant", isActive: true } }),
      db.brand.upsert({ where: { slug: "apple" }, update: {}, create: { name: "Apple", slug: "apple", description: "Premium technology from Apple Inc.", isActive: true } }),
      db.brand.upsert({ where: { slug: "xiaomi" }, update: {}, create: { name: "Xiaomi", slug: "xiaomi", description: "Best value for money smartphones", isActive: true } }),
      db.brand.upsert({ where: { slug: "realme" }, update: {}, create: { name: "Realme", slug: "realme", description: "Youth-focused smartphone brand", isActive: true } }),
      db.brand.upsert({ where: { slug: "oneplus" }, update: {}, create: { name: "OnePlus", slug: "oneplus", description: "Flagship killer smartphones", isActive: true } }),
      db.brand.upsert({ where: { slug: "anker" }, update: {}, create: { name: "Anker", slug: "anker", description: "Premium charging and audio accessories", isActive: true } }),
      db.brand.upsert({ where: { slug: "jbl" }, update: {}, create: { name: "JBL", slug: "jbl", description: "Professional audio equipment", isActive: true } }),
      db.brand.upsert({ where: { slug: "baseus" }, update: {}, create: { name: "Baseus", slug: "baseus", description: "Affordable quality accessories", isActive: true } }),
    ]);

    // Create Tags
    const tags = await Promise.all([
      db.tag.upsert({ where: { slug: "new-arrival" }, update: {}, create: { name: "New Arrival", slug: "new-arrival" } }),
      db.tag.upsert({ where: { slug: "best-seller" }, update: {}, create: { name: "Best Seller", slug: "best-seller" } }),
      db.tag.upsert({ where: { slug: "pta-approved" }, update: {}, create: { name: "PTA Approved", slug: "pta-approved" } }),
      db.tag.upsert({ where: { slug: "sale" }, update: {}, create: { name: "Sale", slug: "sale" } }),
      db.tag.upsert({ where: { slug: "limited-stock" }, update: {}, create: { name: "Limited Stock", slug: "limited-stock" } }),
    ]);

    // Delete existing products to avoid duplicates
    await db.productTag.deleteMany({});
    await db.product.deleteMany({});

    // Create Products
    const productsData = [
      {
        name: "Samsung Galaxy S24 Ultra",
        slug: "samsung-galaxy-s24-ultra",
        shortDescription: "Flagship smartphone with AI features, 200MP camera, and S Pen",
        description: "The Samsung Galaxy S24 Ultra is the ultimate flagship phone with Galaxy AI, a stunning 6.8-inch Dynamic AMOLED display, 200MP main camera, and the iconic built-in S Pen. Titanium frame for premium durability.",
        price: 399999,
        compareAtPrice: 449999,
        categoryId: categories[0].id,
        brandId: brands[0].id,
        totalStock: 12,
        isInStock: true,
        avgRating: 4.8,
        reviewCount: 156,
        specifications: JSON.stringify({ Display: '6.8" Dynamic AMOLED 2X', Processor: "Snapdragon 8 Gen 3", RAM: "12GB", Storage: "256GB", Camera: "200MP + 50MP + 12MP + 10MP", Battery: "5000mAh", OS: "Android 14 + One UI 6.1" }),
        images: JSON.stringify([
          { url: "https://picsum.photos/seed/s24ultra1/800/800", alt: "Samsung Galaxy S24 Ultra Front" },
          { url: "https://picsum.photos/seed/s24ultra2/800/800", alt: "Samsung Galaxy S24 Ultra Back" },
          { url: "https://picsum.photos/seed/s24ultra3/800/800", alt: "Samsung Galaxy S24 Ultra Side" },
        ]),
        warranty: "brand",
        warrantyPeriod: "12 Months",
        status: "PUBLISHED",
        isFeatured: true,
        publishedAt: new Date(),
      },
      {
        name: "iPhone 15 Pro Max",
        slug: "iphone-15-pro-max",
        shortDescription: "Apple's most powerful iPhone with A17 Pro chip and titanium design",
        description: "The iPhone 15 Pro Max features the A17 Pro chip, a 48MP camera system with 5x optical zoom, titanium design, and USB-C. The most powerful iPhone ever made.",
        price: 549999,
        compareAtPrice: 599999,
        categoryId: categories[0].id,
        brandId: brands[1].id,
        totalStock: 8,
        isInStock: true,
        avgRating: 4.9,
        reviewCount: 234,
        specifications: JSON.stringify({ Display: '6.7" Super Retina XDR', Processor: "A17 Pro", RAM: "8GB", Storage: "256GB", Camera: "48MP + 12MP + 12MP", Battery: "4422mAh", OS: "iOS 17" }),
        images: JSON.stringify([
          { url: "https://picsum.photos/seed/iphone15pm1/800/800", alt: "iPhone 15 Pro Max Front" },
          { url: "https://picsum.photos/seed/iphone15pm2/800/800", alt: "iPhone 15 Pro Max Back" },
        ]),
        warranty: "brand",
        warrantyPeriod: "12 Months",
        status: "PUBLISHED",
        isFeatured: true,
        publishedAt: new Date(),
      },
      {
        name: "Xiaomi 14 Ultra",
        slug: "xiaomi-14-ultra",
        shortDescription: "Leica-powered camera beast with Snapdragon 8 Gen 3",
        description: "The Xiaomi 14 Ultra brings Leica Summilux optics to a smartphone. With a 1-inch main sensor, quad-camera Leica system, and Snapdragon 8 Gen 3 processor.",
        price: 279999,
        compareAtPrice: 299999,
        categoryId: categories[0].id,
        brandId: brands[2].id,
        totalStock: 15,
        isInStock: true,
        avgRating: 4.6,
        reviewCount: 89,
        specifications: JSON.stringify({ Display: '6.73" LTPO AMOLED', Processor: "Snapdragon 8 Gen 3", RAM: "16GB", Storage: "512GB", Camera: "50MP Leica Quad", Battery: "5300mAh", OS: "HyperOS" }),
        images: JSON.stringify([
          { url: "https://picsum.photos/seed/xiaomi14u1/800/800", alt: "Xiaomi 14 Ultra Front" },
          { url: "https://picsum.photos/seed/xiaomi14u2/800/800", alt: "Xiaomi 14 Ultra Back" },
        ]),
        warranty: "brand",
        warrantyPeriod: "12 Months",
        status: "PUBLISHED",
        isFeatured: true,
        publishedAt: new Date(),
      },
      {
        name: "Realme GT 5 Pro",
        slug: "realme-gt-5-pro",
        shortDescription: "Flagship killer with Snapdragon 8 Gen 3 at an incredible price",
        description: "The Realme GT 5 Pro delivers flagship performance with Snapdragon 8 Gen 3, 50MP Sony IMX890 camera, and 100W fast charging. Best value flagship in Pakistan.",
        price: 149999,
        compareAtPrice: 169999,
        categoryId: categories[0].id,
        brandId: brands[3].id,
        totalStock: 25,
        isInStock: true,
        avgRating: 4.5,
        reviewCount: 67,
        specifications: JSON.stringify({ Display: '6.78" AMOLED 144Hz', Processor: "Snapdragon 8 Gen 3", RAM: "12GB", Storage: "256GB", Camera: "50MP + 8MP + 2MP", Battery: "5400mAh", Charging: "100W SuperDart" }),
        images: JSON.stringify([
          { url: "https://picsum.photos/seed/realmegt5p1/800/800", alt: "Realme GT 5 Pro Front" },
          { url: "https://picsum.photos/seed/realmegt5p2/800/800", alt: "Realme GT 5 Pro Back" },
        ]),
        warranty: "brand",
        warrantyPeriod: "12 Months",
        status: "PUBLISHED",
        isFeatured: true,
        publishedAt: new Date(),
      },
      {
        name: "OnePlus 12",
        slug: "oneplus-12",
        shortDescription: "Smooth performance with Hasselblad camera and 100W charging",
        description: "OnePlus 12 with Hasselblad camera system, Snapdragon 8 Gen 3, and 100W SUPERVOOC charging. The smoothest Android experience.",
        price: 189999,
        compareAtPrice: 209999,
        categoryId: categories[0].id,
        brandId: brands[4].id,
        totalStock: 18,
        isInStock: true,
        avgRating: 4.7,
        reviewCount: 143,
        specifications: JSON.stringify({ Display: '6.82" LTPO AMOLED 120Hz', Processor: "Snapdragon 8 Gen 3", RAM: "12GB", Storage: "256GB", Camera: "50MP Hasselblad + 64MP + 48MP", Battery: "5400mAh", Charging: "100W SUPERVOOC" }),
        images: JSON.stringify([
          { url: "https://picsum.photos/seed/oneplus121/800/800", alt: "OnePlus 12 Front" },
          { url: "https://picsum.photos/seed/oneplus122/800/800", alt: "OnePlus 12 Back" },
        ]),
        warranty: "brand",
        warrantyPeriod: "12 Months",
        status: "PUBLISHED",
        isFeatured: false,
        publishedAt: new Date(),
      },
      // Audio Products
      {
        name: "Apple AirPods Pro 2nd Gen",
        slug: "apple-airpods-pro-2",
        shortDescription: "Active Noise Cancellation with Adaptive Transparency and USB-C",
        description: "Apple AirPods Pro 2nd Generation with USB-C, featuring the H2 chip for smarter noise cancellation, Adaptive Transparency, and Personalized Spatial Audio.",
        price: 54999,
        compareAtPrice: 62999,
        categoryId: categories[1].id,
        brandId: brands[1].id,
        totalStock: 30,
        isInStock: true,
        avgRating: 4.8,
        reviewCount: 312,
        specifications: JSON.stringify({ Chip: "Apple H2", ANC: "Active Noise Cancellation", Battery: "6 hours (30 with case)", Connectivity: "Bluetooth 5.3", Water_Resistance: "IPX4", Charging: "USB-C + MagSafe" }),
        images: JSON.stringify([
          { url: "https://picsum.photos/seed/airpodsp2/800/800", alt: "AirPods Pro 2" },
          { url: "https://picsum.photos/seed/airpodsp2b/800/800", alt: "AirPods Pro 2 Case" },
        ]),
        warranty: "brand",
        warrantyPeriod: "12 Months",
        status: "PUBLISHED",
        isFeatured: true,
        publishedAt: new Date(),
      },
      {
        name: "JBL Tune 230NC TWS",
        slug: "jbl-tune-230nc",
        shortDescription: "JBL Pure Bass Sound with Active Noise Cancellation",
        description: "Experience JBL Pure Bass Sound with the Tune 230NC. Features Active Noise Cancellation, 10-hour battery life, and comfortable fit for all-day listening.",
        price: 14999,
        compareAtPrice: 17999,
        categoryId: categories[1].id,
        brandId: brands[6].id,
        totalStock: 45,
        isInStock: true,
        avgRating: 4.4,
        reviewCount: 198,
        specifications: JSON.stringify({ Driver: "6mm", ANC: "Yes", Battery: "10 hours (40 with case)", Connectivity: "Bluetooth 5.3", Water_Resistance: "IPX4", Charging: "USB-C" }),
        images: JSON.stringify([
          { url: "https://picsum.photos/seed/jbl230nc/800/800", alt: "JBL Tune 230NC" },
        ]),
        warranty: "brand",
        warrantyPeriod: "12 Months",
        status: "PUBLISHED",
        isFeatured: false,
        publishedAt: new Date(),
      },
      {
        name: "Samsung Galaxy Buds2 Pro",
        slug: "samsung-galaxy-buds2-pro",
        shortDescription: "Hi-Fi 24bit audio with Intelligent ANC and 360 Audio",
        description: "Samsung Galaxy Buds2 Pro deliver studio-quality Hi-Fi sound with 24bit audio, Intelligent Active Noise Cancellation, and 360 Audio for immersive listening.",
        price: 29999,
        compareAtPrice: 34999,
        categoryId: categories[1].id,
        brandId: brands[0].id,
        totalStock: 20,
        isInStock: true,
        avgRating: 4.5,
        reviewCount: 87,
        specifications: JSON.stringify({ Driver: "10mm + 6.5mm dual", ANC: "Intelligent ANC", Battery: "5 hours (18 with case)", Connectivity: "Bluetooth 5.3", Water_Resistance: "IPX7", Audio: "24bit Hi-Fi" }),
        images: JSON.stringify([
          { url: "https://picsum.photos/seed/buds2pro/800/800", alt: "Galaxy Buds2 Pro" },
        ]),
        warranty: "brand",
        warrantyPeriod: "12 Months",
        status: "PUBLISHED",
        isFeatured: true,
        publishedAt: new Date(),
      },
      // Chargers & Power
      {
        name: "Anker 737 Power Bank 24000mAh",
        slug: "anker-737-power-bank",
        shortDescription: "140W output power bank with laptop charging capability",
        description: "The Anker 737 Power Bank features 24000mAh capacity, 140W maximum output, and can charge laptops. Smart digital display shows remaining capacity and charging speed.",
        price: 18999,
        compareAtPrice: 21999,
        categoryId: categories[2].id,
        brandId: brands[5].id,
        totalStock: 35,
        isInStock: true,
        avgRating: 4.7,
        reviewCount: 156,
        specifications: JSON.stringify({ Capacity: "24000mAh", Max_Output: "140W", Ports: "2x USB-C + 1x USB-A", Charging: "65W Input", Weight: "632g", Display: "Smart Digital Display" }),
        images: JSON.stringify([
          { url: "https://picsum.photos/seed/anker737/800/800", alt: "Anker 737 Power Bank" },
        ]),
        warranty: "brand",
        warrantyPeriod: "18 Months",
        status: "PUBLISHED",
        isFeatured: true,
        publishedAt: new Date(),
      },
      {
        name: "Baseus 65W GaN Fast Charger",
        slug: "baseus-65w-gan-charger",
        shortDescription: "Compact GaN charger with 65W output for phones and laptops",
        description: "The Baseus 65W GaN charger is compact, powerful, and compatible with almost all USB-C devices. Features 3 ports (2 USB-C + 1 USB-A) for simultaneous charging.",
        price: 4999,
        compareAtPrice: 6999,
        categoryId: categories[2].id,
        brandId: brands[7].id,
        totalStock: 60,
        isInStock: true,
        avgRating: 4.3,
        reviewCount: 234,
        specifications: JSON.stringify({ Max_Output: "65W", Technology: "GaN III", Ports: "2x USB-C + 1x USB-A", Input: "100-240V AC", Protocols: "PD 3.0, QC 4.0, PPS", Size: "Compact 56x56x30mm" }),
        images: JSON.stringify([
          { url: "https://picsum.photos/seed/baseus65w/800/800", alt: "Baseus 65W GaN Charger" },
        ]),
        warranty: "shop",
        warrantyPeriod: "6 Months",
        status: "PUBLISHED",
        isFeatured: false,
        publishedAt: new Date(),
      },
      // Accessories
      {
        name: "Samsung Galaxy Watch 6 Classic",
        slug: "samsung-galaxy-watch-6-classic",
        shortDescription: "Premium smartwatch with rotating bezel and advanced health tracking",
        description: "The Samsung Galaxy Watch 6 Classic features the iconic rotating bezel, advanced health monitoring including BIA body composition, heart rate, and SpO2 tracking.",
        price: 74999,
        compareAtPrice: 84999,
        categoryId: categories[4].id,
        brandId: brands[0].id,
        totalStock: 10,
        isInStock: true,
        avgRating: 4.6,
        reviewCount: 78,
        specifications: JSON.stringify({ Display: '1.47" Super AMOLED', Processor: "Exynos W930", Storage: "16GB", Battery: "425mAh", OS: "Wear OS 4", Health: "BIA, Heart Rate, SpO2, ECG" }),
        images: JSON.stringify([
          { url: "https://picsum.photos/seed/gw6c/800/800", alt: "Galaxy Watch 6 Classic" },
        ]),
        warranty: "brand",
        warrantyPeriod: "12 Months",
        status: "PUBLISHED",
        isFeatured: true,
        publishedAt: new Date(),
      },
      {
        name: "Anker Soundcore Life Q30",
        slug: "anker-soundcore-life-q30",
        shortDescription: "Hi-Res Audio headphones with adjustable ANC and 40hr battery",
        description: "Anker Soundcore Life Q30 delivers Hi-Res Audio with LDAC, customizable Active Noise Cancellation with 3 modes, and up to 40 hours of playback on a single charge.",
        price: 12999,
        compareAtPrice: 15999,
        categoryId: categories[1].id,
        brandId: brands[5].id,
        totalStock: 25,
        isInStock: true,
        avgRating: 4.5,
        reviewCount: 189,
        specifications: JSON.stringify({ Driver: "40mm", ANC: "3 Modes (Transport/Outdoor/Indoor)", Battery: "40 hours", Connectivity: "Bluetooth 5.0 + 3.5mm", Codec: "LDAC Hi-Res", Weight: "260g" }),
        images: JSON.stringify([
          { url: "https://picsum.photos/seed/q30/800/800", alt: "Soundcore Life Q30" },
        ]),
        warranty: "brand",
        warrantyPeriod: "18 Months",
        status: "PUBLISHED",
        isFeatured: false,
        publishedAt: new Date(),
      },
      {
        name: "Xiaomi Smart Band 8",
        slug: "xiaomi-smart-band-8",
        shortDescription: "Ultra-thin fitness tracker with 150+ sport modes and AMOLED display",
        description: "Xiaomi Smart Band 8 features a 1.62-inch AMOLED display, 150+ sport modes, SpO2 monitoring, and up to 16 days of battery life. Ultra-thin and lightweight design.",
        price: 7999,
        compareAtPrice: 9999,
        categoryId: categories[4].id,
        brandId: brands[2].id,
        totalStock: 40,
        isInStock: true,
        avgRating: 4.3,
        reviewCount: 245,
        specifications: JSON.stringify({ Display: '1.62" AMOLED', Battery: "16 days", Sports: "150+ modes", Health: "SpO2, Heart Rate, Sleep", Water_Resistance: "5ATM", Weight: "26.8g" }),
        images: JSON.stringify([
          { url: "https://picsum.photos/seed/miband8/800/800", alt: "Xiaomi Smart Band 8" },
        ]),
        warranty: "brand",
        warrantyPeriod: "6 Months",
        status: "PUBLISHED",
        isFeatured: false,
        publishedAt: new Date(),
      },
      {
        name: "Baseus 100W Charging Cable USB-C",
        slug: "baseus-100w-usb-c-cable",
        shortDescription: "100W fast charging USB-C cable with LED display",
        description: "Baseus 100W USB-C to USB-C charging cable with built-in LED power display. Supports PD 100W fast charging and 480Mbps data transfer. Nylon braided for durability.",
        price: 2499,
        compareAtPrice: 3499,
        categoryId: categories[2].id,
        brandId: brands[7].id,
        totalStock: 100,
        isInStock: true,
        avgRating: 4.2,
        reviewCount: 356,
        specifications: JSON.stringify({ Length: "2 meters", Max_Wattage: "100W PD", Data_Speed: "480Mbps", Material: "Nylon Braided", Connector: "USB-C to USB-C", Display: "LED Power Display" }),
        images: JSON.stringify([
          { url: "https://picsum.photos/seed/baseuscable/800/800", alt: "Baseus 100W Cable" },
        ]),
        warranty: "shop",
        warrantyPeriod: "3 Months",
        status: "PUBLISHED",
        isFeatured: false,
        publishedAt: new Date(),
      },
      {
        name: "Samsung 45W Travel Adapter",
        slug: "samsung-45w-travel-adapter",
        shortDescription: "Official Samsung 45W PD fast charger with USB-C cable",
        description: "Official Samsung 45W Power Delivery travel adapter. Comes with USB-C to USB-C cable. Compatible with all Samsung Galaxy flagships and other USB-C devices.",
        price: 6999,
        compareAtPrice: 8499,
        categoryId: categories[2].id,
        brandId: brands[0].id,
        totalStock: 30,
        isInStock: true,
        avgRating: 4.6,
        reviewCount: 123,
        specifications: JSON.stringify({ Max_Output: "45W PD", Port: "1x USB-C", Input: "100-240V AC", Cable: "USB-C to USB-C Included", Certification: "Samsung Official", Weight: "85g" }),
        images: JSON.stringify([
          { url: "https://picsum.photos/seed/sam45w/800/800", alt: "Samsung 45W Adapter" },
        ]),
        warranty: "brand",
        warrantyPeriod: "12 Months",
        status: "PUBLISHED",
        isFeatured: false,
        publishedAt: new Date(),
      },
      {
        name: "Apple Watch Series 9",
        slug: "apple-watch-series-9",
        shortDescription: "Smartwatch with S9 chip, Double Tap gesture, and brighter display",
        description: "Apple Watch Series 9 with the S9 SiP chip, revolutionary Double Tap gesture, brighter Always-On Retina display, and advanced health features including blood oxygen and ECG.",
        price: 119999,
        compareAtPrice: 134999,
        categoryId: categories[4].id,
        brandId: brands[1].id,
        totalStock: 6,
        isInStock: true,
        avgRating: 4.8,
        reviewCount: 95,
        specifications: JSON.stringify({ Display: "1.9\" LTPO OLED Always-On", Chip: "S9 SiP", Storage: "64GB", Battery: "18 hours", OS: "watchOS 10", Health: "ECG, SpO2, Temperature" }),
        images: JSON.stringify([
          { url: "https://picsum.photos/seed/aw9/800/800", alt: "Apple Watch Series 9" },
        ]),
        warranty: "brand",
        warrantyPeriod: "12 Months",
        status: "PUBLISHED",
        isFeatured: true,
        publishedAt: new Date(),
      },
    ];

    const createdProducts = [];
    for (const pData of productsData) {
      const product = await db.product.create({ data: pData as any });
      createdProducts.push(product);

      // Assign tags
      const tagIndices: number[] = [];
      if (pData.isFeatured) tagIndices.push(2); // PTA Approved
      if (pData.price < 10000) tagIndices.push(3); // Sale
      if (pData.totalStock <= 10) tagIndices.push(4); // Limited Stock

      // Add some variety
      if (pData.slug.includes("samsung-galaxy-s24") || pData.slug.includes("iphone")) {
        tagIndices.push(0); // New Arrival
        tagIndices.push(1); // Best Seller
      }

      for (const idx of tagIndices) {
        if (tags[idx]) {
          await db.productTag.create({
            data: { productId: product.id, tagId: tags[idx].id },
          }).catch(() => {});
        }
      }
    }

    // Create admin user
    await db.adminUser.upsert({
      where: { email: "admin@daniyaltech.pk" },
      update: {},
      create: { email: "admin@daniyaltech.pk", name: "Admin", password: "admin123" },
    });

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully",
      data: {
        categories: categories.length,
        brands: brands.length,
        tags: tags.length,
        products: createdProducts.length,
      },
    });
  } catch (error: any) {
    console.error("Seed error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
