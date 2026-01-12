import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, MessageSquare, BookOpen, TrendingUp } from "lucide-react";

const stats = [
  { label: "Total Views", value: "128,430", change: "+12.5%", icon: Eye, trend: "up" },
  { label: "Active Posts", value: "42", change: "+2 this week", icon: BookOpen, trend: "neutral" },
  { label: "Total Comments", value: "892", change: "+18.2%", icon: MessageSquare, trend: "up" },
  { label: "Avg. Reading Time", value: "4m 32s", change: "-2%", icon: TrendingUp, trend: "down" },
];

export function DashboardStats() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="border-none shadow-md bg-white dark:bg-zinc-900">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className={`text-xs mt-1 ${
              stat.trend === "up" ? "text-emerald-500" : stat.trend === "down" ? "text-rose-500" : "text-zinc-500"
            }`}>
              {stat.change}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}