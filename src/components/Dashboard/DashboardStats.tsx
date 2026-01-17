"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, MessageSquare, BookOpen, TrendingUp, AlertCircle, LucideIcon } from "lucide-react";

// 1. Define the shape of the data expected from the API
interface StatData {
  label: string;
  value: string;
  change: string;
  icon: string; // API sends "Eye", not the component itself
  trend: "up" | "down" | "neutral";
}

// 2. Map string names to actual Lucide components
const ICON_MAP: Record<string, LucideIcon> = {
  "Eye": Eye,
  "MessageSquare": MessageSquare,
  "BookOpen": BookOpen,
  "TrendingUp": TrendingUp,
};

export function DashboardStats() {
  const [stats, setStats] = useState<StatData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // REPLACE THIS URL WITH YOUR ACTUAL API ENDPOINT
        const response = await fetch('/api/dashboard/stats');
        
        if (!response.ok) {
          throw new Error('Failed to fetch stats');
        }

        const data = await response.json();
        setStats(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  // --- LOADING STATE (Skeleton UI) ---
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="border-none shadow-md bg-white dark:bg-zinc-900">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-800 animate-pulse rounded" />
              <div className="h-4 w-4 bg-zinc-200 dark:bg-zinc-800 animate-pulse rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-zinc-200 dark:bg-zinc-800 animate-pulse rounded mb-2" />
              <div className="h-3 w-32 bg-zinc-200 dark:bg-zinc-800 animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // --- ERROR STATE ---
  if (error) {
    return (
      <div className="p-4 rounded-lg border border-red-200 bg-red-50 text-red-600 flex items-center gap-2">
        <AlertCircle className="h-4 w-4" />
        <span className="text-sm font-medium">{error}</span>
      </div>
    );
  }

  // --- SUCCESS STATE ---
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        // Resolve the string icon name to the component, fallback to TrendingUp if not found
        const IconComponent = ICON_MAP[stat.icon] || TrendingUp;

        return (
          <Card key={stat.label} className="border-none shadow-md bg-white dark:bg-zinc-900 transition-all hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
              <IconComponent className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className={`text-xs mt-1 font-medium ${
                stat.trend === "up" ? "text-emerald-500" : stat.trend === "down" ? "text-rose-500" : "text-zinc-500"
              }`}>
                {stat.change}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}