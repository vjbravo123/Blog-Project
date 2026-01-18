"use client";

import React from "react";
import { 
  Globe, 
  Smartphone, 
  Monitor, 
  Search, 
  Twitter, 
  Facebook, 
  ArrowUpRight,
  Tablet,
  Eye,
  Clock,
  TrendingUp,
  MoreHorizontal
} from "lucide-react";

// Existing Chart Components
import { OverviewChart } from "@/components/Dashboard/OverviewChart";
import { CategoryDistribution } from "@/components/Dashboard/CategoryDistribution";

export default function AnalyticsSection() {
  return (
    <div className="space-y-6">
      
      {/* --- NEW TOP SECTION: Audience Insights --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* 1. Traffic Sources */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
            <Search size={18} className="text-indigo-500" />
            Traffic Sources
          </h3>
          <div className="space-y-4">
            {[
              { label: "Google Search", icon: Search, color: "bg-blue-500", val: "64%" },
              { label: "Twitter / X", icon: Twitter, color: "bg-sky-500", val: "21%" },
              { label: "Direct", icon: ArrowUpRight, color: "bg-zinc-500", val: "10%" },
              { label: "Facebook", icon: Facebook, color: "bg-indigo-600", val: "5%" },
            ].map((item, i) => (
              <div key={i} className="group">
                <div className="flex justify-between text-xs font-medium mb-1.5 text-zinc-600 dark:text-zinc-400">
                  <span className="flex items-center gap-1.5">
                    <item.icon size={12} /> {item.label}
                  </span>
                  <span className="text-zinc-900 dark:text-zinc-200">{item.val}</span>
                </div>
                <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${item.color} rounded-full transition-all duration-500 ease-out group-hover:opacity-80`} 
                    style={{ width: item.val }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Device Breakdown */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
            <Smartphone size={18} className="text-pink-500" />
            Device Usage
          </h3>
          
          <div className="flex items-end justify-center gap-4 h-32 mb-4">
            {/* Mobile Bar */}
            <div className="group relative flex flex-col items-center gap-2 w-12">
              <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">58%</span>
              <div className="w-full bg-pink-100 dark:bg-pink-900/20 rounded-t-lg h-24 relative overflow-hidden">
                <div className="absolute bottom-0 w-full bg-pink-500 h-[58%] transition-all duration-700 group-hover:bg-pink-400" />
              </div>
              <Smartphone size={16} className="text-zinc-400" />
            </div>
            
            {/* Desktop Bar */}
            <div className="group relative flex flex-col items-center gap-2 w-12">
              <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">35%</span>
              <div className="w-full bg-indigo-100 dark:bg-indigo-900/20 rounded-t-lg h-24 relative overflow-hidden">
                <div className="absolute bottom-0 w-full bg-indigo-500 h-[35%] transition-all duration-700 group-hover:bg-indigo-400" />
              </div>
              <Monitor size={16} className="text-zinc-400" />
            </div>

            {/* Tablet Bar */}
            <div className="group relative flex flex-col items-center gap-2 w-12">
              <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">7%</span>
              <div className="w-full bg-amber-100 dark:bg-amber-900/20 rounded-t-lg h-24 relative overflow-hidden">
                <div className="absolute bottom-0 w-full bg-amber-500 h-[10%] transition-all duration-700 group-hover:bg-amber-400" />
              </div>
              <Tablet size={16} className="text-zinc-400" />
            </div>
          </div>
          <p className="text-center text-xs text-zinc-400">Most users read on mobile</p>
        </div>

        {/* 3. Top Locations */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
           <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
            <Globe size={18} className="text-emerald-500" />
            Top Locations
          </h3>
          <div className="space-y-3">
            {[
              { country: "India", flag: "🇮🇳", users: "12,402", trend: "+12%" },
              { country: "United States", flag: "🇺🇸", users: "8,200", trend: "+5%" },
              { country: "United Kingdom", flag: "🇬🇧", users: "3,105", trend: "-2%" },
              { country: "Germany", flag: "🇩🇪", users: "1,200", trend: "+8%" },
            ].map((loc, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors cursor-default">
                 <div className="flex items-center gap-3">
                   <span className="text-lg">{loc.flag}</span>
                   <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{loc.country}</span>
                 </div>
                 <div className="text-right">
                   <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{loc.users}</div>
                   <div className={`text-[10px] ${loc.trend.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>
                     {loc.trend}
                   </div>
                 </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- MIDDLE SECTION: Charts (Existing) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl min-h-[400px] shadow-sm">
          <OverviewChart />
        </div>
        <div className="lg:col-span-4 p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl min-h-[400px] shadow-sm">
          <div className="flex items-center justify-between mb-2">
          </div>
          <CategoryDistribution />
        </div>
      </div>

      {/* --- NEW BOTTOM SECTION: Content Leaderboard --- */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <TrendingUp size={18} className="text-indigo-500" />
            Top Performing Content
          </h3>
          <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">View Full Report</button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-zinc-50 dark:bg-zinc-800/50 text-zinc-500 border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="px-6 py-4 font-medium">Article Title</th>
                <th className="px-6 py-4 font-medium text-right">Views</th>
                <th className="px-6 py-4 font-medium text-right">Avg. Time</th>
                <th className="px-6 py-4 font-medium text-right">Read Ratio</th>
                <th className="px-6 py-4 font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {[
                { title: "Understanding Next.js 14 Server Actions", views: "12,450", time: "4m 30s", ratio: "85%" },
                { title: "The Ultimate Guide to TypeScript Generics", views: "8,320", time: "6m 12s", ratio: "72%" },
                { title: "Why We Migrated from Redux to Zustand", views: "6,105", time: "3m 45s", ratio: "68%" },
                { title: "10 CSS Tricks You Didn't Know", views: "4,900", time: "2m 10s", ratio: "45%" },
                { title: "Deploying a Full Stack App on Vercel", views: "3,200", time: "5m 20s", ratio: "91%" },
              ].map((post, i) => (
                <tr key={i} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="font-medium text-zinc-900 dark:text-zinc-100 block">{post.title}</span>
                    <span className="text-xs text-zinc-500">Published in Tech</span>
                  </td>
                  <td className="px-6 py-4 text-right font-medium flex items-center justify-end gap-1.5">
                    {post.views}
                    <Eye size={14} className="text-zinc-400" />
                  </td>
                  <td className="px-6 py-4 text-right text-zinc-600 dark:text-zinc-400">
                    <span className="flex items-center justify-end gap-1.5">
                      {post.time}
                      <Clock size={14} className="text-zinc-400" />
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-bold ${
                      parseInt(post.ratio) > 80 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' :
                      parseInt(post.ratio) > 60 ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400' :
                      'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'
                    }`}>
                      {post.ratio}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-full text-zinc-400 hover:text-zinc-600 transition-colors">
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}