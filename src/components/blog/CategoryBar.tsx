"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Cpu, 
  Palette, 
  Code2, 
  BookOpen, 
  Briefcase, 
  Coffee 
} from "lucide-react";

const CATEGORIES = [
  { name: "All", icon: LayoutDashboard, color: "text-zinc-400", bg: "bg-zinc-500" },
  { name: "Tech", icon: Cpu, color: "text-blue-500", bg: "bg-blue-500" },
  { name: "Design", icon: Palette, color: "text-pink-500", bg: "bg-pink-500" },
  { name: "Coding", icon: Code2, color: "text-emerald-500", bg: "bg-emerald-500" },
  { name: "Tutorial", icon: BookOpen, color: "text-amber-500", bg: "bg-amber-500" },
  { name: "Career", icon: Briefcase, color: "text-purple-500", bg: "bg-purple-500" },
  { name: "Lifestyle", icon: Coffee, color: "text-orange-500", bg: "bg-orange-500" },
];

export default function CategoryBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category") || "All";
  const [hovered, setHovered] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleCategoryClick = (category: string) => {
    const params = new URLSearchParams(searchParams);
    if (category === "All") {
      params.delete("category");
    } else {
      params.set("category", category.toLowerCase());
    }
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="w-full py-6 md:py-10 flex flex-col items-center">
      {/* 
         FIX 1: Removed 'overflow-hidden' from the parent so glows don't get cut hard.
         FIX 2: Added 'pb-12' and 'pt-4' to padding. This creates internal space 
                inside the scroll container for the tooltips (-bottom-8) to show 
                without being clipped by the overflow-x-auto.
      */}
      <div 
        ref={scrollContainerRef}
        className="w-full overflow-x-auto no-scrollbar px-4 pb-12 pt-4"
      >
        {/* 
           FIX 3: Changed 'justify-center' to 'mx-auto w-max'. 
           This ensures it centers if there is space, but aligns left if 
           scrolling is needed (preventing the first item from being cut off on mobile).
        */}
        <nav 
          className="mx-auto flex w-max items-center gap-2 p-2 rounded-3xl bg-zinc-900/60 backdrop-blur-xl border border-white/10 shadow-2xl"
          onMouseLeave={() => setHovered(null)}
        >
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory.toLowerCase() === cat.name.toLowerCase();
            const isHovered = hovered === cat.name;
            const Icon = cat.icon;

            return (
              <button
                key={cat.name}
                onClick={() => handleCategoryClick(cat.name)}
                onMouseEnter={() => setHovered(cat.name)}
                className={cn(
                  "relative group flex flex-col items-center justify-center flex-shrink-0 rounded-2xl transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
                  // Sizing
                  "w-12 h-12 md:w-16 md:h-16",
                  isActive ? "bg-white/10" : "hover:bg-white/5"
                )}
              >
                {/* 1. ACTIVE/HOVER PILL BACKGROUND */}
                <AnimatePresence>
                  {(isActive || isHovered) && (
                    <motion.div
                      layoutId="dock-pill"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                      className="absolute inset-0 z-0 rounded-2xl border border-white/5 bg-white/5"
                    />
                  )}
                </AnimatePresence>

                {/* 2. ICON */}
                <motion.div
                  animate={{ 
                    y: (isActive || isHovered) ? -3 : 0,
                    scale: (isActive || isHovered) ? 1.1 : 1
                  }}
                  className={cn(
                    "relative z-10 transition-colors duration-300",
                    isActive ? cat.color : "text-zinc-500 group-hover:text-zinc-300"
                  )}
                >
                  <Icon strokeWidth={isActive ? 2.5 : 1.5} className="w-5 h-5 md:w-7 md:h-7" />
                </motion.div>

                {/* 3. TOOLTIP */}
                {/* 
                    Now visible because of the 'pb-12' on the container above. 
                    Positioned absolutely relative to the button.
                */}
                <AnimatePresence>
                  {(isHovered || isActive) && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 5, scale: 0.8 }}
                      className="absolute -bottom-10 left-1/2 -translate-x-1/2 z-30"
                    >
                      <span className="block px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white bg-black/80 backdrop-blur-md rounded-full border border-white/10 whitespace-nowrap shadow-xl">
                        {cat.name}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* 4. ACTIVE GLOWS */}
                {isActive && (
                  <>
                    {/* Tiny dot indicator */}
                    <motion.div 
                      layoutId="active-dot"
                      className={cn("absolute top-2 right-2 w-1.5 h-1.5 rounded-full shadow-[0_0_8px_currentColor] z-20", cat.color.replace('text-', 'bg-'))}
                    />
                    {/* Ambient Glow behind the button */}
                    <motion.div
                       layoutId="active-glow"
                       className={cn("absolute inset-0 rounded-2xl blur-xl opacity-40 -z-10", cat.bg)}
                       transition={{ duration: 0.5 }}
                    />
                  </>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}