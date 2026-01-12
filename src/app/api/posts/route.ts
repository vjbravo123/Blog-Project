import { NextResponse } from "next/server";
import { BlogService } from "@/services/blog.services"; 
import User from "@/models/Users"; 
import dbConnect from "@/lib/db";
import { uploadBase64ToS3 } from "@/lib/s3"; 

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. Basic Validation
    if (!body.title || !body.content) {
      return NextResponse.json(
        { error: "Title and Content are required." },
        { status: 400 }
      );
    }

    await dbConnect();

    // 2. Find Author (Fallback)
    let authorId = body.authorId;
    if (!authorId) {
      const defaultUser = await User.findOne({});
      if (defaultUser) authorId = defaultUser._id;
    }

    // 3. --- S3 UPLOAD LOGIC ---
    let finalImageUrl = "";
    
    // Check if body.coverImage is provided
    if (body.coverImage) {
      // If it's a Base64 string (New Upload)
      if (body.coverImage.startsWith("data:image")) {
        try {
          console.log(">> Starting S3 Upload...");
          finalImageUrl = await uploadBase64ToS3(body.coverImage);
          console.log(">> S3 Upload Success. URL:", finalImageUrl);
        } catch (uploadError) {
          console.error(">> S3 Upload Failed:", uploadError);
          // Don't fail the whole post, just leave image empty
          finalImageUrl = ""; 
        }
      } else {
        // It's already a URL (e.g. user pasted a link or kept existing image)
        finalImageUrl = body.coverImage;
      }
    }

    // 4. Prepare Data
    // CRITICAL FIX: Match the Model's expected Object structure
    const postData = {
      title: body.title,
      slug: body.slug || undefined,
      subtitle: body.subtitle || body.excerpt, // Handle both frontend naming conventions
      content: body.content,
      category: body.category || "Technology",
      tags: [body.category || "Technology"],
      
      // FIX HERE: Send an Object, not a String
      coverImage: {
        url: finalImageUrl, 
        alt: body.title, // Use title as default alt text
        credit: ""       // Default empty credit
      },
      
      seo: {
        metaTitle: body.seo?.metaTitle || body.title,
        metaDescription: body.seo?.metaDescription || body.subtitle,
      },
      metadata: {
        blocks: body.blocks || [], 
      },
      published: true,
      publishedAt: new Date(),
      author: authorId,
    };

    // 5. Create Post
    const newPost = await BlogService.createPost(postData);
    
    return NextResponse.json(
      { message: "Post created successfully", data: newPost },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("API Error:", error);
    
    // Check specifically for Model Validation Errors
    if (error.name === "ValidationError") {
       return NextResponse.json(
        { error: "Model Validation Failed", details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}