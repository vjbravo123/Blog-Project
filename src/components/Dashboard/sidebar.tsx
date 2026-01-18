"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation"; // Added useRouter
import { 
  LayoutDashboard, 
  FileText, 
  BarChart3, 
  Users, 
  LogOut, 
  X,
  Tags,
  Loader2 // Added Loader icon
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Logout Logic
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);

      // 1. Call the API to clear server-side cookies
      await fetch("/api/admin/logout", {
        method: "POST",
      });

      // 2. Clear all client-side storage
      if (typeof window !== 'undefined') {
        localStorage.clear();
        sessionStorage.clear();
      }

      // 3. Redirect to login page
      router.push("/admin/login");
      router.refresh(); // Force a refresh to clear any cached data
    } catch (error) {
      console.error("Logout failed", error);
      setIsLoggingOut(false);
    }
  };

  // Blog-specific menu structure
  const menuItems = [
    { 
      name: "Overview", 
      href: "/admin/dashboard", 
      icon: LayoutDashboard 
    },
    { 
      name: "All Blogs", 
      href: "/admin/dashboard/blogs", 
      icon: FileText  
    },
    { 
      name: "Categories", 
      href: "/admin/dashboard/categories", 
      icon: Tags 
    },
    { 
      name: "Users", 
      href: "/admin/dashboard/users", 
      icon: Users 
    },
    { 
      name: "Analytics", 
      href: "/admin/dashboard/analytics", 
      icon: BarChart3 
    },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 transition-transform duration-300 lg:translate-x-0 lg:static ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="flex flex-col h-full">
          
          {/* 1. Brand Logo Section */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-zinc-100 dark:border-zinc-900">
            <Link href="/admin" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                B
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-bold text-zinc-900 dark:text-zinc-100 text-sm tracking-wide">BLOG</span>
                <span className="font-medium text-zinc-500 dark:text-zinc-500 text-xs tracking-widest">PROJECT</span>
              </div>
            </Link>
            <button className="lg:hidden text-zinc-500" onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>
          </div>

          {/* 2. Navigation Links */}
          <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive 
                      ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 shadow-sm ring-1 ring-indigo-100 dark:ring-transparent" 
                      : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-200"
                  }`}
                >
                  <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* 3. User Profile & Logout Section */}
          <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
            
            {/* User Info */}
            <div className="flex items-center gap-3 mb-4 px-2">
              <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200 dark:border-indigo-800">
                VJ
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                  Vivek Joshi
                </span>
                <span className="text-xs text-zinc-500 dark:text-zinc-500 font-medium">
                  Super Admin
                </span>
              </div>
            </div>

            {/* Logout Button */}
            <button 
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm font-medium text-red-600 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 hover:border-red-200 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoggingOut ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Logging out...</span>
                </>
              ) : (
                <>
                  <LogOut size={16} />
                  <span>Logout</span>
                </>
              )}
            </button>
          </div>

        </div>
      </aside>
    </>
  );
};