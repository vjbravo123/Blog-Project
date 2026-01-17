"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from "recharts";
import { Loader2, AlertCircle } from "lucide-react";

interface CategoryData {
  name: string;
  total: number;
}

const COLORS = ["#2563eb", "#7c3aed", "#db2777", "#ea580c", "#10b981", "#f59e0b"];

export function CategoryDistribution() {
  const [data, setData] = useState<CategoryData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/dashboard/categories');
        if (!response.ok) throw new Error("Failed to fetch categories");
        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error(err);
        setError("Could not load category data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <Card className="border-none shadow-md bg-white dark:bg-zinc-900 h-full">
      <CardHeader>
        <CardTitle>Views by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full flex items-center justify-center">
          
          {/* 1. LOADING STATE */}
          {isLoading && (
            <div className="flex flex-col items-center gap-2 text-zinc-500">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
              <p className="text-sm">Loading categories...</p>
            </div>
          )}

          {/* 2. ERROR STATE */}
          {!isLoading && error && (
            <div className="flex items-center gap-2 text-rose-500">
              <AlertCircle className="h-5 w-5" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

           {/* 3. EMPTY STATE */}
           {!isLoading && !error && data.length === 0 && (
            <div className="text-zinc-400 text-sm text-center">
              No category data available yet.
            </div>
          )}

          {/* 4. CHART STATE */}
          {!isLoading && !error && data.length > 0 && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} layout="vertical" margin={{ left: 10, right: 10 }}>
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  width={100} // Increased width for category names
                  tick={{ fill: '#9ca3af', fontSize: 13, fontWeight: 500 }}
                />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '8px', color: '#fff' }}
                />
                <Bar dataKey="total" radius={[0, 4, 4, 0]} barSize={32}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}