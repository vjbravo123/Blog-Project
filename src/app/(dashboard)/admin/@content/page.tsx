"use client";

import dynamic from "next/dynamic";
import { DashboardStats } from "@/features/admin/components/DashboardStats";
import { RecentActivity } from "@/features/admin/components/RecentActivity";
import { AdminActions } from "@/features/admin/components/AdminActions";

const OverviewChart = dynamic(() => import("@/features/admin/components/OverviewChart").then(mod => mod.OverviewChart), { 
  ssr: false, 
  loading: () => <div className="h-80 bg-slate-100 animate-pulse rounded-xl" /> 
});

const CategoryDistribution = dynamic(() => import("@/features/admin/components/CategoryDistribution").then(mod => mod.CategoryDistribution), { 
  ssr: false, 
  loading: () => <div className="h-80 bg-slate-100 animate-pulse rounded-xl" /> 
});



export default function ContentSlot() {
  return (
    <div className="space-y-8">
      {/* Header with Title and Actions */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-slate-500">Welcome back to your admin panel.</p>
        </div>
        <AdminActions />
      </div>

      <DashboardStats />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 p-6 bg-white dark:bg-zinc-900 border rounded-xl min-h-[400px]">
          <OverviewChart />
        </div>
        <div className="lg:col-span-4 p-6 bg-white dark:bg-zinc-900 border rounded-xl min-h-[400px]">
          <CategoryDistribution />
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border rounded-xl overflow-hidden">
        <RecentActivity />
      </div>
    </div>
  );
}