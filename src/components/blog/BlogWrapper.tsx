"use client";

import { useState } from "react";
import BlogToolbar from "@/components/blog/BlogToolbar";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { ArrowRight, Clock, User, Sparkles } from "lucide-react";

// Define a fallback image constant.
const FALLBACK_IMAGE = "/placeholder.jpg";

export default function BlogWrapper({ posts }: { posts: any[] }) {
  const [view, setView] = useState<"grid" | "list">("grid");

  return (
    <div className="space-y-10">
      {/* Sticky Toolbar */}
      <BlogToolbar view={view} setView={setView} />

      {/* Results Header */}
      <div className="flex items-center justify-between px-2">
        <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">
           {posts.length} Publications
        </span>
        <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800 ml-4" />
      </div>

      {/* --- ANIMATED FEED --- */}
      {posts.length > 0 ? (
        <motion.div 
          layout
          className={cn(
            "grid gap-8",
            // Responsive Columns
            view === "grid" 
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
              : "grid-cols-1 max-w-5xl mx-auto"
          )}
        >
          <AnimatePresence mode="popLayout">
            {posts.map((post) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, type: "spring", stiffness: 100 }}
                key={post._id}
                className="h-full"
              >
                {view === "grid" ? (
                  <GridCard post={post} />
                ) : (
                  <ListCard post={post} />
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}

// ---------------------------------------------------------
// COMPONENT 1: PRO GRID CARD (Fixed Heights)
// ---------------------------------------------------------
function GridCard({ post }: { post: any }) {
  // FIXED LOGIC: Strictly check if it is a string before trimming
  const isValidImage = typeof post.coverImage === "string" && post.coverImage.trim() !== "";
  const imageSrc = isValidImage ? post.coverImage : FALLBACK_IMAGE;

  return (
    <Link 
      href={`/blog/${post.slug}`}
      className="group flex flex-col h-full bg-white dark:bg-zinc-900 rounded-[2rem] overflow-hidden border border-zinc-200 dark:border-zinc-800 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300"
    >
      {/* Image: Fixed Aspect Ratio */}
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        <Image 
          src={imageSrc} 
          alt={post.title || "Blog post"} 
          fill 
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110" 
        />
        {/* Overlay Badge */}
        <div className="absolute top-4 left-4">
           <span className="px-3 py-1 bg-white/90 dark:bg-black/80 backdrop-blur text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 rounded-full shadow-sm">
             {post.tags?.[0] || "Article"}
           </span>
        </div>
      </div>

      {/* Body: Flex Grow to fill height */}
      <div className="flex flex-col flex-1 p-6 md:p-8">
        {/* Meta */}
        <div className="flex items-center gap-3 text-xs text-zinc-400 font-medium mb-3">
           <span className="flex items-center gap-1"><Clock size={12} /> {post.readTime || "5"} min</span>
           <span className="w-1 h-1 rounded-full bg-zinc-300" />
           <span>{format(new Date(post.createdAt), "MMM d, yyyy")}</span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3 line-clamp-2 leading-tight group-hover:text-indigo-600 transition-colors">
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed line-clamp-3 mb-6 flex-1">
          {post.excerpt}
        </p>

        {/* Footer */}
        <div className="mt-auto pt-6 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-sm font-bold">
           <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
              <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-zinc-800 flex items-center justify-center text-[10px] text-indigo-600">
                <User size={12} />
              </div>
              {post.author?.name ? post.author.name.split(' ')[0] : "Editor"}
           </div>
           
           <span className="flex items-center gap-1 text-indigo-600 group-hover:translate-x-1 transition-transform">
             Read <ArrowRight size={14} />
           </span>
        </div>
      </div>
    </Link>
  );
}

// ---------------------------------------------------------
// COMPONENT 2: PRO LIST CARD (Responsive Row)
// ---------------------------------------------------------
function ListCard({ post }: { post: any }) {
  // FIXED LOGIC: Strictly check if it is a string before trimming
  const isValidImage = typeof post.coverImage === "string" && post.coverImage.trim() !== "";
  const imageSrc = isValidImage ? post.coverImage : FALLBACK_IMAGE;

  return (
    <Link 
      href={`/blog/${post.slug}`}
      className="group flex flex-col md:flex-row gap-6 p-5 bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500/30 transition-all hover:shadow-xl hover:shadow-indigo-500/5 items-stretch"
    >
      {/* Image: Fixed Width on Desktop */}
      <div className="relative w-full md:w-72 aspect-video md:aspect-[4/3] rounded-2xl overflow-hidden shrink-0 bg-zinc-100 dark:bg-zinc-800">
        <Image 
          src={imageSrc} 
          alt={post.title || "Blog post"} 
          fill 
          sizes="(max-width: 768px) 100vw, 300px"
          className="object-cover group-hover:scale-105 transition-transform duration-500" 
        />
      </div>

      {/* Content */}
      <div className="flex flex-col justify-center py-2 flex-1">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1 rounded-full">
             {post.tags?.[0] || "Blog"}
          </span>
          <span className="text-xs text-zinc-400 font-medium">
             {format(new Date(post.createdAt), "MMM dd, yyyy")}
          </span>
        </div>

        <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-3 group-hover:text-indigo-600 transition-colors leading-tight">
          {post.title}
        </h3>
        
        <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed mb-6 line-clamp-2 md:line-clamp-3">
          {post.excerpt}
        </p>

        <div className="mt-auto flex items-center gap-4 text-sm font-bold text-zinc-900 dark:text-white">
          <div className="flex items-center gap-2">
             <div className="w-5 h-5 rounded-full bg-zinc-200 dark:bg-zinc-800" /> 
             {post.author?.name || "Admin"}
          </div>
          <span className="w-1 h-1 bg-zinc-300 rounded-full" />
          <span className="text-zinc-400 font-normal">{post.readTime || "5"} min read</span>
        </div>
      </div>
    </Link>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-[3rem] bg-zinc-50/50 dark:bg-zinc-900/50">
      <div className="w-20 h-20 bg-white dark:bg-zinc-800 rounded-3xl flex items-center justify-center mb-6 shadow-sm">
        <Sparkles className="text-zinc-300" size={32} />
      </div>
      <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">No matches found</h3>
      <p className="text-zinc-500 max-w-sm mt-2 mx-auto">
        We couldn't find any posts matching your current filters. Try searching for something else.
      </p>
    </div>
  );
}