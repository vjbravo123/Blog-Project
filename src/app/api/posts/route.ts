import { NextResponse } from "next/server";
import { BlogService } from "@/services/blog.services"; 

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. Basic Validation (Controller Layer responsibility)
    if (!body.title || !body.content) {
      return NextResponse.json(
        { error: "Title and Content are required." },
        { status: 400 }
      );
    }

    // 2. Call Service to handle Logic, Uploads, and DB creation
    const newPost = await BlogService.createPostWithUpload(body);
    
    return NextResponse.json(
      { message: "Post created successfully", data: newPost },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("API Error:", error);
    
    // Check for Mongoose Validation Errors
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