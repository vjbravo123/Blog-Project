import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Blog from "@/models/Blog";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await dbConnect();
    
    // FIX: Use 'stats.likes' because likes is inside the stats object
    const post = await Blog.findByIdAndUpdate(
      id, 
      { $inc: { "stats.likes": 1 } },
      { new: true } // Return updated doc
    );
    
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Return the updated count correctly
    return NextResponse.json({ likes: post.stats.likes });
  } catch (error) {
    console.error("Like increment error:", error);
    return NextResponse.json({ error: "Failed to like post" }, { status: 500 });
  }
}