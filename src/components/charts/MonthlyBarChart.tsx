"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { format, parseISO } from "date-fns";

type Transaction = {
  amount: number;
  date: string;
};

type MonthlyTotal = {
  month: string;
  total: number;
};

export function MonthlyBarChart() {
  const [data, setData] = useState<MonthlyTotal[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/transactions");
      const transactions: Transaction[] = await res.json();

      const monthlyTotals = new Map<string, number>();

      transactions.forEach((tx) => {
        const date = parseISO(tx.date);
        const key = format(date, "MMM yyyy"); // e.g., "Jul 2025"
        monthlyTotals.set(key, (monthlyTotals.get(key) || 0) + tx.amount);
      });

      const chartData: MonthlyTotal[] = Array.from(monthlyTotals.entries())
        .map(([month, total]) => ({ month, total }))
        .sort((a, b) =>
          new Date(a.month + " 1").getTime() - new Date(b.month + " 1").getTime()
        );

      setData(chartData);
    };

    fetchData();
  }, []);

  return (
    <div className="w-full h-[300px] mt-8 bg-white p-4 rounded-lg border shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Monthly Expenses</h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="total" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
