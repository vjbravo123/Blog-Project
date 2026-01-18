// File: app/api/dashboard/categories/route.ts (Check your folder name, based on screenshot it looks like 'categories')

import { NextResponse } from "next/server";
import { DashboardService } from "@/services/dashboard.services";

export async function GET() {
  try {
    // Service handles DB connection, aggregation, and data formatting
    const data = await DashboardService.getCategoryStats();

    return NextResponse.json(data);

  } catch (error) {
    console.error("Category API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch category stats" }, 
      { status: 500 }
    );
  }
} 