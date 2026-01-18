// File: app/api/posts/[id]/view/route.ts

import { NextResponse } from "next/server";
import { BlogService } from "@/services/blog.services";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // 1. Call Service
    // We don't necessarily need the return value if just tracking generic hits,
    // but the service handles the DB connection and logic.
    await BlogService.incrementViews(id);
    
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("View increment error:", error);
    return NextResponse.json(
      { error: "Failed to increment view" }, 
      { status: 500 }
    );
  }
}