import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MoreHorizontal, 
  ExternalLink, 
  Pencil, 
  Trash2, 
  Eye 
} from "lucide-react";
import Image from "next/image";

// Sample Data - This will eventually come from your Mongoose getRecentPosts service
const recentPosts = [
  {
    id: "1",
    title: "Mastering Next.js 15: The Future of Web",
    category: "Tech",
    views: "12,402",
    status: "Published",
    date: "2 hours ago",
    image: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?q=80&w=100&h=100&auto=format&fit=crop",
  },
  {
    id: "2",
    title: "Why Tailwind CSS is Every Developer's Friend",
    category: "Design",
    views: "8,120",
    status: "Published",
    date: "5 hours ago",
    image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=100&h=100&auto=format&fit=crop",
  },
  {
    id: "3",
    title: "10 Tips for Career Growth in 2026",
    category: "Career",
    views: "0",
    status: "Draft",
    date: "Yesterday",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=100&h=100&auto=format&fit=crop",
  },
  {
    id: "4",
    title: "The Rise of AI in Content Creation",
    category: "AI",
    views: "4,500",
    status: "Published",
    date: "2 days ago",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=100&h=100&auto=format&fit=crop",
  },
];

export function RecentActivity() {
  return (
    <Card className="border-none shadow-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Content Activity</CardTitle>
        <Button variant="ghost" size="sm" className="text-blue-600">View All</Button>
      </CardHeader>
      <CardContent>
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead>
              <tr className="border-b border-zinc-100 dark:border-zinc-800 transition-colors">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[400px]">Blog Post</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Views</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {recentPosts.map((post) => (
                <tr 
                  key={post.id} 
                  className="border-b border-zinc-100 dark:border-zinc-800 transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50"
                >
                  <td className="p-4 align-middle">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span className="font-semibold line-clamp-1">{post.title}</span>
                    </div>
                  </td>
                  <td className="p-4 align-middle">
                    <Badge 
                      variant={post.status === "Published" ? "default" : "secondary"}
                      className={post.status === "Published" ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/10" : ""}
                    >
                      {post.status}
                    </Badge>
                  </td>
                  <td className="p-4 align-middle font-medium">
                    <div className="flex items-center gap-1">
                      <Eye className="h-3.5 w-3.5 text-zinc-400" />
                      {post.views}
                    </div>
                  </td>
                  <td className="p-4 align-middle text-muted-foreground">
                    {post.date}
                  </td>
                  <td className="p-4 align-middle text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-500 hover:text-rose-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}