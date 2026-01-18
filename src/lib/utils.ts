// File: lib/utils.ts
import { uploadBase64ToS3 } from "@/lib/s3";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind CSS classes with clsx and tailwind-merge.
 * This prevents style conflicts (e.g., 'px-2 px-4' becomes 'px-4').
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Escapes special characters for Regex queries to prevent MongoDB crashes
 */
export function escapeRegex(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Handles logic for uploading Base64 images or returning existing URLs.
 */
export async function processCoverImage(imageInput: string | undefined): Promise<string> {
  if (!imageInput) return "";

  // If it's a Base64 string (New Upload)
  if (imageInput.startsWith("data:image")) {
    try {
      console.log(">> Starting S3 Upload...");
      const url = await uploadBase64ToS3(imageInput);
      console.log(">> S3 Upload Success. URL:", url);
      return url;
    } catch (uploadError) {
      console.error(">> S3 Upload Failed:", uploadError);
      return ""; // Fallback to empty string on error
    }
  }

  // It's already a URL
  return imageInput;
}

/**
 * Maps the raw request body to the Blog Mongoose Model structure.
 * This ensures consistency between Create and Update operations.
 */
export function formatPostData(body: any, imageUrl: string) {
  return {
    title: body.title,
    slug: body.slug || undefined,
    subtitle: body.subtitle || body.excerpt,
    content: body.content,
    category: body.category || "Technology",
    tags: [body.category || "Technology"],
    
    coverImage: {
      url: imageUrl,
      alt: body.title,
      credit: ""
    },
    
    seo: {
      metaTitle: body.seo?.metaTitle || body.title,
      metaDescription: body.seo?.metaDescription || body.subtitle,
    },
    metadata: {
      blocks: body.metadata?.blocks || body.blocks || [],
    },
    published: body.published,
  };
}


/**
 * Formats category names (e.g. "api design" -> "Api Design")
 */
export function formatCategoryName(str: string): string {
  if (!str) return "Uncategorized";
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Formats numbers with commas (e.g. 1200 -> "1,200")
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

/**
 * Calculates reading time string from word count (e.g. "5m 30s")
 */
export function calculateReadingTime(wordCount: number): string {
  const avgMinutes = Math.floor(wordCount / 200);
  const avgSeconds = Math.round(((wordCount / 200) - avgMinutes) * 60);
  return `${avgMinutes}m ${avgSeconds}s`;
}

/**
 * Maps a raw Mongoose post document to the Dashboard Table format
 */
export function formatDashboardPost(post: any) {
  return {
    id: post._id,
    title: post.title,
    category: post.category || "Uncategorized",
    views: post.stats?.views || 0,
    status: post.published ? "Published" : "Draft",
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    image: post.coverImage?.url || post.coverImage || "",
    slug: post.slug
  };
}

/**
 * Simulates daily traffic data based on total views.
 * (Used because there is no daily analytics table in the DB)
 */
export function generateSimulatedChartData(totalViews: number, days = 7) {
  const chartData = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

    // Logic: Average daily view is roughly Total / 30.
    const baseDaily = totalViews > 0 ? Math.ceil(totalViews / 30) : 0; 
    const fluctuation = Math.floor(Math.random() * (baseDaily * 0.4)); // 40% variance
    
    let dailyViews = (i % 2 === 0) ? baseDaily + fluctuation : baseDaily - fluctuation;
    if (dailyViews < 0) dailyViews = 0;

    chartData.push({
      name: dayName,
      views: dailyViews
    });
  }
  return chartData;
}