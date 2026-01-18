"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  ShieldCheck, 
  HelpCircle, 
  FileText, 
  Server, 
  Wifi
} from "lucide-react";

// --- HOOK: Simulate Server Latency ---
function useSystemLatency() {
  const [latency, setLatency] = useState(24);
  const [status, setStatus] = useState<"good" | "fair" | "poor">("good");

  useEffect(() => {
    const interval = setInterval(() => {
      const newLatency = Math.floor(Math.random() * (45 - 18 + 1) + 18); // Random between 18ms and 45ms
      setLatency(newLatency);
      
      if (newLatency < 50) setStatus("good");
      else if (newLatency < 100) setStatus("fair");
      else setStatus("poor");
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return { latency, status };
}

export function AnalyticsFooter() {
  const { latency, status } = useSystemLatency();
  const currentYear = new Date().getFullYear();

  return (
    <div className="mt-8 py-6 border-t border-zinc-200 dark:border-zinc-800">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
        
        {/* --- LEFT: Copyright & Version --- */}
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6 text-zinc-500 dark:text-zinc-400">
          <span className="font-medium">
            © {currentYear} Shiksha Nation
          </span>
          <span className="hidden md:inline-block w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-xs font-mono text-zinc-600 dark:text-zinc-300">
            v2.4.0-beta
          </span>
        </div>

        {/* --- RIGHT: System Status & Links --- */}
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
          
          {/* Live Latency Indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <div className={`relative flex items-center justify-center w-2 h-2 rounded-full ${
              status === 'good' ? 'bg-emerald-500' : status === 'fair' ? 'bg-amber-500' : 'bg-red-500'
            }`}>
              <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${
                 status === 'good' ? 'bg-emerald-400' : status === 'fair' ? 'bg-amber-400' : 'bg-red-400'
              }`} />
            </div>
            <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-300">
              <Server size={12} />
              <span className="font-mono">{latency}ms</span>
              <span className="text-zinc-400">latency</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex items-center gap-6">
            <Link href="#" className="flex items-center gap-1.5 text-zinc-500 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400 transition-colors">
              <HelpCircle size={14} />
              <span>Support</span>
            </Link>
            <Link href="#" className="flex items-center gap-1.5 text-zinc-500 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400 transition-colors">
              <FileText size={14} />
              <span>API Docs</span>
            </Link>
            <Link href="#" className="flex items-center gap-1.5 text-zinc-500 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400 transition-colors">
              <ShieldCheck size={14} />
              <span>Privacy</span>
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}