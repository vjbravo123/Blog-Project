"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Tags,
  NotebookPen,
  Clock,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  LucideIcon,
} from "lucide-react";

// ---------------- TYPES ----------------
interface StatData {
  label: string;
  value: number;
  description?: string;
  icon: keyof typeof ICONS;
  trend?: "up" | "down";
  delta?: string;
}

// ---------------- ICON MAP ----------------
const ICONS: Record<string, LucideIcon> = {
  FileText,
  Tags,
  NotebookPen,
  Clock,
};

// ---------------- CONFIG ----------------
const STAT_THEME = {
  FileText: {
    gradient: "from-indigo-500/30 via-blue-500/20 to-transparent",
    accent: "text-indigo-500",
  },
  Tags: {
    gradient: "from-pink-500/30 via-rose-500/20 to-transparent",
    accent: "text-pink-500",
  },
  NotebookPen: {
    gradient: "from-amber-500/30 via-orange-500/20 to-transparent",
    accent: "text-amber-500",
  },
  Clock: {
    gradient: "from-emerald-500/30 via-teal-500/20 to-transparent",
    accent: "text-emerald-500",
  },
};

// ---------------- COUNT UP ----------------
const AnimatedNumber = ({ value }: { value: number }) => (
  <motion.span
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, ease: "easeOut" }}
  >
    {value.toLocaleString()}
  </motion.span>
);

// ---------------- MAIN ----------------
export function DashboardStats() {
  const [stats, setStats] = useState<StatData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/dashboard/stats");
        const data = await res.json();
        setStats(data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ---------------- LOADING ----------------
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-36 rounded-2xl bg-zinc-100 dark:bg-zinc-800 animate-pulse"
          />
        ))}
      </div>
    );
  }

  // ---------------- ERROR ----------------
  if (error) {
    return (
      <div className="flex items-center gap-2 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-4 rounded-xl">
        <AlertCircle size={18} /> Failed to load dashboard stats
      </div>
    );
  }

  // ---------------- UI ----------------
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = ICONS[stat.icon] ?? FileText;
        const theme = STAT_THEME[stat.icon];

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-2xl border border-white/20 
                       bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl
                       shadow-lg hover:shadow-xl transition"
          >
            {/* Gradient Glow */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} opacity-40`}
            />

            {/* Content */}
            <div className="relative p-6 space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div
                  className={`p-3 rounded-xl bg-white/60 dark:bg-zinc-800/60 ${theme.accent}`}
                >
                  <Icon size={22} />
                </div>

                {stat.trend && (
                  <div
                    className={`flex items-center gap-1 text-xs font-semibold ${
                      stat.trend === "up"
                        ? "text-emerald-500"
                        : "text-red-500"
                    }`}
                  >
                    {stat.trend === "up" ? (
                      <TrendingUp size={14} />
                    ) : (
                      <TrendingDown size={14} />
                    )}
                    {stat.delta}
                  </div>
                )}
              </div>

              {/* Stat */}
              <div>
                <p className="text-xs uppercase tracking-widest text-zinc-500">
                  {stat.label}
                </p>
                <h3 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                  <AnimatedNumber value={stat.value} />
                </h3>
              </div>

              {/* Description */}
              {stat.description && (
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {stat.description}
                </p>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
