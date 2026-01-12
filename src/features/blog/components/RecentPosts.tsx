import { BlogService } from "@/services/blog.services";
import BlogCard from "@/components/shared/BlogCard";
import { Newspaper, ArrowRight, Sparkles, LayoutGrid, Layers } from "lucide-react";
import Link from "next/link";

// --- Types ---
interface BlogPost {
  _id: string | number;
  title: string;
  slug: string;
  [key: string]: any; 
}

interface RecentPostsProps {
  category?: string;
  className?: string;
}

export default async function RecentPosts({ category, className = "" }: RecentPostsProps) {
  const posts: BlogPost[] = await BlogService.getRecentPosts(category);
  const hasPosts = posts && posts.length > 0;

  // --- EMPTY STATE ---
  if (!hasPosts) {
    return (
      <div className={`relative w-full px-4 md:px-6 ${className}`}>
        <div className="relative overflow-hidden flex flex-col items-center justify-center min-h-[400px] rounded-[2.5rem] border border-dashed border-slate-200 dark:border-zinc-800 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md text-center p-8 mx-auto max-w-4xl">
          <div className="absolute top-0 right-0 p-12 opacity-[0.03] dark:opacity-[0.05] uppercase font-black text-6xl md:text-8xl select-none rotate-12 pointer-events-none">
            Empty
          </div>
          
          <div className="relative group">
            <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 group-hover:opacity-30 transition-opacity rounded-full" />
            <div className="relative w-20 h-20 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-zinc-800 dark:to-zinc-900 rounded-3xl flex items-center justify-center shadow-lg border border-white/50 dark:border-zinc-700">
              <Newspaper className="text-slate-400 dark:text-zinc-500" size={36} />
            </div>
          </div>

          <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mt-6">
            No posts found
          </h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-xs mt-3 leading-relaxed">
            We couldn't find any articles in the <span className="text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded-md">"{category || 'General'}"</span> category.
          </p>
        </div>
      </div>
    );
  }

  return (
    // FIX: overflow-hidden prevents the background blobs from causing scrollbars
    <section className={`relative w-full py-12 overflow-hidden ${className}`}>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10 space-y-12">
        {/* --- SECTION HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-extrabold text-[11px] uppercase tracking-[0.25em] bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1.5 rounded-full w-fit border border-indigo-100 dark:border-indigo-800/30">
              <Sparkles size={12} className="animate-pulse" /> 
              Recent Insights
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter text-slate-900 dark:text-white capitalize">
              {category ? (
                <span>{category} <span className="text-slate-300 dark:text-zinc-700">Feed</span></span>
              ) : (
                <span>Latest <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">Stories</span></span>
              )}
            </h2>
          </div>
          
          <div className="hidden sm:flex items-center gap-2.5 px-4 py-2 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-sm border border-slate-200 dark:border-zinc-800 rounded-2xl text-xs font-bold text-slate-600 dark:text-zinc-400 shadow-sm hover:scale-105 transition-transform cursor-default">
            <LayoutGrid size={15} className="text-indigo-500" />
            {posts.length} {posts.length === 1 ? 'Article' : 'Articles'}
          </div>
        </div>

        {/* --- RESPONSIVE GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
          {posts.map((post, index) => {
            const isFeatured = index === 0;
            return (
              <div 
                key={post._id.toString()} 
                className={`
                  group relative flex flex-col
                  ${isFeatured ? 'md:col-span-2 lg:col-span-2' : 'col-span-1'}
                `}
              >
                {/* Hover Effect - Adjusted inset to prevent overflow */}
                <div className="absolute -inset-2 md:-inset-3 bg-gradient-to-r from-slate-100 to-slate-50 dark:from-zinc-800/50 dark:to-zinc-900/50 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-all duration-500 -z-10 scale-95 group-hover:scale-100" />

                {/* Numbering */}
                <div className="hidden md:block absolute -right-2 -top-4 font-black text-6xl text-slate-100 dark:text-zinc-900 opacity-0 group-hover:opacity-100 transition-all duration-500 -z-10 select-none translate-y-4 group-hover:translate-y-0">
                    {index + 1 < 10 ? `0${index + 1}` : index + 1}
                </div>

                <div className="h-full transform transition-transform duration-500 group-hover:-translate-y-1">
                  <BlogCard post={post} /> 
                </div>
              </div>
            );
          })}
        </div>
        
        {/* --- FOOTER --- */}
        <div className="flex flex-col items-center justify-center pt-8 md:pt-12">
          <Link 
              href="/blog" 
              className="group relative inline-flex items-center gap-3 px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full font-bold text-sm transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/20 active:scale-95 overflow-hidden"
          >
              <span className="relative z-10 flex items-center gap-2">
                Explore All Posts
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-in-out z-0" />
          </Link>
          
          <div className="flex items-center gap-2 mt-6 text-[10px] font-bold text-slate-400 dark:text-zinc-600 uppercase tracking-widest">
              <Layers size={12} />
              Showing latest entries
          </div>
        </div>
      </div>

      {/* --- AMBIENT BACKGROUND --- */}
      {/* Fixed: Width constrained to 100% and overflow hidden on parent prevents scrolling */}
      <div className="absolute inset-0 -z-20 w-full h-full pointer-events-none">
         <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-indigo-400/20 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen opacity-40 animate-blob -translate-x-1/2" />
         <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-purple-400/20 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen opacity-40 animate-blob animation-delay-2000 translate-x-1/2" />
         <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-pink-400/20 blur-[100px] rounded-full mix-blend-multiply dark:mix-blend-screen opacity-40 animate-blob animation-delay-4000" />
      </div>
    </section>
  );
}