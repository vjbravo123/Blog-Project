import React from "react";
import Link from "next/link";
import { Plus, Layout, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";

export const AdminActions = () => {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Primary Action: Create */}
      <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-95">
        <Link href="/admin/dashboard/create">
          <Plus className="mr-2 h-4 w-4" /> Create Blog
        </Link>
      </Button>

      {/* Secondary Action: Bulk Upload */}
      <Button variant="outline" asChild className="rounded-xl border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-900 transition-all">
        <Link href="/admin/dashboard/bulk-upload">
          <UploadCloud className="mr-2 h-4 w-4 text-indigo-500" /> Bulk Upload
        </Link>
      </Button>
      
      {/* Tertiary Action: Manage */}
      <Button variant="outline" asChild className="rounded-xl border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-900 transition-all">
        <Link href="/admin/dashboard/content">
          <Layout className="mr-2 h-4 w-4 text-slate-500" /> Manage Content
        </Link>
      </Button>
    </div>
  );
};