"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search, LayoutGrid, List, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRef } from "react";

const CATEGORIES = ["All", "Tech", "Design", "Lifestyle", "Career", "Tutorials"];

interface BlogToolbarProps {
  view: "grid" | "list";
  setView: (v: "grid" | "list") => void;
}

export default function BlogToolbar({ view, setView }: BlogToolbarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const activeCategory = searchParams.get("category") || "All";
  const activeSearch = searchParams.get("search") || "";

  // Helper to update URL without refreshing
  const updateParams = (newParams: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null || value === "" || value === "All") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    router.replace(`/blog?${params.toString()}`, { scroll: false });
  };

  // Debounced Search Handler (Waits 300ms before updating URL)
  const handleSearch = (term: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    
    timerRef.current = setTimeout(() => {
      updateParams({ search: term });
    }, 300);
  };

  const clearSearch = () => {
    const input = document.getElementById("search-input") as HTMLInputElement;
    if (input) input.value = "";
    updateParams({ search: null });
  };

  return (
    // FIX: Removed 'sticky top-4' so it scrolls away
    <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
      
      {/* --- LEVEL 1: Search & View Toggle --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-2 md:p-1">
        
        {/* Search Input */}
        <div className="relative w-full md:max-w-md group">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="text-zinc-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
          </div>
          <input 
            id="search-input"
            type="text" 
            placeholder="Search articles..." 
            defaultValue={activeSearch}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl py-3 pl-10 pr-10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm placeholder:text-zinc-500"
          />
          {activeSearch && (
            <button 
              onClick={clearSearch}
              className="absolute inset-y-0 right-3 flex items-center text-zinc-400 hover:text-red-500 transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-1 rounded-xl shadow-sm self-start md:self-auto">
          <button 
            onClick={() => setView("grid")}
            className={cn(
              "p-2.5 rounded-lg transition-all", 
              view === "grid" 
                ? "bg-zinc-100 dark:bg-zinc-800 text-indigo-600 font-bold" 
                : "text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
            )}
            title="Grid View"
          >
            <LayoutGrid size={18} />
          </button>
          <button 
            onClick={() => setView("list")}
            className={cn(
              "p-2.5 rounded-lg transition-all", 
              view === "list" 
                ? "bg-zinc-100 dark:bg-zinc-800 text-indigo-600 font-bold" 
                : "text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
            )}
            title="List View"
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {/* --- LEVEL 2: Categories --- */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 px-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => updateParams({ category: cat })}
            className={cn(
              "whitespace-nowrap px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all border select-none",
              activeCategory === cat 
                ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/20 scale-105"
                : "bg-white dark:bg-zinc-900 text-zinc-500 border-zinc-200 dark:border-zinc-800 hover:border-indigo-200 hover:text-indigo-600 dark:hover:border-zinc-700"
            )}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}