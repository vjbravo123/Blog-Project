// File: services/blog.services.ts

import dbConnect from "@/lib/db";
import Blog from "@/models/Blog";
import User from "@/models/Users"; // Required for .populate to work properly

export const BlogService = {
  // 1. Get all posts (for admin or main feed)
  async getAllPosts() {
    await dbConnect();
    return await Blog.find({ published: true })
      .sort({ createdAt: -1 })
      .populate("author", "name image avatar")
      .lean();
  },

  // 2. Create a new post
  async createPost(data: any) {
    await dbConnect();
    const blog = await Blog.create(data);
    return blog;
  },

  // 3. --- NEW: Update an existing post ---
  async updatePost(id: string, updateData: any) {
    await dbConnect();

    // findByIdAndUpdate parameters:
    // 1. id: The ID of the document to update
    // 2. updateData: The object containing fields to change
    // 3. { new: true, runValidators: true }: Return the updated doc & enforce schema rules
    const updatedPost = await Blog.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate("author", "name image avatar");

    return updatedPost;
  },

  // 4. Get featured posts
  async getFeaturedPosts() {
    await dbConnect();
    return await Blog.find({ isFeatured: true, published: true })
      .limit(3)
      .sort({ createdAt: -1 })
      .populate("author", "name image avatar")
      .lean();
  },

  // 5. Get recent posts (with optional category filter)
  async getRecentPosts(category?: string) {
    await dbConnect();
    
    const query: any = { published: true };
    
    if (category && category !== "All") {
      // Escape special regex characters to prevent crashes (e.g., "C++")
      const escapedCategory = category.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query.tags = { $in: [new RegExp(`^${escapedCategory}$`, "i")] };
    }

    return await Blog.find(query)
      .sort({ createdAt: -1 })
      .populate("author", "name image avatar") 
      .lean();
  },

  // 6. Get list of all categories
  async getAllCategories() {
    await dbConnect();
    return await Blog.distinct("tags");
  },

  // 7. Get single post by Slug (for public view)
  async getPostBySlug(slug: string) {
    try {
      await dbConnect();
      
      const post = await Blog.findOne({ slug, published: true })
        .populate("author", "name image avatar bio") 
        .lean();
      
      return post;
    } catch (error) {
      console.error("Error fetching post by slug:", error);
      return null;
    }
  },
  
  // 8. Get single post by ID (for editor/admin)
  async getPostById(id: string) {
    try {
      await dbConnect();
      const post = await Blog.findById(id).lean();
      return post;
    } catch (error) {
      console.error("Error fetching post by ID:", error);
      return null;
    }
  }
};