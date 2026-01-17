import { BlogService } from "@/services/blog.services";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { 
  ArrowLeft, Calendar, Share2, Bookmark, User, 
  Twitter, Linkedin, Facebook, Link as LinkIcon, List, Terminal
} from "lucide-react";
import ScrollProgress from "../../../components/blog/ScrollProgress";
import ClientInteractions from "../../../components/blog/ClientInteractions"; // Import the new component

// Force dynamic rendering for Next.js 15
export const dynamic = "force-dynamic";

// Fallback constant
const FALLBACK_IMAGE = "/placeholder.jpg";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage(props: PageProps) {
  // 1. Unwrap Params (Next.js 15 requirement)
  const params = await props.params;
  const slug = params.slug;

  // 2. Fetch Data
  const rawPost = await BlogService.getPostBySlug(slug);

  if (!rawPost) {
    return notFound();
  }

  // 3. Serialization
  const post = JSON.parse(JSON.stringify(rawPost));

  // --- SAFE IMAGE LOGIC ---
  let validCoverImage = FALLBACK_IMAGE;
  let coverAlt = post.title;

  if (post.coverImage) {
    if (typeof post.coverImage === "string" && post.coverImage.trim() !== "") {
      validCoverImage = post.coverImage;
    } else if (typeof post.coverImage === "object" && post.coverImage.url) {
      validCoverImage = post.coverImage.url;
      coverAlt = post.coverImage.alt || post.title;
    }
  }

  const rawAuthorImg = post.author?.avatar || post.author?.image;
  const validAuthorImage = (typeof rawAuthorImg === "string" && rawAuthorImg.trim() !== "") ? rawAuthorImg : null;

  return (
    <>
      <ScrollProgress />
      
      <main className="min-h-screen bg-white dark:bg-zinc-950 pb-20 selection:bg-indigo-100 dark:selection:bg-indigo-900/30">
        
        {/* --- 1. STICKY NAV --- */}
        <div className="sticky top-0 z-40 w-full bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-100 dark:border-zinc-800 transition-all">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <Link 
              href="/blog" 
              className="group flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-indigo-600 transition-colors"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20 transition-colors">
                <ArrowLeft size={16} />
              </div>
              <span className="hidden sm:inline">Back</span>
            </Link>

            <div className="flex items-center gap-2">
               {/* --- INSERT CLIENT INTERACTIONS HERE --- */}
               <ClientInteractions postId={post._id} initialLikes={post.likes || 0} />
               
               <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 mx-2" />
               <ActionButton icon={Share2} label="Share" />
               <ActionButton icon={Bookmark} label="Save" />
            </div>
          </div>
        </div>

        {/* --- 2. HERO SECTION --- */}
        <article className="container mx-auto px-4 md:px-6 pt-10 md:pt-16">
          <header className="max-w-4xl mx-auto text-center mb-10 md:mb-16">
            
            {/* Meta Badge */}
            <div className="flex items-center justify-center gap-3 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
               <span className="px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[11px] font-black uppercase tracking-[0.2em] border border-indigo-100 dark:border-indigo-500/20 shadow-sm">
                 {post.tags?.[0] || post.category || "DevLog"}
               </span>
               <span className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400 text-xs font-bold uppercase tracking-widest">
                 <Calendar size={12} className="mb-0.5" />
                 {format(new Date(post.createdAt), "MMMM dd, yyyy")}
               </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter text-slate-900 dark:text-white mb-8 leading-[1.1] animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100 drop-shadow-sm">
              {post.title}
            </h1>

            {/* Author */}
            <div className="flex items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
              <div className="flex items-center gap-3 p-1 pr-4 rounded-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
                <div className="relative w-10 h-10 rounded-full overflow-hidden">
                  {validAuthorImage ? (
                    <Image src={validAuthorImage} alt={post.author?.name || "Author"} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600">
                      <User size={18} />
                    </div>
                  )}
                </div>
                <div className="text-left">
                  <div className="font-bold text-slate-900 dark:text-white text-sm leading-none">
                    {post.author?.name || "Dev Team"}
                  </div>
                  <div className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide mt-1">
                    Senior Engineer
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Hero Image */}
          <div className="relative w-full aspect-[16/10] md:aspect-[21/9] rounded-2xl md:rounded-[2.5rem] overflow-hidden shadow-2xl shadow-indigo-900/10 dark:shadow-black/50 mb-16 animate-in fade-in scale-95 duration-1000 delay-300">
            <Image
              src={validCoverImage}
              alt={coverAlt}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent" />
          </div>

          {/* --- 3. MAIN LAYOUT (3 Columns) --- */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-[1400px] mx-auto relative">
            
            {/* LEFT SIDEBAR: Socials (Desktop) */}
            <div className="hidden lg:flex lg:col-span-1 flex-col items-center gap-6 sticky top-32 h-fit">
               <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 rotate-180" style={{ writingMode: 'vertical-rl' }}>
                 Share
               </div>
               <div className="flex flex-col gap-3">
                 <SocialLink icon={Twitter} />
                 <SocialLink icon={Linkedin} />
                 <SocialLink icon={Facebook} />
                 <SocialLink icon={LinkIcon} />
               </div>
            </div>

            {/* CENTER: Content */}
            <div className="lg:col-span-8 lg:col-start-3">
              <div 
                className="prose prose-lg md:prose-xl dark:prose-invert prose-zinc max-w-none
                prose-headings:font-black prose-headings:tracking-tight prose-headings:text-slate-900 dark:prose-headings:text-white
                prose-p:text-slate-600 dark:prose-p:text-slate-300 prose-p:leading-8 prose-p:font-normal
                prose-a:text-indigo-600 prose-a:no-underline prose-a:font-bold hover:prose-a:text-indigo-500 hover:prose-a:underline
                prose-blockquote:border-l-4 prose-blockquote:border-indigo-500 prose-blockquote:bg-indigo-50/50 dark:prose-blockquote:bg-indigo-900/10 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-xl prose-blockquote:not-italic prose-blockquote:font-medium prose-blockquote:text-slate-700 dark:prose-blockquote:text-slate-200
                prose-pre:bg-[#0d1117] prose-pre:text-gray-100 prose-pre:border prose-pre:border-zinc-800 prose-pre:rounded-2xl prose-pre:shadow-2xl prose-pre:p-0
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
                  {post.tags?.map((tag: string) => (
                    <Link 
                      key={tag} 
                      href={`/blog?category=${tag}`}
                      className="px-4 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 text-sm font-bold text-zinc-600 dark:text-zinc-400 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white transition-all shadow-sm border border-zinc-200 dark:border-zinc-800"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Author Bio Box */}
              <div className="mt-12 p-8 md:p-10 bg-zinc-50 dark:bg-zinc-900/50 rounded-3xl border border-zinc-100 dark:border-zinc-800 flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
                 <div className="relative w-20 h-20 shrink-0 rounded-full overflow-hidden ring-4 ring-white dark:ring-zinc-800 shadow-lg">
                    {validAuthorImage ? (
                      <Image src={validAuthorImage} alt={post.author?.name || "Author"} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center">
                          <User size={28} className="text-zinc-400" />
                      </div>
                    )}
                 </div>
                 <div className="flex-1 space-y-2">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        About {post.author?.name || "The Author"}
                      </h3>
                      <button className="text-xs font-bold text-indigo-600 hover:underline">View All Posts &rarr;</button>
                    </div>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                      {post.author?.bio || "Passionate about building scalable systems and creating intuitive user experiences. Sharing knowledge on web development, modern architecture, and design patterns."}
                    </p>
                 </div>
              </div>
            </div>

            {/* RIGHT SIDEBAR: Table of Contents */}
            <div className="hidden xl:block lg:col-span-2 sticky top-32 h-fit">
              <div className="pl-6 border-l-2 border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-400 mb-6">
                  <List size={14} /> On this page
                </div>
                <ul className="space-y-4 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  <li className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 cursor-pointer">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" /> Article
                  </li>
                  <li className="hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors pl-3.5">
                    Read Post
                  </li>
                </ul>
              </div>
            </div>

          </div>
        </article>
      </main>
    </>
  );
}

// --- SUB-COMPONENTS ---

function ActionButton({ icon: Icon, label }: { icon: any, label: string }) {
  return (
    <button 
      className="p-2 rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-indigo-600 transition-all" 
      title={label}
    >
      <Icon size={18} />
    </button>
  );
}

function SocialLink({ icon: Icon }: { icon: any }) {
  return (
    <button className="w-10 h-10 rounded-full flex items-center justify-center bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-400 hover:text-indigo-600 hover:border-indigo-200 hover:scale-110 hover:shadow-md transition-all">
      <Icon size={16} />
    </button>
  );
}