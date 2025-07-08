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
import { parseISO, isSameMonth, format } from "date-fns";

type Transaction = {
  amount: number;
  date: string;
  category?: string;
};

type Budget = {
  month: string;     // "YYYY-MM"
  category: string;
  budget: number;
};

type Slice = {
  name: string;
  value: number;     // spent
  budget: number;    // allocated
  overspent: boolean;
};

/* ───────── colors ───────── */
const COLOR_OK = "#10b981";   // green‑500
const COLOR_OVER = "#ef4444"; // red‑500
const COLOR_NONE = "#3b82f6"; // blue‑500 (no budget)

export function CategoryPieChart() {
  const [data, setData] = useState<Slice[]>([]);
  const [empty, setEmpty] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const monthKey = format(new Date(), "yyyy-MM");

        const [txRes, budRes] = await Promise.all([
          fetch("/api/transactions"),
          fetch(`/api/budget?month=${monthKey}`),
        ]);

        const txJson: unknown = await txRes.json();
        const budJson: unknown = await budRes.json();

        if (!Array.isArray(txJson) || !Array.isArray(budJson)) {
          console.error("Expected arrays from APIs", { txJson, budJson });
          setEmpty(true);
          return;
        }

        const txs = txJson as Transaction[];
        const budgets = budJson as Budget[];

        /* ---- aggregate spent ---- */
        const spentMap = new Map<string, number>();

        txs.forEach((tx) => {
          if (!tx.category) return;
          if (!isSameMonth(parseISO(tx.date), new Date())) return;
          spentMap.set(tx.category, (spentMap.get(tx.category) || 0) + tx.amount);
        });

        /* ---- map budgets ---- */
        const budMap = new Map<string, number>();
        budgets.forEach((b) => {
          budMap.set(b.category, b.budget);
        });

        /* ---- build slices ---- */
        const slices: Slice[] = [];
        spentMap.forEach((spent, cat) => {
          const budget = budMap.get(cat) ?? 0;
          slices.push({
            name: cat,
            value: spent,
            budget,
            overspent: budget > 0 && spent > budget,
          });
        });

        setEmpty(slices.length === 0);
        setData(slices);
      } catch (err) {
        console.error("Pie chart fetch error:", err);
        setEmpty(true);
      }
    };

    fetchData();
  }, []);

  if (empty) {
    return (
      <div className="w-full h-[260px] mt-8 flex items-center justify-center border rounded-lg bg-white">
        <p className="text-muted-foreground">
          No data for this month yet.
        </p>
      </div>
    );
  }

  /* ---- pick color per slice ---- */
  const getFill = (slice: Slice) =>
    slice.budget === 0
      ? COLOR_NONE          // no budget set
      : slice.overspent
      ? COLOR_OVER          // spent > budget
      : COLOR_OK;           // within budget

  /* ---- custom tooltip ---- */
  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: any[];
  }) => {
    if (active && payload && payload.length) {
      const { name, value, payload: row } = payload[0];
      const diff = row.budget - value;
      return (
        <div className="rounded-lg border bg-white p-2 text-sm shadow">
          <p className="font-medium">{name}</p>
          <p>Spent: ₹ {value.toLocaleString()}</p>
          <p>Budget: ₹ {row.budget?.toLocaleString() || "—"}</p>
          {row.budget > 0 && (
            <p className={diff < 0 ? "text-red-600" : "text-green-600"}>
              {diff < 0
                ? `Over by ₹${Math.abs(diff).toLocaleString()}`
                : `Under by ₹${diff.toLocaleString()}`}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[320px] mt-8 bg-white p-4 rounded-lg border shadow-sm">
      <h2 className="text-lg font-semibold mb-4">
        Category Breakdown vs Budget (this month)
      </h2>

      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            label={({ name }) => name}
            outerRadius={110}
          >
            {data.map((slice, idx) => (
              <Cell key={idx} fill={getFill(slice)} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend layout="horizontal" verticalAlign="bottom" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
