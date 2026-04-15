import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const brand = searchParams.get("brand");
    const featured = searchParams.get("featured");
    const sort = searchParams.get("sort") || "newest";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const inStock = searchParams.get("inStock");

    const where: any = { status: "PUBLISHED" };

    if (category) {
      const cat = await db.category.findFirst({ where: { slug: category } });
      if (cat) where.categoryId = cat.id;
    }

    if (brand) {
      const brands = brand.split(",");
      const brandRecords = await db.brand.findMany({ where: { id: { in: brands } } });
      if (brandRecords.length > 0) where.brandId = { in: brandRecords.map((b) => b.id) };
    }

    if (featured === "true") where.isFeatured = true;
    if (inStock === "true") where.isInStock = true;

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseInt(minPrice);
      if (maxPrice) where.price.lte = parseInt(maxPrice);
    }

    const orderBy: any = {};
    switch (sort) {
      case "price-asc": orderBy.price = "asc"; break;
      case "price-desc": orderBy.price = "desc"; break;
      case "rating": orderBy.avgRating = "desc"; break;
      case "newest":
      default: orderBy.createdAt = "desc"; break;
    }

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      db.product.findMany({
        where,
        include: { category: true, brand: true, tags: { include: { tag: true } } },
        orderBy,
        skip,
        take: limit,
      }),
      db.product.count({ where }),
    ]);

    const formatted = products.map((p) => ({
      ...p,
      tags: p.tags.map((pt) => pt.tag),
    }));

    return NextResponse.json({ products: formatted, total, page, limit, totalPages: Math.ceil(total / limit) });
  } catch (error: any) {
    console.error("Products API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const product = await db.product.create({
      data: {
        name: body.name,
        slug: body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
        description: body.description,
        shortDescription: body.shortDescription,
        categoryId: body.categoryId,
        brandId: body.brandId || null,
        price: body.price,
        compareAtPrice: body.compareAtPrice || null,
        totalStock: body.totalStock || 0,
        isInStock: (body.totalStock || 0) > 0,
        specifications: JSON.stringify(body.specifications || {}),
        images: JSON.stringify(body.images || []),
        videoUrl: body.videoUrl || null,
        warranty: body.warranty || null,
        warrantyPeriod: body.warrantyPeriod || null,
        status: body.status || "DRAFT",
        isFeatured: body.isFeatured || false,
        publishedAt: body.status === "PUBLISHED" ? new Date() : null,
        seoTitle: body.seoTitle || null,
        seoDescription: body.seoDescription || null,
      },
    });

    if (body.tagIds && Array.isArray(body.tagIds)) {
      for (const tagId of body.tagIds) {
        await db.productTag.create({ data: { productId: product.id, tagId } });
      }
    }

    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    console.error("Create product error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
