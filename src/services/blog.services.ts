import dbConnect from "@/lib/db";
import Blog from "@/models/Blog";
import User from "@/models/Users"; // Required for .populate to work

export const BlogService = {
  async getAllPosts() {
    await dbConnect();
    return await Blog.find({ published: true })
      .sort({ createdAt: -1 })
      .populate("author", "name image avatar")
      .lean();
  },

  async createPost(data: any) {
    await dbConnect();
    const blog = await Blog.create(data);
    return blog;
  },

  async getFeaturedPosts() {
    await dbConnect();
    return await Blog.find({ isFeatured: true, published: true })
      .limit(3)
      .sort({ createdAt: -1 })
      .populate("author", "name image avatar")
      .lean();
  },

  async getRecentPosts(category?: string) {
    await dbConnect();
    
    const query: any = { published: true };
    
    if (category && category !== "All") {
      // robust case-insensitive matching for tags
      query.tags = { $in: [new RegExp(`^${category}$`, "i")] };
    }

    return await Blog.find(query)
      .sort({ createdAt: -1 })
      .populate("author", "name image avatar") 
      .lean();
  },

  async getAllCategories() {
    await dbConnect();
    return await Blog.distinct("tags");
  },

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
};