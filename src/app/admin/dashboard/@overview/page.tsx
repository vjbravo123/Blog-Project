"use client";

import { DashboardStats } from "@/components/Dashboard/DashboardStats";
import { RecentActivity } from "@/components/Dashboard/RecentActivity";
import { AdminActions } from "@/components/Dashboard/AdminActions";
// Import the new component
import { DashboardHighlights } from "@/components/Dashboard/DashboardHighlights"; 

export default function ContentSlot() {
  return (
    <div className="space-y-8">
      {/* Header with Title and Actions */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Dashboard</h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400">Welcome back to your admin panel.</p>
        </div>
        <AdminActions />
      </div>

      {/* Stats Row */}
      <DashboardStats />

      {/* --- NEW FOCUS ZONE --- */}
      {/* Replaces the old AnalyticsSection */}
      <DashboardHighlights />
      {/* ---------------------- */}

      {/* Recent Activity Table */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        <RecentActivity />
      </div>
    </div>
  );
}