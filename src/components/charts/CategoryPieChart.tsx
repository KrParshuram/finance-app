"use client";

import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { parseISO, isSameMonth } from "date-fns";
import { CATEGORIES } from "@/constant/categories";

type Transaction = {
  amount: number;
  date: string;
  category?: string;
};

type Slice = {
  name: string;
  value: number;
};

// a handful of pleasant tailwind colors; tweak if you like
const COLORS = [
  "#3b82f6", // blue‑500
  "#10b981", // emerald‑500
  "#f97316", // orange‑500
  "#6366f1", // indigo‑500
  "#ec4899", // pink‑500
  "#f59e0b", // amber‑500
  "#14b8a6", // teal‑500
  "#a855f7", // violet‑500
];

export function CategoryPieChart() {
  const [data, setData] = useState<Slice[]>([]);
  const [empty, setEmpty] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/transactions");
      const txs: Transaction[] = await res.json();

      const now = new Date();
      const totals = new Map<string, number>();

      txs.forEach((tx) => {
        if (!tx.category) return; // skip uncategorised
        if (!isSameMonth(parseISO(tx.date), now)) return; // only this month
        totals.set(tx.category, (totals.get(tx.category) || 0) + tx.amount);
      });

      const slices: Slice[] = Array.from(totals.entries()).map(
        ([name, value]) => ({ name, value })
      );

      setEmpty(slices.length === 0);
      setData(slices);
    };

    fetchData();
  }, []);

  if (empty) {
    return (
      <div className="w-full h-[260px] mt-8 flex items-center justify-center border rounded-lg bg-white">
        <p className="text-muted-foreground">
          No transactions for this month yet.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-[300px] mt-8 bg-white p-4 rounded-lg border shadow-sm">
      <h2 className="text-lg font-semibold mb-4">
        Category Breakdown (this month)
      </h2>

      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            label
            outerRadius={100}
          >
            {data.map((_, idx) => (
              <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend layout="horizontal" verticalAlign="bottom" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
