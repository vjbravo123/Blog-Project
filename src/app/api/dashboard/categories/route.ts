import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Blog from "@/models/Blog"; 

const MONGODB_URI = process.env.MONGODB_URI;

async function connectToDatabase() {
  if (mongoose.connection.readyState >= 1) return;
  if (!MONGODB_URI) throw new Error("MONGODB_URI is missing");
  return mongoose.connect(MONGODB_URI);
}

// Helper to format category names (e.g. "api design" -> "Api Design")
const formatCategory = (str: string) => {
  if (!str) return "Uncategorized";
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export async function GET() {
  try {
    await connectToDatabase();

    const categoryStats = await Blog.aggregate([
      // 1. Group by Category and COUNT the number of posts
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 } // <--- CHANGED: Counts posts instead of views
        }
      },
      
      // 2. Sort by highest count first
      { $sort: { count: -1 } },
      
      // 3. Limit to top 6 categories
      { $limit: 6 }
    ]);

    // 4. Format the data for the chart
    const formattedData = categoryStats.map(item => ({
      name: formatCategory(item._id), 
      total: item.count
    }));

    return NextResponse.json(formattedData);

  } catch (error) {
    console.error("Category API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch category stats" }, 
      { status: 500 }
    );
  }
}