import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { BlogService } from "@/services/blog.services";

// --- GET: Fetch a single post by ID ---
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 1. Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid Post ID format" }, { status: 400 });
    }

    // 2. Call Service
    const post = await BlogService.getPostById(id);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // 3. Return Data (Formatting for Frontend)
    return NextResponse.json({
      ...post.toJSON(),
      // Flatten coverImage to string for the editor state
      coverImage: post.coverImage?.url || "", 
    });

  } catch (error) {
    console.error("API GET Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// --- PUT: Update a post ---
export async function PUT(
  req: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    // 1. Basic Validation
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid Post ID format" }, { status: 400 });
    }
    if (!body.title || !body.content) {
      return NextResponse.json({ error: "Title and Content are required." }, { status: 400 });
    }

    // 2. Call Service (Handles S3 upload + DB update)
    const updatedPost = await BlogService.updatePostWithUpload(id, body);

    if (!updatedPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Post updated successfully", data: updatedPost },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("API Update Error:", error);
    
    if (error.name === "ValidationError") {
       return NextResponse.json(
        { error: "Validation Failed", details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}

// --- DELETE: Delete a post ---
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 1. Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid Post ID" }, { status: 400 });
    }

    // 2. Call Service
    const deletedPost = await BlogService.deletePost(id);

    if (!deletedPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Post deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("API DELETE Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}