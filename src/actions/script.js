import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";
import path from "path";

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const MONGODB_URI ="mongodb://localhost:27017/blog";

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

// Inline Models (Since we are running outside Next.js context)
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: { type: String, select: false },
  role: { type: String, default: "author" },
});

const BlogSchema = new mongoose.Schema({
  title: String,
  slug: String,
  content: String,
  excerpt: String,
  coverImage: String,
  isFeatured: { type: Boolean, default: false },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  published: { type: Boolean, default: true },
  tags: [String],
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", UserSchema);
const Blog = mongoose.models.Blog || mongoose.model("Blog", BlogSchema);

async function seed() {
  try {
    console.log("⏳ Connecting to MongoDB...");
    await mongoose.connect("mongodb://localhost:27017/blog");
    console.log("✅ Connected.");

    // 1. Clear existing data
    console.log("🧹 Clearing old data...");
    await User.deleteMany({});
    await Blog.deleteMany({});

    // 2. Create an Author
    console.log("👤 Creating author...");
    const hashedPassword = await bcrypt.hash("password123", 10);
    const author = await User.create({
      name: "John Doe",
      email: "john@example.com",
      password: hashedPassword,
      role: "author",
    });

    // 3. Create Sample Blogs
    console.log("📝 Creating blog posts...");
    const blogs = [
      {
        title: "Mastering Next.js 15: The Future of Web Development",
        slug: "mastering-nextjs-15",
        content: "Next.js 15 brings amazing features like React Server Components improvements and faster builds...",
        excerpt: "Learn the latest features of Next.js 15 and how they improve performance.",
        coverImage: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?q=80&w=1000&auto=format&fit=crop",
        isFeatured: true,
        author: author._id,
        tags: ["tech", "coding"],
      },
      {
        title: "Why Tailwind CSS is Every Developer's Best Friend",
        slug: "why-tailwind-css",
        content: "Utility-first CSS is changing the way we build interfaces. Tailwind makes it easy...",
        excerpt: "Discover why Tailwind CSS is the most popular styling tool in 2026.",
        coverImage: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=1000&auto=format&fit=crop",
        isFeatured: true,
        author: author._id,
        tags: ["design", "tech"],
      },
      {
        title: "10 Tips for Career Growth in Software Engineering",
        slug: "career-growth-tips",
        content: "Soft skills are just as important as coding skills when it comes to leveling up your career...",
        excerpt: "Actionable advice for developers looking to move into senior or lead roles.",
        coverImage: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000&auto=format&fit=crop",
        isFeatured: false,
        author: author._id,
        tags: ["career"],
      },
      {
        title: "Building Scalable APIs with MongoDB and Mongoose",
        slug: "scalable-apis-mongodb",
        content: "When building high-traffic applications, your database schema design is critical...",
        excerpt: "A deep dive into indexing and schema optimization in MongoDB.",
        coverImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc51?q=80&w=1000&auto=format&fit=crop",
        isFeatured: false,
        author: author._id,
        tags: ["tech", "database"],
      },
    ];

    await Blog.insertMany(blogs);
    console.log("✨ Database Seeded Successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed error:", error);
    process.exit(1);
  }
}

seed();