"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { format, parseISO } from "date-fns";

type Transaction = { amount: number; date: string };

type Budget = { month: string; budget: number }; // "YYYY-MM"

type MonthRow = {
  month: string;      // "Jul 2025"
  spent: number;      // total spent
  budget: number;     // total budget (0 if none)
};

export function MonthlyBarChart() {
  const [data, setData] = useState<MonthRow[]>([]);
  const [banner, setBanner] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch transactions and budgets in parallel
        const [txRes, budRes] = await Promise.all([
          fetch("/api/transactions"),
          fetch("/api/budget"),
        ]);

        const txJson: unknown = await txRes.json();
        const budJson: unknown = await budRes.json();

        if (!Array.isArray(txJson) || !Array.isArray(budJson)) {
          console.error("Expected arrays from APIs", { txJson, budJson });
          return;
        }

        const transactions = txJson as Transaction[];
        const budgets = budJson as Budget[];

        /* ---- Aggregate totals ---- */
        const monthMap = new Map<string, MonthRow>();

        // 1) Sum spent
        transactions.forEach((tx) => {
          const key = format(parseISO(tx.date), "MMM yyyy");
          const row = monthMap.get(key) || {
            month: key,
            spent: 0,
            budget: 0,
          };
          row.spent += tx.amount;
          monthMap.set(key, row);
        });

        // 2) Merge budgets
        budgets.forEach((b) => {
          // Convert "YYYY-MM" → "MMM yyyy"
          const parts = b.month.split("-");
          const key = format(new Date(+parts[0], +parts[1] - 1, 1), "MMM yyyy");
          const row = monthMap.get(key) || {
            month: key,
            spent: 0,
            budget: 0,
          };
          row.budget += b.budget;
          monthMap.set(key, row);
        });

        const chartData = Array.from(monthMap.values()).sort(
          (a, b) =>
            new Date(a.month + " 1").getTime() -
            new Date(b.month + " 1").getTime()
        );

        setData(chartData);

        /* ---- Banner for current month ---- */
        const currentKey = format(new Date(), "MMM yyyy");
        const current = monthMap.get(currentKey);
        if (current) {
          if (current.spent > current.budget && current.budget > 0) {
            setBanner(
              `⚠️ You are overspent by ₹${(
                current.spent - current.budget
              ).toLocaleString()} this month.`
            );
          } else if (current.budget > 0) {
            setBanner(
              `✅ ₹${(current.budget - current.spent).toLocaleString()} left in your budget this month.`
            );
          } else {
            setBanner(null);
          }
        }
      } catch (err) {
        console.error("Error fetching chart data:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-full mt-8">
      {banner && (
        <div
          className={`mb-4 rounded-lg px-4 py-2 text-sm ${
            banner.startsWith("⚠️") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
          }`}
        >
          {banner}
        </div>
      )}

      <div className="h-[340px] bg-white p-4 border rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Budget vs. Spending</h2>

        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="spent" name="Spent" fill="#3b82f6" />
            <Bar dataKey="budget" name="Budget" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
