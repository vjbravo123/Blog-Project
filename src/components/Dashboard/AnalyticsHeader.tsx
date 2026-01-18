"use client";

import React, { useState, useEffect } from "react";
import { 
  Calendar, 
  Download, 
  ChevronDown, 
  Activity, 
  Users, 
  RefreshCcw,
  Globe
} from "lucide-react";

// --- REAL-TIME VISITOR SIMULATOR ---
// This hook simulates live user count fluctuations for visual appeal
function useLiveVisitors() {
  const [count, setCount] = useState(42);
  const [trend, setTrend] = useState<"up" | "down">("up");

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => {
        const change = Math.floor(Math.random() * 5) - 2; // Random change between -2 and +2
        const newValue = Math.max(12, prev + change); // Minimum 12 users
        setTrend(newValue > prev ? "up" : "down");
        return newValue;
      });
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return { count, trend };
}

export function AnalyticsHeader() {
  const [timeRange, setTimeRange] = useState("7d");
  const [isExporting, setIsExporting] = useState(false);
  const { count, trend } = useLiveVisitors();

  const handleExport = () => {
    setIsExporting(true);
    // Simulate download delay
    setTimeout(() => setIsExporting(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm mb-6">
      
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        
        {/* --- LEFT SECTION: Title & Live Stats --- */}
        <div className="flex items-center gap-4">
          {/* Icon Box */}
          <div className="h-12 w-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Activity size={24} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              Traffic Analytics
            </h2>
            <div className="flex items-center gap-3 mt-1 text-sm">
              <span className="text-zinc-500 dark:text-zinc-400">
                Real-time Insight
              </span>
              
        
            </div>
          </div>
        </div>

        {/* --- RIGHT SECTION: Filters & Actions --- */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          
          {/* 1. Time Range Switcher */}
          <div className="flex p-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg w-full sm:w-auto">
            {[
              { label: "24h", value: "24h" },
              { label: "7d", value: "7d" },
              { label: "30d", value: "30d" },
              { label: "90d", value: "90d" },
            ].map((range) => (
              <button
                key={range.value}
                onClick={() => setTimeRange(range.value)}
                className={`flex-1 sm:flex-none px-4 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 ${
                  timeRange === range.value
                    ? "bg-white dark:bg-zinc-950 text-indigo-600 dark:text-indigo-400 shadow-sm"
                    : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50"
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>

          <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-700 hidden sm:block" />

          {/* 2. Date Picker Button (Visual Only) */}
          <button className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors w-full sm:w-auto justify-center">
            <Calendar size={14} className="text-zinc-400" />
            <span>Custom Range</span>
            <ChevronDown size={12} className="opacity-50" />
          </button>

          {/* 3. Export Button */}
          <button 
            onClick={handleExport}
            disabled={isExporting}
            className="group flex items-center gap-2 px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-bold rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all active:scale-95 w-full sm:w-auto justify-center"
          >
            {isExporting ? (
              <RefreshCcw size={14} className="animate-spin" />
            ) : (
              <Download size={14} className="group-hover:-translate-y-0.5 transition-transform" />
            )}
            <span>{isExporting ? "Generating..." : "Export Report"}</span>
          </button>

        </div>
      </div>

      {/* --- OPTIONAL: Quick Context Bar (Bottom of Header) --- */}
      <div className="flex items-center gap-6 mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
         
         <div className="flex items-center gap-2 min-w-max">
           <div className="w-2 h-2 rounded-full bg-blue-500" />
           <span className="text-xs text-zinc-500">
             Top Region: <span className="font-semibold text-zinc-700 dark:text-zinc-300">India (45%)</span>
           </span>
         </div>

         <div className="flex items-center gap-2 min-w-max">
           <div className="w-2 h-2 rounded-full bg-purple-500" />
           <span className="text-xs text-zinc-500">
             Top Device: <span className="font-semibold text-zinc-700 dark:text-zinc-300">Mobile (62%)</span>
           </span>
         </div>

         <div className="flex items-center gap-2 min-w-max">
           <div className="w-2 h-2 rounded-full bg-orange-500" />
           <span className="text-xs text-zinc-500">
             Avg Session: <span className="font-semibold text-zinc-700 dark:text-zinc-300">2m 14s</span>
           </span>
         </div>

         <div className="flex-1" />
         
         <div className="flex items-center gap-1 text-[10px] font-medium text-zinc-400 uppercase tracking-widest min-w-max">
           <Globe size={12} />
           <span>Global Data</span>
         </div>
      </div>

    </div>
  );
}