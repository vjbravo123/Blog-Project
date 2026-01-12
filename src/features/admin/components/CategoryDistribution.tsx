    "use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";

const data = [
  { name: "Tech", total: 450 },
  { name: "Design", total: 300 },
  { name: "Career", total: 200 },
  { name: "Lifestyle", total: 150 },
];

const COLORS = ["#2563eb", "#7c3aed", "#db2777", "#ea580c"];

export function CategoryDistribution() {
  return (
    <Card className="border-none shadow-md h-full">
      <CardHeader>
        <CardTitle>Views by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical">
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={80} />
              <Bar dataKey="total" radius={[0, 4, 4, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}