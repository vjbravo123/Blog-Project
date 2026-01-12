"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; 
import { 
  ArrowLeft, Settings, Globe, Image as ImageIcon, 
  Bold, Italic, Code, Link as LinkIcon, Quote, 
  Type, Trash2, Plus, Eye, Upload, Loader2
} from "lucide-react";
import BlogPostTemplate from "@/features/blog/BlogPostTemplate"; 

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
    title: "", 
    slug: "", 
    excerpt: "",
    category: "Technology",
    seoTitle: "",
    seoDesc: "",
    coverImage: "" 
  });

  // Content Blocks
  const [blocks, setBlocks] = useState<Block[]>([
    { id: '1', type: 'h1', content: 'The Future of Interface Design' },
    { id: '2', type: 'p', content: 'Start typing your story here...' },
  ]);

  // --- IMAGE UPLOAD LOGIC (FIXED: CLIENT SIDE ONLY) ---
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Convert file to Base64 string for preview and payload
    const reader = new FileReader();
    reader.onloadend = () => {
      // Result is a long string: "data:image/png;base64,iVBOR..."
      setMeta(prev => ({ ...prev, coverImage: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setMeta(prev => ({ ...prev, coverImage: "" }));
  };

  // --- PUBLISH LOGIC ---
  const handlePublish = async () => {
    if (!meta.title) return alert("Please enter a post title in Settings.");
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
        // If this is a Data URL (new upload), the API will handle the upload to S3.
        // If it's already an HTTP URL (existing image), the API will use it as is.
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
    if (blocks.length <= 1) return;
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
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#050505] text-slate-900 dark:text-slate-100 font-sans pb-40">
      <style jsx global>{`
        .editable-empty:empty:before { content: attr(data-placeholder); color: #94a3b8; pointer-events: none; display: block; }
        .editable-empty:focus:before { display: none; }
        [contenteditable]:focus { outline: none; }
      `}</style>

      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#050505]/80 backdrop-blur-xl border-b border-slate-200 dark:border-zinc-800 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/blog" className="p-2 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg text-slate-500">
            <ArrowLeft size={20} />
          </Link>
          <div>
             <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Drafting</span>
             <h1 className="text-sm font-bold">{meta.title || "Untitled Post"}</h1>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setIsPreviewMode(true)} className="px-4 py-2 text-xs font-bold bg-slate-100 dark:bg-zinc-800 rounded-lg flex items-center gap-2">
            <Eye size={16} /> Preview
          </button>
          <button 
            onClick={handlePublish}
            disabled={isPublishing}
            className="px-6 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg flex items-center gap-2"
          >
            {isPublishing ? "Saving..." : "Publish"}
          </button>
        </div>
      </header>

      {/* MAIN GRID */}
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-0 lg:divide-x divide-slate-200 dark:divide-zinc-800">
        
        {/* EDITOR (Left) */}
        <div className="lg:col-span-8 bg-white dark:bg-[#050505] min-h-screen flex flex-col items-center relative">
          
          {/* TOOLBAR */}
          <div className="sticky top-20 z-40 my-6">
            <div className="bg-white/90 backdrop-blur border border-slate-200 dark:border-zinc-800 rounded-full shadow-xl p-1.5 flex items-center gap-1">
              <ToolbarBtn icon={Bold} onClick={() => applyFormat('bold')} />
              <ToolbarBtn icon={Italic} onClick={() => applyFormat('italic')} />
              <div className="w-px h-5 bg-slate-200 mx-1" />
              <ToolbarBtn icon={Type} label="H1" onClick={() => addBlock('h1')} />
              <ToolbarBtn icon={Type} label="H2" onClick={() => addBlock('h2')} />
              <ToolbarBtn icon={Quote} onClick={() => addBlock('quote')} />
              <ToolbarBtn icon={Code} onClick={() => addBlock('code')} />
              <div className="relative">
                <ToolbarBtn icon={LinkIcon} onClick={openLinkInput} active={linkInput.show} />
                {linkInput.show && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-80 bg-white border rounded-xl shadow-xl p-4 z-50">
                    <input className="w-full border rounded p-2 text-sm mb-2" autoFocus placeholder="https://..." value={linkInput.url} onChange={e => setLinkInput({...linkInput, url: e.target.value})} onKeyDown={e => e.key === 'Enter' && applyLink()} />
                    <button onClick={applyLink} className="w-full bg-indigo-600 text-white text-xs font-bold py-2 rounded">Add Link</button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* CANVAS */}
          <div className="w-full max-w-3xl px-6 pb-32 space-y-2">
             {blocks.map((block) => (
               <BlockWrapper key={block.id} block={block} isActive={focusedBlockId === block.id} updateBlock={updateBlock} deleteBlock={deleteBlock} setFocus={setFocusedBlockId} addBlock={addBlock} />
             ))}
             <div className="mt-12 flex justify-center opacity-40 hover:opacity-100 cursor-pointer" onClick={() => addBlock('p')}>
                <div className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-dashed border-slate-300 text-slate-500">
                  <Plus size={16} /><span className="text-sm font-semibold">Add Block</span>
                </div>
             </div>
          </div>
        </div>

        {/* SETTINGS (Right) */}
        <div className="hidden lg:block lg:col-span-4 bg-white dark:bg-[#0c0c0e] h-full overflow-y-auto">
            <div className="flex border-b border-slate-200 sticky top-0 bg-inherit z-10">
              <SidebarTab label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={Settings} />
              <SidebarTab label="SEO" active={activeTab === 'seo'} onClick={() => setActiveTab('seo')} icon={Globe} />
              <SidebarTab label="Media" active={activeTab === 'media'} onClick={() => setActiveTab('media')} icon={ImageIcon} />
            </div>
            
            <div className="p-6 space-y-6">
              {activeTab === 'settings' && (
                <>
                  <Input label="Title" value={meta.title} onChange={e => setMeta({...meta, title: e.target.value})} placeholder="Article Title" />
                  <Input label="Slug" value={meta.slug} onChange={e => setMeta({...meta, slug: e.target.value})} placeholder="custom-slug" />
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-slate-500">Excerpt</label>
                    <textarea className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm h-24" value={meta.excerpt} onChange={e => setMeta({...meta, excerpt: e.target.value})} />
                  </div>
                </>
              )}
              
              {activeTab === 'seo' && (
                <>
                  <Input label="Meta Title" value={meta.seoTitle} onChange={e => setMeta({...meta, seoTitle: e.target.value})} />
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-slate-500">Meta Desc</label>
                    <textarea className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm h-24" value={meta.seoDesc} onChange={e => setMeta({...meta, seoDesc: e.target.value})} />
                  </div>
                </>
              )}
              
              {activeTab === 'media' && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-slate-500">Cover Image</label>
                    
                    {meta.coverImage ? (
                      <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-slate-200 group">
                        <img src={meta.coverImage} alt="Cover" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={removeImage} className="p-2 bg-white rounded-full text-red-600 hover:bg-red-50">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:bg-slate-50 hover:border-indigo-400 transition-colors">
                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-full mb-2">
                            <Upload size={20} />
                        </div>
                        <span className="text-sm font-semibold text-slate-600">Click to upload</span>
                        <span className="text-[10px] text-slate-400 mt-1">PNG, JPG up to 5MB</span>
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                      </label>
                    )}
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-slate-200" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-[#F8F9FA] dark:bg-[#0c0c0e] px-2 text-slate-500">Or use URL</span>
                    </div>
                  </div>

                  <Input 
                    label="Image URL" 
                    value={meta.coverImage} 
                    onChange={e => setMeta({...meta, coverImage: e.target.value})} 
                    placeholder="https://..." 
                  />
                </div>
              )}
            </div>
        </div>
      </div>
    </div>
  );
}

