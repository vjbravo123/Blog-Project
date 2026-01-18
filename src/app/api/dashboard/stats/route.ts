import { NextResponse } from "next/server";
import { DashboardService } from "@/services/dashboard.services";

export async function GET() {
  try {
    // Service returns the new structure directly
    const dashboardData = await DashboardService.getMainDashboardStats();
    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error("Dashboard Stats API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}