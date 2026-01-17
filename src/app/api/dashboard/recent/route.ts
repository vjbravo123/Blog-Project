import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Blog from "@/models/Blog";

export async function GET() {
  try {
    await dbConnect();

    // Fetch top 5 recent posts, sorted by 'updatedAt' descending
    const posts = await Blog.find({})
      .sort({ updatedAt: -1 }) 
      .limit(5)
      .select("title category stats published createdAt updatedAt coverImage slug") // Select specific fields
      .lean();

    const formattedPosts = posts.map((post: any) => ({
      id: post._id,
      title: post.title,
      category: post.category || "Uncategorized",
      views: post.stats.views || 0,
      status: post.published ? "Published" : "Draft",
      createdAt: post.createdAt,
      updatedAt: post.updatedAt, // Important for the "Last Updated" column
      image: post.coverImage?.url || post.coverImage || "", 
      slug: post.slug
    }));

    return NextResponse.json(formattedPosts);
  } catch (error) {
    console.error("Dashboard Recent Posts Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}