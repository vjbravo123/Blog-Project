"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ExternalLink, 
  Pencil, 
  Trash2, 
  Eye,
  Loader2,
  AlertCircle
} from "lucide-react";
import Image from "next/image";

// --- TYPES ---
interface RecentPost {
  id: string;
  title: string;
  category: string;
  views: number;
  status: "Published" | "Draft";
  createdAt: string;
  updatedAt: string;
  image: string;
  slug: string;
}

// --- HELPER: Format Date to "Time Ago" ---
const formatTimeAgo = (dateString: string) => {
  if (!dateString) return "Unknown";
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  
  return date.toLocaleDateString(); 
};

export function RecentActivity() {
  const [posts, setPosts] = useState<RecentPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchRecentPosts();
  }, []);

  const fetchRecentPosts = async () => {
    try {
      const response = await fetch('/api/dashboard/recent');
      if (!response.ok) throw new Error("Failed to fetch posts");
      const data = await response.json();
      setPosts(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load recent activity");
    } finally {
      setIsLoading(false);
    }
  };

  // --- DELETE FUNCTION ---
  const handleDelete = async (postId: string) => {
    if (!window.confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
      return;
    }

    setIsDeleting(postId);

    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error("Failed to delete post");

      // Remove the deleted post from the UI instantly
      setPosts((prev) => prev.filter((post) => post.id !== postId));

    } catch (error) {
      alert("Error deleting post. Please try again.");
      console.error(error);
    } finally {
      setIsDeleting(null);
    }
  };

  const formatViews = (num: number) => {
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  // --- HELPER: Clean Slug URL ---
  // This fixes the issue where "yoyo honey singh" becomes "yoyo%20honey%20singh"
  const getPostUrl = (slug: string) => {
    if (!slug) return "#";
    // Replace any whitespace with a hyphen to ensure a clean URL
    const cleanSlug = slug.trim().replace(/\s+/g, "-");
    return `/blog/${cleanSlug}`;
  };

  return (
    <Card className="border-none shadow-md bg-white dark:bg-zinc-900 h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Content Activity</CardTitle>
        <Link href="/dashboard/">
          <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:hover:bg-zinc-800">
            View All
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-10 gap-2 text-zinc-500">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            <p className="text-sm">Loading recent posts...</p>
          </div>
        )}

        {!isLoading && error && (
          <div className="flex items-center gap-2 p-4 text-rose-500 bg-rose-50 dark:bg-rose-900/10 rounded-lg">
            <AlertCircle className="h-5 w-5" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {!isLoading && !error && posts.length === 0 && (
          <div className="text-center py-10 text-zinc-400">
            <p>No posts found. Start writing!</p>
            {/* Fixed Link to point to dashboard posts page */}
            <Link href="/dashboard/">
              <Button className="mt-4 bg-indigo-600">Create Post</Button>
            </Link>
          </div>
        )}

        {!isLoading && !error && posts.length > 0 && (
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead>
                <tr className="border-b border-zinc-100 dark:border-zinc-800 transition-colors">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[45%]">Blog Post</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Views</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Last Updated</th>
                  <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {posts.map((post) => (
                  <tr 
                    key={post.id} 
                    className="border-b border-zinc-100 dark:border-zinc-800 transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50"
                  >
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 min-w-10 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-100">
                          {post.image ? (
                            <Image
                              src={post.image}
                              alt={post.title}
                              fill
                              className="object-cover"
                              sizes="40px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-zinc-400">Img</div>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold line-clamp-1 max-w-[200px] text-zinc-900 dark:text-zinc-100">
                            {post.title}
                          </span>
                          <span className="text-xs text-zinc-500">{post.category}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      <Badge 
                        variant={post.status === "Published" ? "default" : "secondary"}
                        className={`font-medium ${
                          post.status === "Published" 
                            ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-200" 
                            : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400"
                        }`}
                      >
                        {post.status}
                      </Badge>
                    </td>
                    <td className="p-4 align-middle font-medium text-zinc-700 dark:text-zinc-300">
                      <div className="flex items-center gap-1.5">
                        <Eye className="h-3.5 w-3.5 text-zinc-400" />
                        {formatViews(post.views)}
                      </div>
                    </td>
                    <td className="p-4 align-middle text-muted-foreground whitespace-nowrap">
                      {formatTimeAgo(post.updatedAt || post.createdAt)}
                    </td>
                    <td className="p-4 align-middle text-right">
                      <div className="flex justify-end gap-1">
                        <Link href={`/dashboard/editor/${post.id}`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-indigo-600">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                        
                        {post.status === 'Published' && (
                          // --- FIXED LINK HERE: Uses getPostUrl helper ---
                          <Link href={getPostUrl(post.slug)} target="_blank">
                             <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-indigo-600">
                               <ExternalLink className="h-4 w-4" />
                             </Button>
                          </Link>
                        )}
                        
                        <Button 
                          onClick={() => handleDelete(post.id)}
                          disabled={isDeleting === post.id}
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20"
                        >
                          {isDeleting === post.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}