import { BlogService } from "@/services/blog.services";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { ArrowRight, Clock, User, Sparkles, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";

// --- Type Definition ---
interface BlogPost {
  _id: string | number;
  title: string;
  slug: string;
  excerpt?: string;
  coverImage?: string;
  createdAt: string | Date;
  author?: {
    name: string;
    avatar?: string;
  };
  tags?: string[];
  readTime?: string | number;
}

export default async function FeaturedPosts() {
  // Fetch data
  const posts: BlogPost[] = await BlogService.getFeaturedPosts();

  // Safety Check: No data
  if (!posts || posts.length === 0) return null;

  // Destructure: First is Main, rest are Side
  const [mainPost, ...sidePosts] = posts;
  const hasSidePosts = sidePosts.length > 0;

  // Helper for safe dates
  const formatDate = (date: string | Date) => {
    try {
      return format(new Date(date), "MMM dd, yyyy");
    } catch (e) {
      return "";
    }
  };

  return (
    <section className="w-full py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* --- SECTION HEADER --- */}
        <div className="flex items-center gap-3 mb-8">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600 text-white shadow-lg shadow-indigo-500/30">
            <Sparkles size={16} />
          </div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Editor's Choice
          </h2>
        </div>

        {/* --- GRID LAYOUT --- */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
          
          {/* --- MAIN SPOTLIGHT CARD (7 Columns) --- */}
          <div className={cn("flex flex-col", hasSidePosts ? "lg:col-span-7" : "lg:col-span-12")}>
            <Link 
              href={`/blog/${mainPost.slug}`} 
              className="group relative flex-1 block w-full overflow-hidden rounded-[2rem] shadow-2xl shadow-indigo-900/10 dark:shadow-black/50"
            >
              {/* Image Container */}
              {/* Mobile: 350px height, Desktop: 600px height or auto fill */}
              <div className="relative w-full h-[350px] sm:h-[450px] lg:h-[600px]">
                <Image
                  src={mainPost.coverImage || "/placeholder.jpg"}
                  alt={mainPost.title}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 50vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                
                {/* Advanced Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent opacity-90 transition-opacity group-hover:opacity-80" />
              </div>

              {/* Content Overlay */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8 md:p-10">
                
                {/* Top Badge (Optional) */}
                <div className="absolute top-6 left-6 sm:top-8 sm:left-8">
                   <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-xs font-bold text-white uppercase tracking-wider shadow-sm">
                      {mainPost.tags?.[0] || "Featured"}
                   </span>
                </div>

                <div className="transform transition-transform duration-500 group-hover:-translate-y-2">
                  {/* Meta Info */}
                  <div className="flex items-center gap-3 text-slate-300 text-xs sm:text-sm font-medium mb-3">
                    <span className="flex items-center gap-1.5">
                      <Clock size={14} className="text-indigo-400" />
                      {mainPost.readTime || "5"} min read
                    </span>
                    <span className="w-1 h-1 bg-slate-500 rounded-full" />
                    <span>{formatDate(mainPost.createdAt)}</span>
                  </div>

                  {/* Title */}
                  <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-[1.1] tracking-tight mb-4 drop-shadow-lg">
                    {mainPost.title}
                  </h2>

                  {/* Excerpt */}
                  <p className="hidden sm:block text-slate-300 text-sm md:text-base leading-relaxed max-w-2xl mb-6 line-clamp-2">
                    {mainPost.excerpt}
                  </p>

                  {/* CTA */}
                  <div className="flex items-center text-white font-bold text-sm sm:text-base group/btn w-fit">
                    <span className="border-b-2 border-indigo-500 pb-0.5 group-hover/btn:border-white transition-colors">
                      Read Full Story
                    </span>
                    <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/btn:translate-x-2" />
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* --- SIDE POSTS LIST (5 Columns) --- */}
          {hasSidePosts && (
            <div className="flex flex-col gap-6 lg:col-span-5 h-full">
              {sidePosts.map((post, index) => (
                <Link 
                  key={post._id.toString()} 
                  href={`/blog/${post.slug}`}
                  className="group relative flex items-stretch gap-4 p-3 bg-white dark:bg-zinc-900/50 rounded-2xl border border-slate-100 dark:border-zinc-800 transition-all duration-300 hover:border-indigo-200 dark:hover:border-indigo-900/50 hover:bg-slate-50 dark:hover:bg-zinc-900 hover:shadow-lg hover:shadow-indigo-500/5"
                >
                  {/* Thumbnail Image */}
                  <div className="relative w-28 sm:w-32 lg:w-40 shrink-0 aspect-square rounded-xl overflow-hidden bg-slate-200 dark:bg-zinc-800">
                    <Image
                      src={post.coverImage || "/placeholder.jpg"}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 120px, 160px"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  
                  {/* Content Side */}
                  <div className="flex flex-col justify-center py-1 pr-2 w-full">
                    {/* Tag */}
                    <div className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-2">
                      {post.tags?.[0] || "News"}
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug line-clamp-2 mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {post.title}
                    </h3>
                    
                    {/* Footer Meta */}
                    <div className="mt-auto pt-2 flex items-center justify-between border-t border-slate-100 dark:border-zinc-800/50">
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-zinc-500 font-semibold">
                        <User size={12} />
                        <span className="truncate max-w-[80px]">
                           {post.author?.name ? post.author.name.split(' ')[0] : "Admin"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 dark:text-zinc-600">
                         <CalendarDays size={12} />
                         {formatDate(post.createdAt)}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

        </div>
      </div>
    </section>
  );
}