"use client";

import React, { useEffect, useState } from "react";
import { 
  Search, 
  Plus, 
  Filter, 
  MoreVertical, 
  FolderOpen, 
  Clock, 
  FileText,
  ArrowUpRight,
  Layers,
  AlertCircle
} from "lucide-react";
import { format } from "date-fns";

// --- Types ---
interface CategoryData {
  name: string;
  count: number;
  latestImage?: string;
  lastActive: string;
}

// --- Helper: Generate Gradients based on name ---
const getGradient = (name: string) => {
  // Safe check for name in case it's null
  const safeName = name || "default"; 
  const gradients = [
    "from-purple-500 to-indigo-500",
    "from-pink-500 to-rose-500",
    "from-emerald-500 to-teal-500",
    "from-blue-500 to-cyan-500",
    "from-amber-500 to-orange-500",
    "from-violet-500 to-purple-500",
  ];
  const index = safeName.length % gradients.length;
  return gradients[index];
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/admin/categories");
        const data = await res.json();
        if (Array.isArray(data)) {
          setCategories(data);
        }
      } catch (error) {
        console.error("Failed to load categories", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  // Filter Logic - FIX APPLIED HERE
  const filteredCategories = categories.filter((cat) => 
    // We check if cat.name exists. If null, use "Uncategorized" or empty string
    (cat.name || "Uncategorized").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            Categories
            <span className="px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-xs text-zinc-500 font-medium">
              {categories.length}
            </span>
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Organize your content into topics and manage taxonomy.
          </p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 text-white dark:text-zinc-900 text-sm font-medium px-4 py-2.5 rounded-xl transition-all active:scale-95 shadow-lg shadow-zinc-500/20">
          <Plus size={18} />
          Add Category
        </button>
      </div>

      {/* --- CONTROLS --- */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white dark:bg-zinc-900 p-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
          <input
            type="text"
            placeholder="Find a category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-transparent border-none outline-none text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
          />
        </div>
        <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-800 self-center hidden sm:block" />
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl transition-colors">
          <Filter size={16} />
          <span>Sort: Popular</span>
        </button>
      </div>

      {/* --- GRID --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        
        {loading ? (
          // Skeletons
          [...Array(6)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 space-y-4 animate-pulse">
               <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-xl" />
               <div className="h-4 w-3/4 bg-zinc-100 dark:bg-zinc-800 rounded" />
               <div className="h-3 w-1/2 bg-zinc-100 dark:bg-zinc-800 rounded" />
            </div>
          ))
        ) : filteredCategories.length === 0 ? (
          // Empty State
          <div className="col-span-full py-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4 text-zinc-400">
              <Layers size={32} />
            </div>
            <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">No categories found</h3>
            <p className="text-sm text-zinc-500">
              Try a different search term or add a new category by creating a post.
            </p>
          </div>
        ) : (
          // Cards
          filteredCategories.map((cat, index) => {
            // Handle null names safely
            const displayName = cat.name || "Uncategorized";
            
            return (
              <div 
                key={displayName + index} 
                className="group relative overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                {/* Card Header (Image or Gradient) */}
                <div className="h-24 relative overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                  {cat.latestImage ? (
                    <>
                      <img 
                        src={cat.latestImage} 
                        alt={displayName} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </>
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${getGradient(displayName)} opacity-80`} />
                  )}

                  {/* Edit Action Button */}
                  <button className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/20 backdrop-blur-md text-white hover:bg-white/30 transition-colors opacity-0 group-hover:opacity-100">
                    <MoreVertical size={16} />
                  </button>
                </div>

                {/* Card Content */}
                <div className="p-5 relative">
                  {/* Floating Icon */}
                  <div className="absolute -top-6 left-5">
                     <div className="w-12 h-12 rounded-xl bg-white dark:bg-zinc-800 shadow-md flex items-center justify-center text-zinc-700 dark:text-zinc-200 border border-zinc-100 dark:border-zinc-700">
                       <FolderOpen size={20} />
                     </div>
                  </div>

                  <div className="mt-6 space-y-1">
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 truncate group-hover:text-indigo-600 transition-colors">
                      {displayName}
                    </h3>
                    
                    <div className="flex items-center justify-between pt-4">
                       <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                         <FileText size={14} />
                         <span className="font-semibold text-zinc-700 dark:text-zinc-300">{cat.count}</span> posts
                       </div>
                       <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                         <Clock size={14} />
                         <span>{cat.lastActive ? format(new Date(cat.lastActive), 'MMM d') : 'N/A'}</span>
                       </div>
                    </div>
                  </div>
                  
                  {/* Hover overlay link indicator */}
                  <div className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
                    <ArrowUpRight size={18} className="text-indigo-600" />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}