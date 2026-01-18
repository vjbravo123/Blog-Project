// File: app/api/dashboard/chart/route.ts

import { NextResponse } from "next/server";
import { DashboardService } from "@/services/dashboard.services";

export async function GET() {
  try {
    // Service handles DB, Aggregation, and Simulation logic
    const chartData = await DashboardService.getTrafficChartData();

    return NextResponse.json(chartData);

  } catch (error) {
    console.error("Chart API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch chart data" }, 
      { status: 500 }
    );
  }
}