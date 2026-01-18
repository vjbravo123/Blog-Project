// File: app/api/posts/[id]/like/route.ts

import { NextResponse } from "next/server";
import { BlogService } from "@/services/blog.services"; 

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 1. Call Service
    const updatedPost = await BlogService.likePost(id);
    
    // 2. Handle Not Found
    if (!updatedPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // 3. Return the updated count
    // Safe check using optional chaining in case 'stats' is missing
    return NextResponse.json({ 
      likes: updatedPost.stats?.likes || 0 
    });

  } catch (error) {
    console.error("Like increment error:", error);
    return NextResponse.json({ error: "Failed to like post" }, { status: 500 });
  }
}