import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.toLowerCase() || "";

    if (!q) {
      return NextResponse.json({ products: [], total: 0 });
    }

    const products = await db.product.findMany({
      where: {
        status: "PUBLISHED",
        OR: [
          { name: { contains: q } },
          { shortDescription: { contains: q } },
          { description: { contains: q } },
        ],
      },
      include: { category: true, brand: true, tags: { include: { tag: true } } },
      take: 50,
      orderBy: { createdAt: "desc" },
    });

    const formatted = products.map((p) => ({
      ...p,
      tags: p.tags.map((pt) => pt.tag),
    }));

    return NextResponse.json({ products: formatted, total: formatted.length });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
