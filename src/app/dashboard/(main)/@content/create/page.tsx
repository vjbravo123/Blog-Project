"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; 
import { 
  ArrowLeft, Settings, Globe, Image as ImageIcon, 
  Bold, Italic, Code, Link as LinkIcon, Quote, 
  Type, Trash2, Plus, Eye, Upload, Loader2, X
} from "lucide-react";
import BlogPostTemplate from "@/components/blog/BlogPostTemplate"; 

// --- TYPES ---
interface Block {
  id: string;
  type: string;
  content: string;
}

// --- HELPERS ---
const uid = () => Math.random().toString(36).substr(2, 9);

const convertBlocksToHtml = (blocks: Block[]) => {
  return blocks.map(block => {
    switch(block.type) {
      case 'h1': return `<h1>${block.content}</h1>`;
      case 'h2': return `<h2>${block.content}</h2>`;
      case 'p': return `<p>${block.content}</p>`;
      case 'quote': return `<blockquote>${block.content}</blockquote>`;
      case 'code': return `<pre><code>${block.content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`;
      case 'image': return `<img src="${block.content}" alt="Blog Image" />`;
      default: return '';
    }
  }).join('');
};

export default function UltimateCmsEditor() {
  const router = useRouter();

  // --- STATE ---
  const [activeTab, setActiveTab] = useState("settings");
  const [focusedBlockId, setFocusedBlockId] = useState<string | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  
  // Link State
  const [linkInput, setLinkInput] = useState<{ show: boolean; url: string; text: string; savedSelection: Range | null }>({ 
    show: false, url: '', text: '', savedSelection: null 
  });
  
  // Meta Data
  const [meta, setMeta] = useState({ 
    title: "", // Initialized empty so placeholder shows
    slug: "", 
    excerpt: "",
    category: "Technology",
    seoTitle: "",
    seoDesc: "",
    coverImage: "" 
  });

  // Content Blocks
  // FIXED: Initialized with empty content so placeholders work correctly.
  // Removed the hardcoded 'The Future of Interface Design' text.
  const [blocks, setBlocks] = useState<Block[]>([
    { id: '1', type: 'p', content: '' }, 
  ]);

  // --- IMAGE UPLOAD LOGIC ---
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setMeta(prev => ({ ...prev, coverImage: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setMeta(prev => ({ ...prev, coverImage: "" }));
  };

  // --- PUBLISH LOGIC ---
  const handlePublish = async () => {
    if (!meta.title) return alert("Please enter a post title.");
    if (blocks.length === 0) return alert("Please add some content.");

    setIsPublishing(true);

    try {
      const htmlContent = convertBlocksToHtml(blocks);
      
      const payload = {
        title: meta.title,
        slug: meta.slug || undefined,
        subtitle: meta.excerpt,
        content: htmlContent,
        category: meta.category,
        coverImage: meta.coverImage, 
        seo: {
          metaTitle: meta.seoTitle || meta.title,
          metaDescription: meta.seoDesc || meta.excerpt,
        },
        blocks: blocks 
      };

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Failed to publish post");

      alert("Post published successfully!");
      if (data.data?.slug) {
        router.push(`/blog/${data.data.slug}`);
      } else {
        router.push('/blog');
      }

    } catch (error: any) {
      console.error("Publishing Error:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsPublishing(false);
    }
  };

  // --- EDITOR HELPERS ---
  const addBlock = (type: string) => {
    const newBlock = { id: uid(), type, content: '' };
    const index = blocks.findIndex(b => b.id === focusedBlockId);
    const insertAt = index === -1 ? blocks.length : index + 1;
    const newBlocks = [...blocks];
    newBlocks.splice(insertAt, 0, newBlock);
    setBlocks(newBlocks);
    setFocusedBlockId(newBlock.id);
  };

  const updateBlock = (id: string, content: string) => {
    setBlocks(prev => prev.map(b => b.id === id ? { ...b, content } : b));
  };

  const deleteBlock = (id: string) => {
    // Allows deleting even the last block if we want, but usually we keep one.
    // However, since we have a separate Title input now, we can be more flexible.
    if (blocks.length <= 1) {
       // If it's the last block, just clear content instead of removing block
       updateBlock(id, '');
       return;
    }
    setBlocks(prev => prev.filter(b => b.id !== id));
  };

  const applyFormat = (command: string) => {
    document.execCommand(command, false);
    syncActiveBlock();
  };

  const openLinkInput = (e: React.MouseEvent) => {
    e.preventDefault(); 
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0 && !selection.isCollapsed) {
      const range = selection.getRangeAt(0).cloneRange();
      setLinkInput({ show: true, url: '', text: selection.toString(), savedSelection: range });
    } else {
      alert("Highlight text to link.");
    }
  };

  const applyLink = () => {
    if (linkInput.savedSelection && linkInput.url) {
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(linkInput.savedSelection);
      document.execCommand('createLink', false, linkInput.url);
      syncActiveBlock();
      setLinkInput({ show: false, url: '', text: '', savedSelection: null });
    }
  };

  const syncActiveBlock = () => {
    if (!focusedBlockId) return;
    const el = document.querySelector(`[data-block-id="${focusedBlockId}"] [contenteditable]`);
    if (el) updateBlock(focusedBlockId, el.innerHTML);
  };

  // --- RENDER ---
  if (isPreviewMode) {
    return (
      <BlogPostTemplate
        post={{
          title: meta.title || "Untitled Draft",
          content: convertBlocksToHtml(blocks),
          coverImage: meta.coverImage, 
          tags: [meta.category],
          author: { name: "Preview Author" },
          createdAt: new Date(),
          readTime: 5
        }}
        onBack={() => setIsPreviewMode(false)}
        isPreview={true}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#09090b] text-slate-900 dark:text-slate-100 font-sans pb-40 antialiased selection:bg-indigo-500/30">
      <style jsx global>{`
        /* --- VISIBILITY & PLACEHOLDER FIXES --- */
        
        /* 1. ContentEditable Placeholders */
        .editable-empty:empty:before { 
          content: attr(data-placeholder); 
          color: #9ca3af; /* visible grey */
          pointer-events: none; 
          display: block; 
        }
        
        /* 2. Vanish placeholder immediately on focus */
        .editable-empty:focus:before { 
          display: none; /* Removed immediately when user taps */
        }
        
        /* 3. Input/Textarea Placeholders */
        input::placeholder, textarea::placeholder {
          color: #9ca3af;
          opacity: 1;
        }
        
        /* 4. Vanish input placeholder immediately on focus */
        input:focus::placeholder, textarea:focus::placeholder {
          color: transparent;
          opacity: 0;
        }

        [contenteditable]:focus { 
          outline: none; 
        }
        
        html { scroll-behavior: smooth; }
      `}</style>

      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-xl border-b border-slate-200 dark:border-zinc-800 px-6 py-3 flex items-center justify-between transition-colors duration-300">
        <div className="flex items-center gap-4">
          <Link href="/blog" className="p-2 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition-all">
            <ArrowLeft size={20} />
          </Link>
          <div className="flex flex-col">
             <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Drafting</span>
             {/* Small preview of title in header */}
             <h1 className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate max-w-[200px]">{meta.title || "Untitled Post"}</h1>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setIsPreviewMode(true)} className="px-4 py-2 text-xs font-bold bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-zinc-700 rounded-lg flex items-center gap-2 transition-all">
            <Eye size={16} /> Preview
          </button>
          <button 
            onClick={handlePublish}
            disabled={isPublishing}
            className="px-6 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:shadow-none rounded-lg flex items-center gap-2 transition-all transform active:scale-95"
          >
            {isPublishing ? <Loader2 size={16} className="animate-spin" /> : "Publish"}
          </button>
        </div>
      </header>

      {/* MAIN GRID */}
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-0 lg:divide-x divide-slate-200 dark:divide-zinc-800">
        
        {/* EDITOR (Left) */}
        <div className="lg:col-span-8 bg-white dark:bg-[#09090b] min-h-screen flex flex-col items-center relative transition-colors duration-300">
          
          {/* TOOLBAR */}
          <div className="sticky top-20 z-40 my-8">
            <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur border border-slate-200 dark:border-zinc-700 rounded-full shadow-xl shadow-slate-200/50 dark:shadow-black/50 p-1.5 flex items-center gap-1">
              <ToolbarBtn icon={Bold} onClick={() => applyFormat('bold')} />
              <ToolbarBtn icon={Italic} onClick={() => applyFormat('italic')} />
              <div className="w-px h-5 bg-slate-200 dark:bg-zinc-700 mx-1" />
              <ToolbarBtn icon={Type} label="H1" onClick={() => addBlock('h1')} />
              <ToolbarBtn icon={Type} label="H2" onClick={() => addBlock('h2')} />
              <ToolbarBtn icon={Quote} onClick={() => addBlock('quote')} />
              <ToolbarBtn icon={Code} onClick={() => addBlock('code')} />
              <div className="relative">
                <ToolbarBtn icon={LinkIcon} onClick={openLinkInput} active={linkInput.show} />
                {linkInput.show && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-80 bg-white dark:bg-zinc-900 border dark:border-zinc-700 rounded-xl shadow-2xl p-4 z-50">
                    <input className="w-full bg-slate-50 dark:bg-zinc-800 border dark:border-zinc-700 rounded p-2 text-sm mb-2 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:ring-2 ring-indigo-500 outline-none" autoFocus placeholder="https://..." value={linkInput.url} onChange={e => setLinkInput({...linkInput, url: e.target.value})} onKeyDown={e => e.key === 'Enter' && applyLink()} />
                    <button onClick={applyLink} className="w-full bg-indigo-600 text-white text-xs font-bold py-2 rounded hover:bg-indigo-700 transition-colors">Add Link</button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* CANVAS */}
          <div className="w-full max-w-3xl px-6 pl-12 lg:pl-16 pb-32 space-y-4">
             
             {/* --- MAIN TITLE INPUT --- */}
             {/* This puts the Title directly in the main box as requested */}
             <div className="mb-8 group relative">
                <textarea
                  className="w-full text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white bg-transparent outline-none resize-none overflow-hidden leading-tight placeholder:text-slate-300 dark:placeholder:text-zinc-700"
                  placeholder="The Future of Interface Design" 
                  value={meta.title}
                  onChange={(e) => {
                    setMeta({...meta, title: e.target.value});
                    e.target.style.height = 'auto';
                    e.target.style.height = e.target.scrollHeight + 'px';
                  }}
                  rows={1}
                  style={{ height: 'auto' }}
                  onKeyDown={(e) => {
                    if(e.key === 'Enter') {
                      e.preventDefault();
                      // Focus the first block when hitting enter on title
                      const firstBlock = document.querySelector(`[data-block-id="${blocks[0]?.id}"] [contenteditable]`) as HTMLElement;
                      firstBlock?.focus();
                    }
                  }}
                />
             </div>

             {/* --- BLOCKS --- */}
             {blocks.map((block) => (
               <BlockWrapper key={block.id} block={block} isActive={focusedBlockId === block.id} updateBlock={updateBlock} deleteBlock={deleteBlock} setFocus={setFocusedBlockId} addBlock={addBlock} />
             ))}
             
             <div className="mt-16 flex justify-center opacity-40 hover:opacity-100 transition-opacity duration-300 cursor-pointer" onClick={() => addBlock('p')}>
                <div className="flex items-center gap-2 px-6 py-3 rounded-full border border-dashed border-slate-300 dark:border-zinc-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors">
                  <Plus size={16} /><span className="text-sm font-semibold">Add New Block</span>
                </div>
             </div>
          </div>
        </div>

        {/* SETTINGS (Right) */}
        <div className="hidden lg:block lg:col-span-4 bg-white dark:bg-[#0c0c0e] h-full overflow-y-auto border-l border-slate-200 dark:border-zinc-800">
            <div className="flex border-b border-slate-200 dark:border-zinc-800 sticky top-0 bg-white/95 dark:bg-[#0c0c0e]/95 backdrop-blur z-10">
              <SidebarTab label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={Settings} />
              <SidebarTab label="SEO" active={activeTab === 'seo'} onClick={() => setActiveTab('seo')} icon={Globe} />
              <SidebarTab label="Media" active={activeTab === 'media'} onClick={() => setActiveTab('media')} icon={ImageIcon} />
            </div>
            
            <div className="p-8 space-y-8">
              {activeTab === 'settings' && (
                <>
                  {/* Title is also mirrored here, but the main editing happens in the canvas now */}
                  <Input label="Title" value={meta.title} onChange={e => setMeta({...meta, title: e.target.value})} placeholder="Article Title" />
                  <Input label="Slug" value={meta.slug} onChange={e => setMeta({...meta, slug: e.target.value})} placeholder="custom-slug-url" />
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Excerpt</label>
                    <textarea 
                      className="w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg p-3 text-sm h-32 outline-none focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-500/40 text-slate-800 dark:text-slate-200 resize-none transition-shadow" 
                      value={meta.excerpt} 
                      onChange={e => setMeta({...meta, excerpt: e.target.value})} 
                      placeholder="Write a short summary..."
                    />
                  </div>
                </>
              )}
              
              {activeTab === 'seo' && (
                <>
                  <Input label="Meta Title" value={meta.seoTitle} onChange={e => setMeta({...meta, seoTitle: e.target.value})} placeholder="SEO Title" />
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Meta Description</label>
                    <textarea 
                      className="w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg p-3 text-sm h-32 outline-none focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-500/40 text-slate-800 dark:text-slate-200 resize-none transition-shadow" 
                      value={meta.seoDesc} 
                      onChange={e => setMeta({...meta, seoDesc: e.target.value})} 
                      placeholder="Description for search engines..."
                    />
                  </div>
                </>
              )}
              
              {activeTab === 'media' && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Cover Image</label>
                    
                    {meta.coverImage ? (
                      <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-slate-200 dark:border-zinc-700 group shadow-sm">
                        <img src={meta.coverImage} alt="Cover" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 backdrop-blur-sm">
                          <button onClick={removeImage} className="p-2.5 bg-white rounded-full text-red-600 hover:bg-red-50 hover:scale-110 transition-all shadow-lg">
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-slate-300 dark:border-zinc-700 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-zinc-900 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all group">
                        <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-full mb-3 group-hover:scale-110 transition-transform">
                            <Upload size={24} />
                        </div>
                        <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">Click to upload image</span>
                        <span className="text-[11px] text-slate-400 mt-1">PNG, JPG up to 5MB</span>
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                      </label>
                    )}
                  </div>

                  <div className="relative py-2">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-slate-200 dark:border-zinc-800" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white dark:bg-[#0c0c0e] px-2 text-slate-400 font-medium">Or use URL</span>
                    </div>
                  </div>

                  <Input 
                    label="Image URL" 
                    value={meta.coverImage} 
                    onChange={e => setMeta({...meta, coverImage: e.target.value})} 
                    placeholder="https://example.com/image.jpg" 
                  />
                </div>
              )}
            </div>
        </div>
      </div>
    </div>
  );
}

// --- SUBCOMPONENTS ---

const BlockWrapper = ({ block, isActive, updateBlock, deleteBlock, setFocus, addBlock }: any) => {
  let styles = "text-lg text-slate-700 dark:text-slate-300 leading-8 tracking-normal"; 
  if (block.type === 'h1') styles = "text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight mb-6 tracking-tight";
  if (block.type === 'h2') styles = "text-2xl lg:text-3xl font-bold text-slate-800 dark:text-slate-100 mt-10 mb-4 tracking-tight";
  if (block.type === 'quote') styles = "text-xl lg:text-2xl italic text-slate-600 dark:text-slate-300 border-l-4 border-indigo-500 pl-6 py-2 my-8 bg-slate-50 dark:bg-zinc-900/50 rounded-r-lg";
  
  // --- FIXED: CODE BLOCK WITH HEADER & DELETE BUTTON ---
  if (block.type === 'code') return (
      <div className="relative group my-8 bg-[#151515] rounded-xl border border-slate-800 overflow-hidden shadow-2xl transition-all" onClick={() => setFocus(block.id)}>
         {/* Code Block Header */}
         <div className="flex justify-between items-center px-4 py-2 bg-[#1e1e1e] border-b border-slate-700/50 select-none">
           <div className="flex gap-2">
             <div className="w-3 h-3 rounded-full bg-red-500 shadow-sm"/>
             <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-sm"/>
             <div className="w-3 h-3 rounded-full bg-green-500 shadow-sm"/>
           </div>
           
           <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-widest text-slate-500 font-mono font-bold">Code Snippet</span>
              
              {/* DELETE BUTTON FOR CODE BLOCK - Now inside the header, always visible */}
              <button 
                onClick={(e) => { e.stopPropagation(); deleteBlock(block.id); }} 
                className="ml-4 p-1.5 text-slate-400 hover:text-white hover:bg-red-500/80 rounded transition-all"
                title="Delete Code Block"
              >
                <Trash2 size={14}/>
              </button>
           </div>
         </div>
         
         <div className="relative">
            <EditableContent tagName="pre" html={block.content} className="p-6 font-mono text-sm text-slate-300 outline-none leading-relaxed" onChange={(h:string) => updateBlock(block.id, h)} onEnter={() => addBlock('p')} onBackspace={() => deleteBlock(block.id)} placeholder="Paste code here..." />
         </div>
      </div>
  );

  return (
    <div className={`relative group transition-all duration-200 ${isActive ? 'z-10' : ''}`} data-block-id={block.id} onClick={() => setFocus(block.id)}>
      {/* Delete Button for regular blocks - Positioned left */}
      <div className={`absolute -left-12 top-1.5 transition-opacity duration-200 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`}>
        <button onClick={() => deleteBlock(block.id)} className="p-2 text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg transition-all">
          <Trash2 size={18}/>
        </button>
      </div>
      
      <EditableContent 
        tagName={block.type==='quote'?'blockquote':block.type==='p'?'p':block.type} 
        html={block.content} 
        className={`editable-empty outline-none ${styles}`} 
        onChange={(h:string) => updateBlock(block.id, h)} 
        onEnter={() => addBlock('p')} 
        onBackspace={() => deleteBlock(block.id)} 
        // Logic to show correct placeholder based on block type
        placeholder={block.type === 'p' ? "Start typing your story here..." : block.type === 'h1' ? "Big Heading" : block.type === 'h2' ? "Sub-Heading" : "Type here..."} 
      />
    </div>
  );
};

const EditableContent = ({ tagName, html, className, onChange, onEnter, onBackspace, placeholder }: any) => {
  const contentRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (contentRef.current && contentRef.current.innerHTML !== html) {
      contentRef.current.innerHTML = html;
    }
  }, [html]);
  return React.createElement(tagName, {
    ref: contentRef, className, contentEditable: true, suppressContentEditableWarning: true, "data-placeholder": placeholder,
    onInput: (e: any) => onChange(e.currentTarget.innerHTML),
    onKeyDown: (e: any) => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onEnter(); }
      if (e.key === 'Backspace' && (!contentRef.current?.innerText || contentRef.current.innerText === '\n')) { onBackspace(); }
    }
  });
};

