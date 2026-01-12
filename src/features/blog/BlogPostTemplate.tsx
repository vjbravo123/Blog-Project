"use client";

import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { 
  ArrowLeft, Calendar, Share2, Bookmark, User, 
  Twitter, Linkedin, Facebook, Link as LinkIcon, List, Terminal
} from "lucide-react";

// Mock ScrollProgress for preview (or import your actual one)
const ScrollProgress = () => (
  <div className="fixed top-0 left-0 h-1 bg-indigo-600 z-50 w-full animate-pulse" />
);

export interface BlogPostData {
  title: string;
  content: string; // HTML string
  coverImage?: string;
  tags?: string[];
  createdAt?: string | Date;
  readTime?: number;
  author?: {
    name: string;
    avatar?: string;
    bio?: string;
  };
}

interface TemplateProps {
  post: BlogPostData;
  onBack?: () => void; // Optional: For closing preview in CMS
  isPreview?: boolean;
}

export default function BlogPostTemplate({ post, onBack, isPreview = false }: TemplateProps) {
  
  // Default values for preview
  const dateStr = post.createdAt ? new Date(post.createdAt) : new Date();
  const authorName = post.author?.name || "You (Author)";
  
  return (
    <div className={`bg-white dark:bg-zinc-950 min-h-screen ${isPreview ? 'z-[100] relative' : ''}`}>
      <ScrollProgress />
      
      <main className="pb-20 selection:bg-indigo-100 dark:selection:bg-indigo-900/30">
        
        {/* --- STICKY NAV --- */}
        <div className="sticky top-0 z-40 w-full bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-100 dark:border-zinc-800">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            {/* If Preview, clicking back closes preview. If Real Page, links to /blog */}
            <button 
              onClick={onBack}
              className="group flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-indigo-600 transition-colors"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20 transition-colors">
                <ArrowLeft size={16} />
              </div>
              <span className="hidden sm:inline">{isPreview ? "Close Preview" : "Back"}</span>
            </button>

            <div className="flex items-center gap-2">
               <span className="text-xs font-medium text-zinc-400 mr-2 hidden md:inline">
                 {post.readTime || "5"} min read
               </span>
               <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 hidden md:block mr-2" />
               <button className="p-2 rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"><Share2 size={18} /></button>
               <button className="p-2 rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"><Bookmark size={18} /></button>
            </div>
          </div>
        </div>

        {/* --- HERO SECTION --- */}
        <article className="container mx-auto px-4 md:px-6 pt-10 md:pt-16">
          <header className="max-w-4xl mx-auto text-center mb-10 md:mb-16">
            
            {/* Meta Badge */}
            <div className="flex items-center justify-center gap-3 mb-8">
               <span className="px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[11px] font-black uppercase tracking-[0.2em] border border-indigo-100 dark:border-indigo-500/20 shadow-sm">
                 {post.tags?.[0] || "Draft"}
               </span>
               <span className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400 text-xs font-bold uppercase tracking-widest">
                 <Calendar size={12} className="mb-0.5" />
                 {format(dateStr, "MMMM dd, yyyy")}
               </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter text-slate-900 dark:text-white mb-8 leading-[1.1] drop-shadow-sm">
              {post.title || "Untitled Post"}
            </h1>

            {/* Author */}
            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center gap-3 p-1 pr-4 rounded-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                  {post.author?.avatar ? (
                    <Image src={post.author.avatar} alt="Author" fill className="object-cover" />
                  ) : (
                    <User size={18} className="text-indigo-600" />
                  )}
                </div>
                <div className="text-left">
                  <div className="font-bold text-slate-900 dark:text-white text-sm leading-none">
                    {authorName}
                  </div>
                  <div className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide mt-1">
                    Senior Engineer
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Hero Image */}
          <div className="relative w-full aspect-[16/10] md:aspect-[21/9] rounded-2xl md:rounded-[2.5rem] overflow-hidden shadow-2xl shadow-indigo-900/10 dark:shadow-black/50 mb-16 bg-zinc-100 dark:bg-zinc-900">
            {post.coverImage ? (
              <img
                src={post.coverImage}
                alt={post.title}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-zinc-400 text-sm font-medium">No Cover Image</div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent" />
          </div>

          {/* --- MAIN LAYOUT --- */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-[1400px] mx-auto relative">
            
            {/* LEFT SIDEBAR */}
            <div className="hidden lg:flex lg:col-span-1 flex-col items-center gap-6 sticky top-32 h-fit">
               <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 rotate-180" style={{ writingMode: 'vertical-rl' }}>Share</div>
               <div className="flex flex-col gap-3">
                 <button className="w-10 h-10 rounded-full flex items-center justify-center bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-400 hover:text-indigo-600 hover:scale-110 transition-all"><Twitter size={16} /></button>
                 <button className="w-10 h-10 rounded-full flex items-center justify-center bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-400 hover:text-indigo-600 hover:scale-110 transition-all"><Linkedin size={16} /></button>
               </div>
            </div>

            {/* CENTER CONTENT */}
            <div className="lg:col-span-8 lg:col-start-3">
              <div 
                className="prose prose-lg md:prose-xl dark:prose-invert prose-zinc max-w-none
                prose-headings:font-black prose-headings:tracking-tight prose-headings:text-slate-900 dark:prose-headings:text-white
                prose-p:text-slate-600 dark:prose-p:text-slate-300 prose-p:leading-8 prose-p:font-normal
                prose-a:text-indigo-600 prose-a:no-underline prose-a:font-bold hover:prose-a:text-indigo-500 hover:prose-a:underline
                prose-blockquote:border-l-4 prose-blockquote:border-indigo-500 prose-blockquote:bg-indigo-50/50 dark:prose-blockquote:bg-indigo-900/10 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-xl prose-blockquote:not-italic prose-blockquote:font-medium prose-blockquote:text-slate-700 dark:prose-blockquote:text-slate-200
                prose-pre:bg-[#0d1117] prose-pre:text-gray-100 prose-pre:border prose-pre:border-zinc-800 prose-pre:rounded-2xl prose-pre:shadow-2xl prose-pre:p-4
                prose-code:text-indigo-600 dark:prose-code:text-indigo-400 prose-code:bg-indigo-50 dark:prose-code:bg-indigo-900/20 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:font-mono prose-code:text-[0.9em] prose-code:font-semibold prose-code:before:content-none prose-code:after:content-none
                prose-img:rounded-[2rem] prose-img:shadow-xl prose-img:border prose-img:border-zinc-100 dark:prose-img:border-zinc-800 prose-img:w-full prose-img:my-8"
              >
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              </div>

              {/* Tags Footer */}
              <div className="mt-16 pt-8 border-t border-zinc-100 dark:border-zinc-800">
                <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-4 flex items-center gap-2">
                  <Terminal size={14} /> Related Topics
                </h4>
                <div className="flex flex-wrap gap-2">
                  {post.tags?.map((tag) => (
                    <span key={tag} className="px-4 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 text-sm font-bold text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT SIDEBAR */}
            <div className="hidden xl:block lg:col-span-2 sticky top-32 h-fit">
              <div className="pl-6 border-l-2 border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-400 mb-6">
                  <List size={14} /> On this page
                </div>
                <ul className="space-y-4 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  <li className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" /> Start
                  </li>
                </ul>
              </div>
            </div>

          </div>
        </article>
      </main>
    </div>
  );
}