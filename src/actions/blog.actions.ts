"use server"; // Critical: This tells Next.js this code only runs on the server

import { CreateBlogSchema } from "@/lib/validators/blog";
import { BlogService } from "@/services/blog.services";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth"; // Assuming you use NextAuth/Auth.js
import { redirect } from "next/navigation";

export async function createBlogAction(prevState: any, formData: FormData) {
  // 1. Authenticate the user
  const session = await auth();
  if (!session || !session.user) {
    return { error: "You must be logged in to create a post." };
  }

  // 2. Extract and Validate data
  const rawData = {
    title: formData.get("title"),
    content: formData.get("content"),
    tags: formData.get("tags"),
  };

  const validatedFields = CreateBlogSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      error: "Validation Failed",
      details: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    // 3. Prepare data for Service (e.g., converting tags string to array)
    const blogData = {
      ...validatedFields.data,
      slug: (validatedFields.data.title as string)
        .toLowerCase()
        .replace(/ /g, "-"),
      author: session.user.id,
      tags: validatedFields.data.tags?.split(",").map(tag => tag.trim()) || [],
    };

    // 4. Call the Service
    const newPost = await BlogService.createPost(blogData);

    // 5. Cache Invalidation (This makes the new post show up instantly)
    revalidatePath("/blog");
    revalidatePath("/dashboard");

  } catch (error) {
    console.error("Action Error:", error);
    return { error: "Database error: Failed to create blog post." };
  }

  // 6. Redirect the user
  redirect("/blog");
}