import { NextResponse } from "next/server";
import dbConnect from "@/lib/db"; // Ensure this matches your file path (e.g., lib/db.ts or lib/dbConnect.ts)
import Blog from "@/models/Blog";
import mongoose from "mongoose";
import { uploadBase64ToS3 } from "@/lib/s3";
import { BlogService } from "@/services/blog.services";

// --- GET: Fetch a single post by ID ---
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 1. Validate ObjectId to prevent crashing on malformed IDs
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid Post ID format" },
        { status: 400 }
      );
    }

    // 2. Connect to DB
    await dbConnect();

    // 3. Fetch Document
    const post = await Blog.findById(id);

    if (!post) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    // 4. Return Data
    // We explicitly map the structure to ensure the frontend gets what it expects
    // Specifically unwrapping the coverImage object to a string URL if needed by frontend,
    // or sending the whole object.
    return NextResponse.json({
      ...post.toJSON(),
      // Flatten coverImage for the simple editor if needed, or keep as object
      // The frontend expects `coverImage` to be a URL string in the State
      coverImage: post.coverImage?.url || "", 
    });

  } catch (error) {
    console.error("API GET Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// --- PUT: Update a post ---
export async function PUT(
  req: Request, 
  { params }: { params: Promise<{ id: string }> } // Updated for Next.js 15+ (params is a promise)
) {
  try {
    const { id } = await params;
    const body = await req.json();

    // 1. Basic Validation
    if (!body.title || !body.content) {
      return NextResponse.json(
        { error: "Title and Content are required." },
        { status: 400 }
      );
    }

    await dbConnect();

    // 2. --- S3 UPLOAD LOGIC (COPIED FROM YOUR POST REQUEST) ---
    let finalImageUrl = "";
    
    // Check if body.coverImage is provided
    if (body.coverImage) {
      // If it's a Base64 string (New Upload)
      if (body.coverImage.startsWith("data:image")) {
        try {
          console.log(">> Starting S3 Upload for Update...");
          finalImageUrl = await uploadBase64ToS3(body.coverImage);
          console.log(">> S3 Upload Success. URL:", finalImageUrl);
        } catch (uploadError) {
          console.error(">> S3 Upload Failed:", uploadError);
          // If upload fails, we might want to keep the old image or set to empty. 
          // For now, setting to empty string to avoid saving massive base64 to DB.
          finalImageUrl = ""; 
        }
      } else {
        // It's already a URL (e.g. user didn't change the image, or pasted a link)
        finalImageUrl = body.coverImage;
      }
    }

    // 3. Prepare Update Data
    // We match the Object Structure expected by the Model
    const updateData = {
      title: body.title,
      slug: body.slug || undefined,
      subtitle: body.subtitle || body.excerpt,
      content: body.content,
      category: body.category,
      tags: [body.category || "Technology"], // Auto-tagging based on category
      
      // Update the coverImage object
      coverImage: {
        url: finalImageUrl, 
        alt: body.title, // Keep alt updated with title
        credit: ""       
      },
      
      seo: {
        metaTitle: body.seo?.metaTitle || body.title,
        metaDescription: body.seo?.metaDescription || body.subtitle,
      },
      metadata: {
        blocks: body.metadata?.blocks || body.blocks || [], 
      },
      // Handle Publish Status changes
      published: body.published,
      // If publishing for the first time, you might want to set publishedAt here
    };

    // 4. Update Post using Service
    // Assuming BlogService has an updatePost method. 
    // If not, use: await Post.findByIdAndUpdate(id, updateData, { new: true });
    const updatedPost = await BlogService.updatePost(id, updateData);

    if (!updatedPost) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
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

    // 1. Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid Post ID" }, { status: 400 });
    }

    await dbConnect();

    // 2. Perform Delete Operation
    const deletedPost = await Blog.findByIdAndDelete(id);

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