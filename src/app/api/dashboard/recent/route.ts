// File: app/api/dashboard/recent/route.ts

import { NextResponse } from "next/server";
import { DashboardService } from "@/services/dashboard.services";

export async function GET() {
  try {
    // Service handles DB connection, Querying, and Formatting
    const formattedPosts = await DashboardService.getRecentPostsForDashboard();

    return NextResponse.json(formattedPosts);

  } catch (error) {
    console.error("Dashboard Recent Posts Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" }, 
      { status: 500 }
    );
  }
}