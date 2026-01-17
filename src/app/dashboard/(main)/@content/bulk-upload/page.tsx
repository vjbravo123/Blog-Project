"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  UploadCloud, 
  FileJson, 
  FileSpreadsheet, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft,
  Download,
  Trash2,
  Zap,
  Tag as TagIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BulkUploadSlot() {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<{ name: string; size: string; status: string }[]>([]);

  // Mock data to show how the "Preview" would look for your Schema
  const schemaPreview = [
    { title: "AI in 2026", slug: "ai-2026", isFeatured: true, published: true, tags: ["AI", "Tech"] },
    { title: "Next.js Slots", slug: "nextjs-slots", isFeatured: false, published: false, tags: ["WebDev"] },
  ];

  return (
    <div className="relative min-h-screen">
      {/* Background Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-5%] left-[-5%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[30%] rounded-full bg-blue-500/10 blur-[100px]" />
      </div>

      <div className="max-w-6xl mx-auto space-y-8 relative z-10 pb-20">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 backdrop-blur-md bg-white/40 dark:bg-black/40 p-5 rounded-3xl border border-white/20 shadow-xl shadow-black/5">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="p-2 hover:bg-white dark:hover:bg-zinc-800 rounded-xl transition-all group">
              <ArrowLeft className="h-5 w-5 text-slate-500 group-hover:-translate-x-1" />
            </Link>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Bulk Upload</h1>
              <p className="text-xs text-slate-500">Import multiple blog posts via JSON or CSV</p>
            </div>
          </div>
          
          <Button variant="outline" size="sm" className="rounded-xl border-dashed border-2">
            <Download className="mr-2 h-4 w-4" /> Download Template
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* --- LEFT: UPLOAD ZONE --- */}
          <div className="lg:col-span-5 space-y-6">
            <div 
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              className={`relative h-80 backdrop-blur-xl rounded-[2.5rem] border-2 border-dashed transition-all flex flex-col items-center justify-center p-8 text-center group cursor-pointer ${
                dragActive 
                ? "border-indigo-500 bg-indigo-500/5" 
                : "border-slate-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 hover:border-indigo-500/50"
              }`}
            >
              <div className="w-16 h-16 bg-white dark:bg-zinc-800 rounded-2xl shadow-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <UploadCloud className={`h-8 w-8 ${dragActive ? "text-indigo-500 animate-bounce" : "text-slate-400"}`} />
              </div>
              <h3 className="font-bold text-lg">Drop your files here</h3>
              <p className="text-sm text-slate-500 mt-2 max-w-[200px]">
                Support JSON, CSV or Excel files (Max 10MB)
              </p>
              <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>

            {/* File List */}
            <div className="space-y-3">
               <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">Selected Files</h4>
               <div className="p-4 backdrop-blur-md bg-white/50 dark:bg-zinc-900/50 rounded-2xl border border-white/20 flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-100 dark:bg-amber-500/20 text-amber-600 rounded-lg">
                      <FileJson size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold">blogs_export_jan.json</p>
                      <p className="text-[10px] text-slate-500 font-medium tracking-tight">242 KB • Ready to process</p>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-red-50 dark:hover:bg-red-500/10 text-slate-400 hover:text-red-500 rounded-lg transition-colors">
                    <Trash2 size={16} />
                  </button>
               </div>
            </div>
          </div>

          {/* --- RIGHT: SCHEMA PREVIEW --- */}
          <div className="lg:col-span-7 space-y-6">
            <div className="backdrop-blur-xl bg-white/70 dark:bg-zinc-900/70 border border-white/20 dark:border-white/5 rounded-[2rem] shadow-2xl overflow-hidden">
              <div className="p-6 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between">
                <h3 className="font-bold flex items-center gap-2">
                  <Zap size={18} className="text-indigo-500 fill-indigo-500" /> 
                  Data Mapping Preview
                </h3>
                <span className="text-[10px] font-black bg-indigo-500/10 text-indigo-600 px-2 py-1 rounded-md uppercase">2 Rows Detected</span>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50/50 dark:bg-black/20 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <tr>
                      <th className="px-6 py-4">Title / Slug</th>
                      <th className="px-6 py-4">Features</th>
                      <th className="px-6 py-4">Tags</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                    {schemaPreview.map((item, i) => (
                      <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold truncate max-w-[150px]">{item.title}</p>
                          <p className="text-[10px] text-slate-500 tracking-tight">{item.slug}</p>
                        </td>
                        <td className="px-6 py-4">
                           {item.isFeatured ? (
                             <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-600 text-[9px] font-black uppercase">Featured</span>
                           ) : <span className="text-[9px] text-slate-400">Standard</span>}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-1">
                            {item.tags.map(tag => (
                              <span key={tag} className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-slate-500 text-[9px] font-bold">#{tag}</span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <CheckCircle2 size={16} className="text-green-500" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="p-6 bg-slate-50/50 dark:bg-black/20">
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl h-12 font-bold shadow-lg shadow-indigo-500/20 transition-all active:scale-[0.98]">
                  Start Bulk Import
                </Button>
                <p className="text-center text-[10px] text-slate-500 mt-4 font-medium uppercase tracking-widest">
                  Validating against Mongoose Schema v1.0
                </p>
              </div>
            </div>

            {/* Help Widget */}
            <div className="p-5 rounded-3xl bg-amber-50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/20 flex gap-4">
               <AlertCircle className="text-amber-600 shrink-0" size={20} />
               <div>
                  <h4 className="text-sm font-bold text-amber-900 dark:text-amber-400">Schema Requirement</h4>
                  <p className="text-xs text-amber-700 dark:text-amber-500/80 mt-1 leading-relaxed">
                    Ensure your JSON objects contain <strong>title</strong>, <strong>slug</strong>, and <strong>content</strong>. 
                    The <strong>author</strong> ID will be automatically mapped to your current session.
                  </p>
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}