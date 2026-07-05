import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Watch from "@/models/Watch";
import { getAdminSession } from "@/lib/auth";
import { generateUniqueSlug, serializeWatch, buildWatchLookupQuery } from "@/lib/watch-utils";
import { WATCH_CATEGORIES } from "@/types/watch";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();
    const { id } = await params;

    const watch = await Watch.findOne(buildWatchLookupQuery(id)).lean();

    if (!watch) {
      return NextResponse.json({ success: false, error: "Watch not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        ...watch,
        _id: String(watch._id),
        mainImageIndex: watch.mainImageIndex ?? 0,
        waterResistant: watch.waterResistant ?? false,
        createdAt: watch.createdAt?.toISOString?.() ?? watch.createdAt,
        updatedAt: watch.updatedAt?.toISOString?.() ?? watch.updatedAt,
      },
    });
  } catch (error) {
    console.error("GET /api/watches/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch watch" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;
    const body = await request.json();

    const existing = await Watch.findById(id);
    if (!existing) {
      return NextResponse.json({ success: false, error: "Watch not found" }, { status: 404 });
    }

    if (body.category && !WATCH_CATEGORIES.includes(body.category)) {
      return NextResponse.json(
        { success: false, error: "Invalid category" },
        { status: 400 }
      );
    }

    if (body.name && body.name !== existing.name) {
      body.slug = await generateUniqueSlug(body.name, id);
    }

    const updated = await Watch.findByIdAndUpdate(
      id,
      {
        ...(body.name && { name: body.name }),
        ...(body.slug && { slug: body.slug }),
        ...(body.description && { description: body.description }),
        ...(body.price !== undefined && { price: Number(body.price) }),
        ...(body.category && { category: body.category }),
        ...(body.brand && { brand: body.brand }),
        ...(body.images && { images: body.images }),
        ...(body.mainImageIndex !== undefined && { mainImageIndex: Number(body.mainImageIndex) }),
        ...(body.waterResistant !== undefined && { waterResistant: Boolean(body.waterResistant) }),
        ...(body.inStock !== undefined && { inStock: body.inStock }),
        ...(body.featured !== undefined && { featured: body.featured }),
      },
      { new: true, runValidators: true }
    );

    return NextResponse.json({ success: true, data: serializeWatch(updated!) });
  } catch (error) {
    console.error("PUT /api/watches/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update watch" },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;

    const deleted = await Watch.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: "Watch not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Watch deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/watches/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete watch" },
      { status: 500 }
    );
  }
}
