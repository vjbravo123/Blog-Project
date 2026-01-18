// File: services/blog.services.ts

import dbConnect from "@/lib/db";
import Blog from "@/models/Blog";
import User from "@/models/Users";
import { processCoverImage, formatPostData, escapeRegex } from "@/lib/utils";

export const BlogService = {
  // 1. Get all posts
  async getAllPosts() {
    await dbConnect();
    return await Blog.find({ published: true })
      .sort({ createdAt: -1 })
      .populate("author", "name image avatar")
      .lean();
  },

  // 2. Create a new post (Basic)
  async createPost(data: any) {
    await dbConnect();
    return await Blog.create(data);
  },

  // 2.1 Create Post (With Uploads & Formatting)
  async createPostWithUpload(body: any) {
    await dbConnect();

    // 1. Resolve Author
    let authorId = body.authorId;
    if (!authorId) {
      const defaultUser = await User.findOne({});
      if (defaultUser) authorId = defaultUser._id;
    }

    // 2. Process Image (Logic moved to utils)
    const finalImageUrl = await processCoverImage(body.coverImage);

    // 3. Prepare Data (Logic moved to utils)
    const postData = {
      ...formatPostData(body, finalImageUrl), // Spread common fields
      published: true, // Default for new posts
      publishedAt: new Date(),
      author: authorId,
    };

    // 4. Create
    return await Blog.create(postData);
  },

  // 3. Update an existing post (Basic)
  async updatePost(id: string, updateData: any) {
    await dbConnect();
    return await Blog.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate("author", "name image avatar");
  },

  // 12. Update Post (With Uploads & Formatting)
  async updatePostWithUpload(id: string, body: any) {
    await dbConnect();

    // 1. Process Image
    const finalImageUrl = await processCoverImage(body.coverImage);

    // 2. Prepare Data
    const updateData = formatPostData(body, finalImageUrl);

    // 3. Update
    return await Blog.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
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
      // Regex logic moved to utils
      const escapedCategory = escapeRegex(category);
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

  // 7. Get single post by Slug
  async getPostBySlug(slug: string) {
    try {
      await dbConnect();
      return await Blog.findOne({ slug, published: true })
        .populate("author", "name image avatar bio") 
        .lean();
    } catch (error) {
      console.error("Error fetching post by slug:", error);
      return null;
    }
  },
  
  // 8. Get single post by ID
  async getPostById(id: string) {
    await dbConnect();
    return await Blog.findById(id); 
  },

  // 13. Delete Post
  async deletePost(id: string) {
    await dbConnect();
    return await Blog.findByIdAndDelete(id);
  },

  // 14. Like a Post
  async likePost(id: string) {
    await dbConnect();
    return await Blog.findByIdAndUpdate(
      id, 
      { $inc: { "stats.likes": 1 } },
      { new: true }
    ).select("stats");
  },

  // 15. Increment Post Views
  async incrementViews(id: string) {
    await dbConnect();
    return await Blog.findByIdAndUpdate(
      id,
      { $inc: { "stats.views": 1 } },
      { new: true } 
    ).select("stats"); 
  },

  // 16. Get Paginated Posts (For Admin Dashboard)
  async getPaginatedPosts(page: number = 1, limit: number = 10, search: string = "") {
    await dbConnect();

    const skip = (page - 1) * limit;

    // Build Search Query
    const query: any = {};
    if (search) {
      // Create a case-insensitive regex
      // Note: In production with millions of rows, use MongoDB Atlas Search instead of $regex
      const searchRegex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      
      query.$or = [
        { title: { $regex: searchRegex } },
        { category: { $regex: searchRegex } },
        // We can search inside author names if we wanted, but requires aggregation
      ];
    }

    // Run Query and Count in parallel for performance
    const [posts, totalDocs] = await Promise.all([
      Blog.find(query)
        .sort({ createdAt: -1 }) // Newest first
        .skip(skip)
        .limit(limit)
        .populate("author", "name image avatar") // Get author details
        .select("-content") // Exclude heavy content field for list view
        .lean(),
      Blog.countDocuments(query)
    ]);

    const totalPages = Math.ceil(totalDocs / limit);

    return {
      posts,
      pagination: {
        totalDocs,
        totalPages,
        currentPage: page,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      }
    };
  } ,
   // 17. Get Detailed Categories with Stats (Name, Count, Latest Image)
  async getCategoriesWithStats() {
    await dbConnect();

    const categories = await Blog.aggregate([
      { 
        $match: { published: true } // Optional: Decide if you want drafts to count
      },
      { 
        $sort: { createdAt: -1 } // Sort by newest to get latest image
      },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          // Grab the cover image of the most recent post in this category
          latestImage: { $first: "$coverImage.url" },
          lastActive: { $first: "$createdAt" }
        }
      },
      {
        $project: {
          name: "$_id",
          count: 1,
          latestImage: 1,
          lastActive: 1,
          _id: 0
        }
      },
      { $sort: { count: -1 } } // Sort by most popular categories
    ]);

    return categories;
  }
};