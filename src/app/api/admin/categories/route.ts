import { NextResponse } from "next/server";
import { BlogService } from "@/services/blog.services";

export async function GET() {
  try {
    const categories = await BlogService.getCategoriesWithStats();
    return NextResponse.json(categories);
  } catch (error: any) {
    console.error("Categories API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}