import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Blog from "@/models/Blog"; // Adjust path to your Blog model
import User from "@/models/User"; // Adjust path to your User model

// --- DB CONNECTION HELPER (If you don't have one in lib/db.ts) ---
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

async function connectToDatabase() {
  if (mongoose.connection.readyState >= 1) {
    return;
  }
  return mongoose.connect(MONGODB_URI as string);
}
// ------------------------------------------------------------------

export async function GET() {
  try {
    await connectToDatabase();

    // Run aggregations in parallel for performance
    const [stats, activePostsCount] = await Promise.all([
      // 1. Aggregate Views, Likes, and Approx Reading Time
      Blog.aggregate([
        {
          $group: {
            _id: null,
            totalViews: { $sum: "$stats.views" },
            totalLikes: { $sum: "$stats.likes" },
            // Approximate word count by splitting spaces to calculate avg reading time
            avgWordCount: { 
              $avg: { 
                $size: { $split: [{ $ifNull: ["$content", ""] }, " "] } 
              } 
            }
          }
        }
      ]),
      // 2. Count Active (Published) Posts
      Blog.countDocuments({ published: true })
    ]);

    // Extract values (handle case where DB is empty)
    const result = stats[0] || { totalViews: 0, totalLikes: 0, avgWordCount: 0 };
    
    // Calculate Reading Time (Avg Words / 200 words per minute)
    const avgMinutes = Math.floor(result.avgWordCount / 200);
    const avgSeconds = Math.round(((result.avgWordCount / 200) - avgMinutes) * 60);
    const readingTimeString = `${avgMinutes}m ${avgSeconds}s`;

    // Format numbers (e.g., 1200 -> "1,200")
    const formatNumber = (num: number) => new Intl.NumberFormat('en-US').format(num);

    // Construct the response object expected by the frontend
    const dashboardData = [
      {
        label: "Total Views",
        value: formatNumber(result.totalViews),
        change: "+12.5%", // Note: Real % change requires historical data (analytics table)
        icon: "Eye",
        trend: "up"
      },
      {
        label: "Active Posts",
        value: activePostsCount.toString(),
        change: "+2 this week", // Placeholder for logic needing 'createdAt' filtering
        icon: "BookOpen",
        trend: "neutral"
      },
      {
        label: "Total Likes", // Swapped from "Comments" since Schema has Likes
        value: formatNumber(result.totalLikes),
        change: "+8.2%", 
        icon: "MessageSquare", // Using MessageSquare icon as requested, or switch to Heart
        trend: "up"
      },
      {
        label: "Avg. Reading Time",
        value: readingTimeString,
        change: "-2%",
        icon: "TrendingUp",
        trend: "down"
      }
    ];

    return NextResponse.json(dashboardData);

  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}