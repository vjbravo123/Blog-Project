"use client";

import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform, useMotionValue, useMotionTemplate, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { 
  ArrowUpRight, 
  Search, 
  Menu, 
  X,
  Clock, 
  Terminal,
  Mail,
  ChevronRight,
  Hash
} from "lucide-react";

// --- DATA CONFIGURATION ---
const BLOG_NAV = [
  { name: "Engineering", href: "#" },
  { name: "System Design", href: "#" },
  { name: "React Patterns", href: "#" },
  { name: "Snippets", href: "#" },
];

const FEATURED_STORY = {
  title: "Scaling Real-time Sockets: The V-Chat Architecture",
  excerpt: "A technical deep dive into handling 10k+ concurrent connections using Socket.io, Node.js clusters, and Redis adapters.",
  category: "System Design",
  date: "Jan 06, 2026",
  readTime: "12 min read",
  image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2670&auto=format&fit=crop",
  tags: ["Node.js", "WebSockets", "Redis"]
};

const SIDE_STORIES = [
  {
    id: 1,
    category: "Backend",
    title: "Attendance Manager: Automating Complex PDF Reports",
    date: "Jan 02",
    image: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: 2,
    category: "Performance",
    title: "YouTube Clone: Optimizing Video Stream Buffering",
    date: "Dec 28",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop"
  }
];

// --- COMPONENTS ---

