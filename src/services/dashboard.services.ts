// File: services/dashboard.services.ts
import dbConnect from "@/lib/db";
import Blog from "@/models/Blog";
import { 
  formatCategoryName, 
  generateSimulatedChartData, 
  formatDashboardPost, 
  calculateReadingTime, 
  formatNumber 
} from "@/lib/utils";

export const DashboardService = {
  // 1. Get Category Distribution Stats
  async getCategoryStats() {
    await dbConnect();

    const categoryStats = await Blog.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 6 }
    ]);

    return categoryStats.map(item => ({
      name: formatCategoryName(item._id), 
      total: item.count
    }));
  },

  // 2. Get Traffic Chart Data
  async getTrafficChartData() {
    await dbConnect();

    // Get total views
    const aggregation = await Blog.aggregate([
      { $group: { _id: null, totalSiteViews: { $sum: "$stats.views" } } }
    ]);

    const totalViews = aggregation.length > 0 ? aggregation[0].totalSiteViews : 0;

    // Delegate simulation logic to utils
    return generateSimulatedChartData(totalViews);
  },

  // 3. Get Recent Activity/Posts
  async getRecentPostsForDashboard() {
    await dbConnect();

    const posts = await Blog.find({})
      .sort({ updatedAt: -1 }) 
      .limit(5)
      .select("title category stats published createdAt updatedAt coverImage slug") 
      .lean();

    // Delegate formatting to utils
    return posts.map(formatDashboardPost);
  },

   // 4. Get Main Dashboard Stats (Updated for Categories, Blogs, Drafts, Read Time)
  async getMainDashboardStats() {
    await dbConnect();

    // Run aggregations in parallel for performance
    const [publishedCount, draftCount, uniqueCategories, readingStats] = await Promise.all([
      // 1. Total Blogs (Published)
      Blog.countDocuments({ published: true }),
      
      // 2. Total Drafts
      Blog.countDocuments({ published: false }),
      
      // 3. Distinct Categories (Count unique strings in 'category' field)
      Blog.distinct("category"),

      // 4. Avg Reading Time (Aggregate word count of published posts)
      Blog.aggregate([
        { $match: { published: true } }, // Only calculate for published posts
        {
          $group: {
            _id: null,
            avgWordCount: { 
              $avg: { 
                $size: { $split: [{ $ifNull: ["$content", ""] }, " "] } 
              } 
            }
          }
        }
      ]),
    ]);

    // Calculate Reading Time (Avg Words / 200 words per minute)
    const rawAvgWords = readingStats[0]?.avgWordCount || 0;
    const avgMinutes = Math.floor(rawAvgWords / 200);
    const avgSeconds = Math.round(((rawAvgWords / 200) - avgMinutes) * 60);
    const readingTimeString = avgMinutes > 0 
      ? `${avgMinutes}m ${avgSeconds}s` 
      : `${avgSeconds}s`;

    // Construct Data
    return [
      {
        label: "Total Blogs",
        value: publishedCount.toString(),
        icon: "FileText",
        description: "Published posts",
        trend: "neutral" // You can add logic for trends if you have historical data
      },
      {
        label: "Total Categories",
        value: uniqueCategories.length.toString(),
        icon: "Tags",
        description: "Active topics",
        trend: "neutral"
      },
      {
        label: "Drafts",
        value: draftCount.toString(),
        icon: "NotebookPen",
        description: "Work in progress",
        trend: "neutral"
      },
      {
        label: "Avg. Read Time",
        value: readingTimeString,
        icon: "Clock",
        description: "Per article",
        trend: "neutral"
      }
    ];
  }
};