// Subcomponents (BlockWrapper, EditableContent, Input, ToolbarBtn, SidebarTab) remain unchanged
const BlockWrapper = ({ block, isActive, updateBlock, deleteBlock, setFocus, addBlock }: any) => {
  let styles = "text-lg text-slate-600 dark:text-slate-300 leading-8"; 
  if (block.type === 'h1') styles = "text-4xl font-extrabold text-slate-900 leading-tight mb-4";
  if (block.type === 'h2') styles = "text-2xl font-bold text-slate-800 mt-8 mb-2";
  if (block.type === 'quote') styles = "text-xl italic border-l-4 border-indigo-500 pl-4 py-1 my-4";
  if (block.type === 'code') return (
      <div className="relative group my-6 bg-[#151515] rounded-xl border border-slate-800 overflow-hidden" onClick={() => setFocus(block.id)}>
         <div className="flex justify-between px-4 py-2 bg-[#1e1e1e] border-b border-slate-700">
           <div className="flex gap-2 pt-1"><div className="w-3 h-3 rounded-full bg-red-500"/><div className="w-3 h-3 rounded-full bg-yellow-500"/><div className="w-3 h-3 rounded-full bg-green-500"/></div>
           <span className="text-xs text-slate-500 font-mono">CODE</span>
         </div>
         <EditableContent tagName="pre" html={block.content} className="p-4 font-mono text-sm text-slate-300 outline-none" onChange={(h:string) => updateBlock(block.id, h)} onEnter={() => addBlock('p')} onBackspace={() => deleteBlock(block.id)} />
      </div>
  );

  return (
    <div className={`relative group ${isActive ? 'z-10' : ''}`} data-block-id={block.id} onClick={() => setFocus(block.id)}>
      {isActive && <button onClick={() => deleteBlock(block.id)} className="absolute -left-10 top-1 p-1 text-slate-300 hover:text-red-500"><Trash2 size={16}/></button>}
      <EditableContent tagName={block.type==='quote'?'blockquote':block.type==='p'?'p':block.type} html={block.content} className={`editable-empty outline-none ${styles}`} onChange={(h:string) => updateBlock(block.id, h)} onEnter={() => addBlock('p')} onBackspace={() => deleteBlock(block.id)} placeholder={block.type === 'p' ? "Type '/' for commands" : block.type} />
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
  <div className="space-y-1">
    <label className="text-xs font-bold uppercase text-slate-500">{label}</label>
    <input className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 ring-indigo-500/20" value={value} onChange={onChange} placeholder={placeholder} />
  </div>
);

const ToolbarBtn = ({ icon: Icon, onClick, active, label }: any) => (
  <button onClick={onClick} className={`p-2 rounded-lg flex gap-1 items-center ${active ? 'text-indigo-600 bg-indigo-50' : 'text-slate-500 hover:bg-slate-100'}`}>
    <Icon size={18} /> {label && <span className="text-xs font-bold">{label}</span>}
  </button>
);

const SidebarTab = ({ label, active, onClick, icon: Icon }: any) => (
  <button onClick={onClick} className={`flex-1 py-3 flex justify-center items-center gap-2 text-xs font-bold uppercase border-b-2 transition-colors ${active ? 'text-indigo-600 border-indigo-600' : 'text-slate-500 border-transparent hover:bg-slate-50'}`}>
    <Icon size={14} /> {label}
  </button>
);