"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Search, 
  Plus, 
  FileText, 
  Calendar, 
  Eye, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Filter
} from "lucide-react";
import { format } from "date-fns"; // Standard for date formatting in React

// Types based on your API response
interface Post {
  _id: string;
  id: string;
  title: string;
  slug: string;
  category: string;
  published: boolean;
  createdAt: string;
  coverImage: { url: string };
  stats: { views: number; likes: number };
  author: { name: string; image?: string };
}

interface Pagination {
  totalDocs: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export default function AllBlogsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Search & Filter State
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  // 1. Debounce Search Input (Wait 500ms after typing stops)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to page 1 on new search
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  // 2. Fetch Data
  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: "8", // Items per page
          search: debouncedSearch,
        });

        const res = await fetch(`/api/admin/blogs?${params}`);
        const data = await res.json();
        
        if (res.ok) {
          setPosts(data.posts);
          setPagination(data.pagination);
        }
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, [page, debouncedSearch]);

  return (
    <div className="space-y-6">
      {/* --- Header Section --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            All Posts
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Manage your blog posts, track views, and edit content.
          </p>
        </div>
        <Link 
          href="/admin/posts/create"
          className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shadow-sm shadow-indigo-200 dark:shadow-none"
        >
          <Plus size={18} />
          Create New
        </Link>
      </div>

      {/* --- Filter & Search Bar --- */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
          <input
            type="text"
            placeholder="Search posts by title or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
          <Filter size={16} />
          <span>Filter</span>
        </button>
      </div>

      {/* --- Content List --- */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        
        {/* Loading Skeleton */}
        {loading ? (
          <div className="p-6 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 animate-pulse">
                <div className="w-16 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-md" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded w-1/3" />
                  <div className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-zinc-50 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4 text-zinc-400">
              <FileText size={32} />
            </div>
            <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">No posts found</h3>
            <p className="text-sm text-zinc-500 max-w-sm mt-1">
              We couldn't find any posts matching your search. Try adjusting keywords or create a new post.
            </p>
          </div>
        ) : (
          // Post Table / List
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {posts.map((post) => (
              <div 
                key={post._id} 
                className="group flex flex-col sm:flex-row sm:items-center gap-4 p-4 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors"
              >
                {/* Image & Main Info */}
                <div className="flex items-start gap-4 flex-1">
                  <div className="relative w-20 h-14 sm:w-24 sm:h-16 flex-shrink-0 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                    {post.coverImage?.url ? (
                      <img 
                        src={post.coverImage.url} 
                        alt={post.title} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-400">
                        <FileText size={20} />
                      </div>
                    )}
                  </div>
                  
                  <div className="min-w-0">
                    <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 truncate pr-4 group-hover:text-indigo-600 transition-colors">
                      {post.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${
                        post.published 
                          ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30" 
                          : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-900/30"
                      }`}>
                        {post.published ? "Published" : "Draft"}
                      </span>
                      <span className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                        <Calendar size={12} />
                        {post.createdAt ? format(new Date(post.createdAt), 'MMM d, yyyy') : 'N/A'}
                      </span>
                      <span className="text-xs text-zinc-500 dark:text-zinc-400 px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded">
                        {post.category}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stats & Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-6 sm:gap-8 sm:w-auto w-full pt-2 sm:pt-0 pl-24 sm:pl-0 border-t sm:border-t-0 border-zinc-100 dark:border-zinc-800">
                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400">
                    <div className="flex items-center gap-1.5" title="Total Views">
                      <Eye size={16} />
                      <span>{post.stats?.views?.toLocaleString() || 0}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Link 
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      className="p-2 text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                      title="View Live"
                    >
                      <ExternalLink size={18} />
                    </Link>
                    <Link 
                      href={`/admin/editor/${post._id}`} // Assuming this is your edit route
                      className="p-2 text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                      title="Edit Post"
                    >
                      <Edit size={18} />
                    </Link>
                    <button 
                      className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Delete Post"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* --- Pagination Footer --- */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
            <div className="text-sm text-zinc-500">
              Showing page <span className="font-semibold">{pagination.currentPage}</span> of <span className="font-semibold">{pagination.totalPages}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={!pagination.hasPrevPage}
                className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                disabled={!pagination.hasNextPage}
                className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}