const ShinyButton = ({ text, icon: Icon, onClick, className = "" }: any) => (
  <button onClick={onClick} className={`group relative px-6 py-3 rounded-full bg-zinc-900 overflow-hidden border border-zinc-800 transition-all hover:border-zinc-600 ${className}`}>
    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
    <span className="relative flex items-center justify-center gap-2 text-sm font-medium text-zinc-100">
      {text} {Icon && <Icon size={16} />}
    </span>
    <style jsx>{`
      @keyframes shimmer { 100% { transform: translateX(100%); } }
      .group-hover\\:animate-shimmer { animation: shimmer 1.5s infinite; }
    `}</style>
  </button>
);

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  return (
    <>
      <div className={`fixed left-0 right-0 z-50 flex justify-center transition-all duration-300 ${scrolled ? 'top-2' : 'top-4 md:top-6'}`}>
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`flex items-center justify-between w-[95%] max-w-5xl backdrop-blur-xl border rounded-full px-4 transition-all duration-300 ${
            scrolled ? 'bg-black/90 border-white/10 py-3 shadow-2xl shadow-black/50' : 'bg-black/50 border-white/5 py-2 md:py-3'
          }`}
        >
          {/* Logo Section */}
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-bold text-xs text-white shadow-lg shadow-indigo-500/30">VJ</div>
             <div className="flex flex-col">
               <span className="text-sm font-bold text-zinc-100 leading-none">The Dev Chronicles</span>
               <span className="text-[10px] text-zinc-500 hidden sm:block">Engineering Journal</span>
             </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1 bg-white/5 rounded-full px-2 py-1 border border-white/5 mx-4">
             {BLOG_NAV.map(link => (
               <a key={link.name} href={link.href} className="px-4 py-1.5 text-xs font-medium text-zinc-400 hover:text-white hover:bg-white/5 rounded-full transition-all">
                 {link.name}
               </a>
             ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <button className="hidden sm:flex p-2.5 rounded-full hover:bg-white/10 transition-colors text-zinc-400 hover:text-white">
              <Search size={16} />
            </button>
            <button className="hidden sm:block px-5 py-2 rounded-full bg-white text-black text-xs font-bold hover:bg-zinc-200 transition-colors">
              Subscribe
            </button>
            
            {/* Mobile Toggle Button */}
            <button 
              onClick={() => setIsOpen(true)}
              className="md:hidden p-2 text-zinc-100 bg-zinc-800/80 rounded-full border border-zinc-700 hover:bg-zinc-700 active:scale-95 transition-all"
            >
              <Menu size={18} />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Mobile Full Screen Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-[#050505] flex flex-col p-6 md:hidden overflow-hidden"
          >
            {/* Mobile Header */}
            <div className="flex justify-between items-center mb-10 mt-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-bold text-xs text-white">VJ</div>
                <span className="font-bold text-white">Menu</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            
            {/* Mobile Links */}
            <div className="flex flex-col gap-6 pl-2">
              {BLOG_NAV.map((link, i) => (
                <motion.a 
                  key={link.name}
                  href="#"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 + (i * 0.05) }}
                  className="text-3xl font-bold text-zinc-400 hover:text-white transition-colors flex items-center justify-between group"
                >
                  {link.name}
                  <ChevronRight size={20} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-indigo-500" />
                </motion.a>
              ))}
            </div>

            {/* Mobile Footer */}
            <div className="mt-auto pb-8 border-t border-zinc-800 pt-8">
              <h4 className="text-sm text-zinc-500 mb-4 font-medium uppercase tracking-wider">Updates</h4>
              <div className="flex gap-2 w-full">
                <input type="email" placeholder="Email address" className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 w-full text-zinc-200 outline-none focus:border-indigo-500 placeholder:text-zinc-600" />
                <button className="bg-indigo-600 active:bg-indigo-700 rounded-xl px-4 text-white flex items-center justify-center"><ArrowUpRight /></button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default function Hero() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 150]); // Adjusted parallax for smoother mobile feel
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    let { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    // Added overflow-x-hidden here to kill the horizontal scrollbar
    <section 
      onMouseMove={handleMouseMove}
      className="relative w-full min-h-screen bg-[#050505] text-white selection:bg-indigo-500/30 font-sans overflow-x-hidden"
    >
      <Navbar />

      {/* BACKGROUND EFFECTS (Fixed & Contained) */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
        <motion.div
          className="absolute -inset-[100px] opacity-20 hidden md:block"
          style={{
            background: useMotionTemplate`radial-gradient(600px circle at ${mouseX}px ${mouseY}px, rgba(79, 70, 229, 0.15), transparent 80%)`,
          }}
        />
        {/* Adjusted blob sizes for mobile to prevent overflow issues */}
        <div className="absolute top-[-10%] left-[-10%] w-[80vw] md:w-[50vw] h-[80vw] md:h-[50vw] bg-indigo-600/10 rounded-full blur-[80px] md:blur-[100px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[80vw] md:w-[50vw] h-[80vw] md:h-[50vw] bg-blue-600/10 rounded-full blur-[80px] md:blur-[100px]" />
      </div>

      {/* MAIN CONTENT */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 md:pt-40 pb-12">
        
        {/* HERO TITLE */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12 max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 bg-zinc-900/50 border border-zinc-800 rounded-full backdrop-blur-md">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
            <span className="text-[10px] md:text-xs font-mono text-zinc-400 uppercase tracking-widest">
              Issue #42 • Full Stack Engineering
            </span>
          </div>
          {/* Responsive Text Sizing: clamp added via standard Tailwind classes */}
          <h1 className="text-4xl sm:text-6xl lg:text-8xl font-bold tracking-tight leading-[1] md:leading-[0.95] text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/50">
            Code as <br className="hidden md:block" />
            <span className="font-serif italic font-light text-zinc-500">Creative</span> Architecture.
          </h1>
        </motion.div>

        {/* BENTO GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
          
          {/* FEATURED STORY (Span 8) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="md:col-span-2 lg:col-span-8 relative group rounded-3xl overflow-hidden border border-white/10 bg-zinc-900 cursor-pointer min-h-[450px] md:min-h-[500px]"
          >
            {/* Constrained Parallax Container */}
            <div className="absolute inset-0 w-full h-full overflow-hidden">
               <motion.div style={{ y: y1 }} className="relative w-full h-[120%]">
                 <Image 
                   src={FEATURED_STORY.image} 
                   alt="Featured" 
                   fill 
                   className="object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-700" 
                   priority
                 />
               </motion.div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
            
            <div className="absolute inset-0 p-6 md:p-12 flex flex-col justify-end items-start">
               <div className="flex flex-wrap gap-2 mb-4">
                  {FEATURED_STORY.tags.map(tag => (
                    <span key={tag} className="px-2.5 py-1 bg-white/10 backdrop-blur-md border border-white/10 rounded-lg text-[10px] uppercase font-bold tracking-wider text-indigo-300">
                      {tag}
                    </span>
                  ))}
               </div>
               
               <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4 group-hover:text-indigo-200 transition-colors">
                 {FEATURED_STORY.title}
               </h2>
               
               <p className="hidden sm:block text-zinc-300 text-sm md:text-lg max-w-2xl mb-8 line-clamp-2">
                 {FEATURED_STORY.excerpt}
               </p>

               <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 border-t border-white/10 pt-6 w-full">
                  <div className="flex gap-4 md:gap-6 w-full sm:w-auto justify-between sm:justify-start">
                    <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                        <Clock size={14} /> {FEATURED_STORY.readTime}
                    </div>
                    <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                        <Terminal size={14} /> {FEATURED_STORY.date}
                    </div>
                  </div>
                  <div className="w-full sm:w-auto sm:ml-auto">
                    <ShinyButton text="Read Case Study" icon={ArrowUpRight} className="w-full justify-center" />
                  </div>
               </div>
            </div>
          </motion.div>

          {/* SIDEBAR (Span 4) */}
          <div className="md:col-span-2 lg:col-span-4 flex flex-col gap-6">
            
            {/* Newsletter Box */}
            <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.4 }}
               className="flex-1 rounded-3xl bg-zinc-900 border border-white/10 p-6 flex flex-col justify-center relative overflow-hidden min-h-[250px]"
            >
               <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl" />
               <div className="relative z-10">
                 <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                   <Mail className="text-indigo-400" size={18} /> 
                   Weekly Digest
                 </h3>
                 <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                   Join 2,000+ engineers reading about system design and frontend patterns.
                 </p>
                 <div className="flex flex-col gap-3">
                    <div className="relative">
                      <input className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors" placeholder="your@email.com" />
                    </div>
                    <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold py-3 rounded-xl transition-all shadow-lg shadow-indigo-900/20">
                        Subscribe
                    </button>
                 </div>
               </div>
            </motion.div>

            {/* Side Stories */}
            {SIDE_STORIES.map((story, i) => (
              <motion.div 
                key={story.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + (i * 0.1) }}
                className="group relative rounded-3xl bg-[#0a0a0a] border border-white/10 p-4 flex gap-4 items-center cursor-pointer hover:bg-white/5 transition-colors"
              >
                 <div className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-zinc-800">
                    <Image src={story.image} alt={story.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                 </div>
                 <div className="flex flex-col min-w-0 pr-2">
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-1">
                      {story.category}
                    </span>
                    <h4 className="text-sm font-bold text-zinc-100 leading-snug mb-1 group-hover:text-indigo-300 transition-colors line-clamp-2">
                      {story.title}
                    </h4>
                    <span className="text-[10px] text-zinc-500 font-mono">{story.date}</span>
                 </div>
                 <ChevronRight className="ml-auto text-zinc-600 group-hover:text-white transition-colors opacity-0 group-hover:opacity-100 hidden sm:block" size={16} />
              </motion.div>
            ))}

          </div>
        </div>

        {/* SCROLLING MARQUEE (Contained Overflow) */}
        <div className="mt-16 w-full border-t border-white/10 pt-8 overflow-hidden opacity-50 relative">
           {/* Fade edges */}
           <div className="absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-[#050505] to-transparent z-10" />
           <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-[#050505] to-transparent z-10" />
           
           <div className="flex gap-12 whitespace-nowrap animate-marquee">
              {[...Array(2)].map((_, i) => (
                 <React.Fragment key={i}>
                    {["REACT.JS", "SYSTEM DESIGN", "NEXT.JS 15", "NODE.JS", "PERFORMANCE"].map(tech => (
                       <div key={tech} className="flex items-center gap-12">
                          <span className="text-4xl md:text-6xl font-black text-transparent stroke-text">
                              {tech}
                          </span>
                          <Hash className="text-zinc-800" size={32} />
                       </div>
                    ))}
                 </React.Fragment>
              ))}
           </div>
        </div>

      </div>

      <style jsx global>{`
        .stroke-text { -webkit-text-stroke: 1px rgba(255, 255, 255, 0.2); color: transparent; }
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { animation: marquee 30s linear infinite; }
      `}</style>
    </section>
  );
}