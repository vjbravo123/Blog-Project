"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";

interface ClientInteractionsProps {
  postId: string;
  initialLikes: number;
}

export default function ClientInteractions({ postId, initialLikes }: ClientInteractionsProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [hasLiked, setHasLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  // 1. Increment View on Mount
  useEffect(() => {
    const incrementView = async () => {
      // Basic check to prevent duplicate view counts in strict mode dev
      const viewedKey = `viewed_${postId}`;
      if (sessionStorage.getItem(viewedKey)) return;

      try {
        await fetch(`/api/posts/${postId}/view`, { method: "POST" });
        sessionStorage.setItem(viewedKey, "true");
      } catch (err) {
        console.error("Failed to count view", err);
      }
    };
    
    incrementView();
    
    // Check if user already liked this specific post in this session/browser
    if (localStorage.getItem(`liked_${postId}`)) {
        setHasLiked(true);
    }
  }, [postId]);

  // 2. Handle Like Click
  const handleLike = async () => {
    if (hasLiked || isLiking) return;

    setIsLiking(true);
    // Optimistic UI update
    setLikes((prev) => prev + 1);
    setHasLiked(true);

    try {
      const res = await fetch(`/api/posts/${postId}/like`, { method: "POST" });
      if (!res.ok) throw new Error("Failed");
      
      // Persist like state locally so user can't spam like
      localStorage.setItem(`liked_${postId}`, "true");
    } catch (error) {
      // Revert if failed
      setLikes((prev) => prev - 1);
      setHasLiked(false);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <button 
      onClick={handleLike}
      disabled={hasLiked}
      className={`
        group flex items-center gap-2 px-4 py-2 rounded-full border transition-all shadow-sm
        ${hasLiked 
          ? "bg-rose-50 border-rose-200 text-rose-600 cursor-default" 
          : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:border-rose-200 hover:text-rose-600"
        }
      `}
    >
      <Heart 
        size={18} 
        className={`transition-transform duration-300 ${hasLiked ? "fill-current scale-110" : "group-hover:scale-110"}`} 
      />
      <span className="text-sm font-bold">{likes}</span>
      {!hasLiked && <span className="text-xs font-medium hidden sm:inline">Like this post</span>}
    </button>
  );
}