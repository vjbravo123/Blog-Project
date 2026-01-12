import mongoose, { Schema, model, models, Document } from "mongoose";
import slugify from "slugify";

// 1. Interface
export interface IBlog extends Document {
  title: string;
  subtitle?: string;
  slug: string;
  contentFormat: 'markdown' | 'mdx' | 'html' | 'blocks';
  content: string;
  coverImage: {
    url: string;
    alt: string;
    credit: string;
  };
  series?: {
    name: string;
    slug: string;
    order: number;
  };
  author: mongoose.Types.ObjectId;
  published: boolean;
  publishedAt?: Date;
  tags: string[];
  category: string;
  canonicalUrl?: string;
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    keywords: string[];
  };
  isFeatured: boolean;
  stats: {
    views: number;
    likes: number;
    shares: number;
  };
  metadata?: any;
  createdAt: Date;
  updatedAt: Date;
  // Virtuals
  readingTime: number;
  snippet: string;
}

const BlogSchema = new Schema<IBlog>(
  {
    title: { 
      type: String, 
      required: [true, "Title is required"], 
      trim: true,
      maxlength: [150, "Title cannot exceed 150 characters"] 
    },
    subtitle: {
      type: String, 
      maxlength: [200, "Subtitle cannot exceed 200 characters"]
    },
    slug: { 
      type: String, 
      unique: true, 
      lowercase: true,
      index: true 
    },
    contentFormat: {
      type: String,
      enum: ['markdown', 'mdx', 'html', 'blocks'], 
      default: 'markdown' 
    },
    content: { 
      type: String, 
      required: [true, "Content is required"] 
    },
    coverImage: {
      url: { type: String, default: "https://via.placeholder.com/1200x630.png" },
      alt: { type: String, default: "Blog Cover Image" },
      credit: { type: String, default: "" }, 
    },
    series: {
      name: { type: String }, 
      slug: { type: String }, 
      order: { type: Number, default: 1 }  
    },
    author: { 
      type: Schema.Types.ObjectId, 
      ref: "User", 
      required: true,
      index: true 
    },
    published: { type: Boolean, default: false, index: true },
    publishedAt: { type: Date }, 
    tags: [{ type: String, trim: true, lowercase: true }],
    category: { type: String, default: "General", index: true },
    canonicalUrl: { type: String }, 
    seo: {
      metaTitle: String,
      metaDescription: String,
      keywords: [String],
    },
    isFeatured: { type: Boolean, default: false, index: true },
    stats: {
      views: { type: Number, default: 0 },
      likes: { type: Number, default: 0 }, 
      shares: { type: Number, default: 0 }
    },
    metadata: { type: Schema.Types.Mixed }, 
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true, getters: true },
    toObject: { virtuals: true, getters: true }
  }
);

// Indexes
BlogSchema.index({ published: 1, isFeatured: 1, publishedAt: -1 });
BlogSchema.index({ title: "text", content: "text", tags: "text" });
BlogSchema.index({ "series.slug": 1, "series.order": 1 });

// Virtuals
BlogSchema.virtual("readingTime").get(function (this: IBlog) {
  if (!this.content) return 0;
  const wordsPerMinute = 200;
  // Strip HTML tags to count words
  const text = this.content.replace(/(<([^>]+)>)/gi, ""); 
  const noOfWords = text.split(/\s+/g).length;
  return Math.ceil(noOfWords / wordsPerMinute);
});

BlogSchema.virtual("snippet").get(function (this: IBlog) {
  if (this.seo && this.seo.metaDescription) return this.seo.metaDescription;
  if (!this.content) return "";
  // Strip HTML and Markdown characters for a clean snippet
  return this.content.replace(/(<([^>]+)>)/gi, "").substring(0, 160).replace(/[#*_`]/g, "") + "..."; 
});

// --- FIXED MIDDLEWARE ---
// 1. Used 'async' function
// 2. Removed 'next' parameter (Mongoose waits for the promise to resolve)
BlogSchema.pre("validate", async function (this: IBlog) {
  // Generate Slug for Post
  if (this.title && !this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }

  // Set Published Date
  if (this.published && !this.publishedAt) {
    this.publishedAt = new Date();
  }

 
  if (this.series && this.series.name && !this.series.slug) {
    this.series.slug = slugify(this.series.name, { lower: true, strict: true });
  }
});

// Cleanup for JSON response
BlogSchema.set("toJSON", {
  transform: (doc, ret: any) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
  virtuals: true 
});

const Blog = models.Blog || model<IBlog>("Blog", BlogSchema);
export default Blog;