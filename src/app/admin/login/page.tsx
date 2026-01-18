"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Loader2, 
  ArrowRight, 
  Sparkles,
  ShieldCheck,
  Zap,
  Layout
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // REAL API INTEGRATION
      // We are hitting the endpoint we will create later
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Successful Login
        router.push("/admin/dashboard");
      } else {
        // Handle Server Errors (401, 403, etc.)
        setError(data.message || "Invalid credentials. Please try again.");
        setIsLoading(false);
      }
    } catch (err) {
      // Network Errors
      console.error("Login failed", err);
      setError("Network error. Please try again later.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-white dark:bg-zinc-950 overflow-hidden font-sans">
      
      {/* LEFT SIDE: Immersive Experience */}
      <div className="hidden lg:flex lg:w-[55%] relative bg-black overflow-hidden items-center justify-center">
        
        {/* Animated Background Mesh */}
        <div className="absolute inset-0">
            <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-indigo-600/30 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-violet-600/30 rounded-full blur-[120px] animate-pulse delay-1000" />
            <div className="absolute top-[30%] left-[30%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[100px] animate-bounce duration-[10000ms]" />
        </div>

        {/* Noise Texture Overlay for "Film Grain" look */}
        <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>

        <div className="relative z-10 w-full max-w-2xl px-12">
          {/* Glass Card */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 p-10 rounded-3xl shadow-2xl relative overflow-hidden group">
            
            {/* Glossy Reflection */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            {/* Brand Header */}
            <div className="flex items-center gap-4 mb-8">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <Sparkles className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Vivek's Blog</h1>
                <p className="text-indigo-200 text-sm font-medium tracking-wider uppercase">Admin Console</p>
              </div>
            </div>

            {/* Hero Text */}
            <h2 className="text-4xl font-bold text-white leading-tight mb-6">
              Crafting stories that <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-violet-300">
                shape the future.
              </span>
            </h2>

            <p className="text-zinc-400 text-lg leading-relaxed mb-8">
              Welcome back to your command center. Manage content, analyze traffic, and connect with your audience through a seamless interface.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-3">
              {[
                { icon: ShieldCheck, text: "Secure Environment" },
                { icon: Zap, text: "Fast Performance" },
                { icon: Layout, text: "Modern Dashboard" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-zinc-300 backdrop-blur-md">
                  <item.icon size={14} className="text-indigo-400" />
                  {item.text}
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-8 flex justify-between text-xs text-zinc-600 font-medium px-4">
             <span>v2.4.0-beta</span>
             <span>Server Status: <span className="text-emerald-500">Online</span></span>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Authentication Form */}
      <div className="w-full lg:w-[45%] flex flex-col justify-center items-center p-8 bg-white dark:bg-zinc-950 relative">
        
        <div className="w-full max-w-[400px] animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          {/* Mobile Logo (Visible only on small screens) */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center">
              <Sparkles className="text-white" size={20} />
            </div>
            <span className="text-xl font-bold text-zinc-900 dark:text-white">Vivek's Blog</span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">Welcome back</h2>
            <p className="text-zinc-500 dark:text-zinc-400">Enter your credentials to access the admin panel.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Error Message */}
            {error && (
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 flex items-center gap-3 text-sm text-red-600 dark:text-red-400 animate-pulse">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                {error}
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 ml-1">Email</label>
              <div className="group relative transition-all duration-300 focus-within:scale-[1.01]">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-indigo-600 transition-colors">
                  <Mail size={20} />
                </div>
                <input
                  type="email"
                  required
                  placeholder="admin@example.com"
                  className="w-full pl-12 pr-4 py-3.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-zinc-900 dark:text-white placeholder:text-zinc-400 font-medium"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Password</label>
                <Link href="#" className="text-xs font-semibold text-indigo-600 hover:text-indigo-500">
                  Forgot password?
                </Link>
              </div>
              <div className="group relative transition-all duration-300 focus-within:scale-[1.01]">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-indigo-600 transition-colors">
                  <Lock size={20} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-zinc-900 dark:text-white placeholder:text-zinc-400 font-medium"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold rounded-2xl hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all duration-300 flex items-center justify-center gap-2 shadow-xl shadow-zinc-500/10 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed group"
              >
                {isLoading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <>
                    Sign In to Dashboard
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Footer */}
          <p className="mt-8 text-center text-sm text-zinc-500">
            Protected by reCAPTCHA and subject to the{' '}
            <Link href="#" className="underline hover:text-zinc-800 dark:hover:text-zinc-300">Privacy Policy</Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}