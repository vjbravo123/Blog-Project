"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Loader2, AlertCircle } from "lucide-react";

interface ChartData {
  name: string;
  views: number;
}

export function OverviewChart() {
  const [data, setData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await fetch('/api/dashboard/chart');
        if (!response.ok) throw new Error("Failed to fetch chart data");
        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error(err);
        setError("Could not load traffic data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchChartData();
  }, []);

  return (
    <Card className="border-none shadow-md bg-white dark:bg-zinc-900 h-full">
      <CardHeader>
        <CardTitle>Traffic Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full flex items-center justify-center">
          
          {/* 1. LOADING STATE */}
          {isLoading && (
            <div className="flex flex-col items-center gap-2 text-zinc-500">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
              <p className="text-sm">Loading analytics...</p>
            </div>
          )}

          {/* 2. ERROR STATE */}
          {!isLoading && error && (
            <div className="flex items-center gap-2 text-rose-500">
              <AlertCircle className="h-5 w-5" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {/* 3. CHART STATE */}
          {!isLoading && !error && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" strokeOpacity={0.5} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#9ca3af', fontSize: 12 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#9ca3af', fontSize: 12 }} 
                  tickFormatter={(value) => value >= 1000 ? `${(value/1000).toFixed(1)}k` : value} 
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                  cursor={{ stroke: '#6366f1', strokeWidth: 1 }}
                />
                <Area 
                  type="monotone" 
                  dataKey="views" 
                  stroke="#6366f1" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorViews)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}