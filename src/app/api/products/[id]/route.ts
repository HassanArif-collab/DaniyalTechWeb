import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const product = await db.product.findUnique({
      where: { id },
      include: { category: true, brand: true, tags: { include: { tag: true } } },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const formatted = {
      ...product,
      tags: product.tags.map((pt) => pt.tag),
    };

    return NextResponse.json(formatted);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updateData: any = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.slug !== undefined) updateData.slug = body.slug;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.shortDescription !== undefined) updateData.shortDescription = body.shortDescription;
    if (body.categoryId !== undefined) updateData.categoryId = body.categoryId;
    if (body.brandId !== undefined) updateData.brandId = body.brandId;
    if (body.price !== undefined) updateData.price = body.price;
    if (body.compareAtPrice !== undefined) updateData.compareAtPrice = body.compareAtPrice;
    if (body.totalStock !== undefined) {
      updateData.totalStock = body.totalStock;
      updateData.isInStock = body.totalStock > 0;
    }
    if (body.specifications !== undefined) updateData.specifications = JSON.stringify(body.specifications);
    if (body.images !== undefined) updateData.images = JSON.stringify(body.images);
    if (body.videoUrl !== undefined) updateData.videoUrl = body.videoUrl;
    if (body.warranty !== undefined) updateData.warranty = body.warranty;
    if (body.warrantyPeriod !== undefined) updateData.warrantyPeriod = body.warrantyPeriod;
    if (body.status !== undefined) {
      updateData.status = body.status;
      if (body.status === "PUBLISHED") updateData.publishedAt = new Date();
    }
    if (body.isFeatured !== undefined) updateData.isFeatured = body.isFeatured;
    if (body.seoTitle !== undefined) updateData.seoTitle = body.seoTitle;
    if (body.seoDescription !== undefined) updateData.seoDescription = body.seoDescription;

    const product = await db.product.update({ where: { id }, data: updateData });

    // Update tags if provided
    if (body.tagIds !== undefined) {
      await db.productTag.deleteMany({ where: { productId: id } });
      for (const tagId of body.tagIds) {
        await db.productTag.create({ data: { productId: id, tagId } });
      }
    }

    return NextResponse.json(product);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await db.productTag.deleteMany({ where: { productId: id } });
    await db.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
