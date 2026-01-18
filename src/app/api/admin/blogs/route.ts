// File: app/api/admin/blogs/route.ts

import { NextRequest, NextResponse } from "next/server";
import { BlogService } from "@/services/blog.services";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Parse Query Params with defaults
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";

    // Fetch data using service
    const data = await BlogService.getPaginatedPosts(page, limit, search);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Admin Blogs API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch blogs", details: error.message },
      { status: 500 }
    );
  }
}