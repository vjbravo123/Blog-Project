"use client";

import React, { useState } from "react";
import { 
  ArrowRight, 
  Sparkles, 
  PenTool, 
  Image as ImageIcon, 
  Zap, 
  TrendingUp,
  MoreHorizontal
} from "lucide-react";

export function DashboardHighlights() {
  const [draftTitle, setDraftTitle] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* --- LEFT: TRENDING SPOTLIGHT (2/3 Width) --- */}
      {/* This adds visual impact with an image-based card */}
      <div className="lg:col-span-2 relative overflow-hidden rounded-2xl bg-zinc-900 text-white min-h-[280px] shadow-lg group">
        
        {/* Background Image with Gradient Overlay */}
        <div 
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1432821596592-e2c18b78144f?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

        {/* Content */}
        <div className="relative z-10 p-8 flex flex-col justify-between h-full">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 backdrop-blur-md text-xs font-semibold text-indigo-300">
              <Sparkles size={12} />
              Trending Now
            </span>
            <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-colors text-white/70 hover:text-white">
              <MoreHorizontal size={18} />
            </button>
          </div>

          <div className="space-y-4 max-w-xl">
            <h2 className="text-3xl font-bold leading-tight tracking-tight">
              The Future of Web Development: What to Expect in 2025
            </h2>
            
            <div className="flex items-center gap-6 text-sm text-zinc-300">
              <div className="flex items-center gap-2">
                <TrendingUp size={16} className="text-emerald-400" />
                <span className="font-medium text-white">12.5k</span> views
              </div>
              <div className="w-1 h-1 rounded-full bg-zinc-500" />
              <span>Published 2 days ago</span>
              <div className="w-1 h-1 rounded-full bg-zinc-500" />
              <span>8 min read</span>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-4">
            <button className="group/btn inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-zinc-900 font-semibold text-sm hover:bg-indigo-50 transition-colors">
              View Analytics
              <ArrowRight size={16} className="transition-transform group-hover/btn:translate-x-1" />
            </button>
          </div>
        </div>
      </div>

      {/* --- RIGHT: QUICK ACTIONS & DRAFT (1/3 Width) --- */}
      <div className="flex flex-col gap-6">
        
        {/* Quick Draft Widget */}
        <div className={`flex-1 bg-white dark:bg-zinc-900 border rounded-2xl p-6 shadow-sm transition-all duration-300 ${isFocused ? 'ring-2 ring-indigo-500/20 border-indigo-500' : 'border-zinc-200 dark:border-zinc-800'}`}>
          <div className="flex items-center gap-3 mb-4 text-zinc-500 dark:text-zinc-400">
            <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400">
              <PenTool size={18} />
            </div>
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Quick Draft</h3>
          </div>
          
          <div className="space-y-4">
            <textarea
              placeholder="What's on your mind? Type a title..."
              value={draftTitle}
              onChange={(e) => setDraftTitle(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="w-full h-24 p-0 text-lg font-medium bg-transparent border-none outline-none resize-none placeholder:text-zinc-300 dark:placeholder:text-zinc-600 text-zinc-800 dark:text-zinc-200"
            />
            
            <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <div className="flex gap-2">
                <button className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors" title="Add Image">
                  <ImageIcon size={18} />
                </button>
                <button className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors" title="AI Assist">
                  <Zap size={18} />
                </button>
              </div>
              <button 
                disabled={!draftTitle.trim()}
                className="px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create
              </button>
            </div>
          </div>
        </div>

        {/* Mini System Status (Optional visual filler) */}
        {/* <div className="p-4 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl text-white shadow-lg flex items-center justify-between">
            <div>
              <p className="text-indigo-100 text-xs font-medium uppercase tracking-wider">System Status</p>
              <p className="font-bold flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                All Systems Operational
              </p>
            </div>
        </div> */}

      </div>
    </div>
  );
}