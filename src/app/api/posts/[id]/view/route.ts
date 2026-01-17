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
    
    // FIX: Use 'stats.views' because views is inside the stats object
    await Blog.findByIdAndUpdate(id, { $inc: { "stats.views": 1 } });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("View increment error:", error);
    return NextResponse.json({ error: "Failed to increment view" }, { status: 500 });
  }
}