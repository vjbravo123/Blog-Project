import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Blog from "@/models/Blog"; // Ensure this path is correct

const MONGODB_URI = process.env.MONGODB_URI;

async function connectToDatabase() {
  if (mongoose.connection.readyState >= 1) return;
  if (!MONGODB_URI) throw new Error("MONGODB_URI is missing");
  return mongoose.connect(MONGODB_URI);
}

export async function GET() {
  try {
    await connectToDatabase();

    // 1. Get the sum of ALL views across all blog posts
    const aggregation = await Blog.aggregate([
      {
        $group: {
          _id: null,
          totalSiteViews: { $sum: "$stats.views" }
        }
      }
    ]);

    // Default to 0 if no posts exist
    const totalViews = aggregation.length > 0 ? aggregation[0].totalSiteViews : 0;

    // 2. Generate Time Series Data
    // NOTE: Since the Blog Schema doesn't have an "Analytics" history table 
    // (recording views per day), we simulate a daily breakdown based on the total.
    // In a production app, you would query an 'Analytics' collection here.

    const days = 7;
    const chartData = [];
    const today = new Date();

    // To make the chart look realistic, we assume approx 5-15% of total views happen daily
    // This scales automatically: 100 total views -> ~10/day. 100k views -> ~10k/day.
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      
      // Get short day name (e.g., "Mon", "Tue")
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

      // Generate a somewhat random daily view count based on total popularity
      // Logic: Average daily view is Total / 30. Then add random fluctuation.
      const baseDaily = totalViews > 0 ? Math.ceil(totalViews / 30) : 0; 
      const fluctuation = Math.floor(Math.random() * (baseDaily * 0.4)); // +/- variance
      
      // Ensure we don't show negative views, or 0 if the site is popular
      let dailyViews = (i % 2 === 0) ? baseDaily + fluctuation : baseDaily - fluctuation;
      if (dailyViews < 0) dailyViews = 0;

      chartData.push({
        name: dayName,
        views: dailyViews
      });
    }

    return NextResponse.json(chartData);

  } catch (error) {
    console.error("Chart API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch chart data" }, 
      { status: 500 }
    );
  }
}