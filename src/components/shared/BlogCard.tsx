import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { Calendar, Clock } from "lucide-react";

interface BlogCardProps {
  post: any; // We will define a strict 'Post' type later
  isFeatured?: boolean;
}

export default function BlogCard({ post, isFeatured }: BlogCardProps) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block space-y-4">
      <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-zinc-100">
        <Image
          src={post.coverImage || "/placeholder-blog.jpg"}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {isFeatured && (
          <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold uppercase tracking-wider text-black backdrop-blur-md">
            Featured
          </span>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {format(new Date(post.createdAt), "MMM d, yyyy")}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            5 min read
          </span>
        </div>

        <h3 className={`font-bold leading-tight group-hover:text-primary transition-colors ${
          isFeatured ? "text-2xl" : "text-xl"
        }`}>
          {post.title}
        </h3>

        <p className="line-clamp-2 text-sm text-muted-foreground">
          {post.excerpt || "Click to read the full story and explore deep dives into modern tech."}
        </p>
      </div>
    </Link>
  );
}