const Input = ({ label, value, onChange, placeholder }: any) => (
  <div className="space-y-1.5">
    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{label}</label>
    <input 
      className="w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 ring-indigo-500/20 dark:ring-indigo-500/40 focus:border-indigo-500 dark:focus:border-indigo-500 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 transition-all shadow-sm" 
      value={value} 
      onChange={onChange} 
      placeholder={placeholder} 
    />
  </div>
);

const ToolbarBtn = ({ icon: Icon, onClick, active, label }: any) => (
  <button onClick={onClick} className={`p-2 rounded-lg flex gap-1 items-center transition-all ${active ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-slate-200'}`}>
    <Icon size={18} strokeWidth={2.5} /> {label && <span className="text-[11px] font-bold uppercase tracking-wide">{label}</span>}
  </button>
);

const SidebarTab = ({ label, active, onClick, icon: Icon }: any) => (
  <button onClick={onClick} className={`flex-1 py-3.5 flex justify-center items-center gap-2 text-[11px] font-bold uppercase tracking-wider border-b-2 transition-all ${active ? 'text-indigo-600 dark:text-indigo-400 border-indigo-600 dark:border-indigo-500 bg-indigo-50/30 dark:bg-indigo-900/10' : 'text-slate-500 dark:text-slate-400 border-transparent hover:bg-slate-50 dark:hover:bg-zinc-800 hover:text-slate-700'}`}>
    <Icon size={15} /> {label}
  </button>
);