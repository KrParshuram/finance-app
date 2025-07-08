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
import { SummaryCards } from "@/components/forms/summaryCards";

/* ---------- types ---------- */
type Transaction = { amount: number; date: string; category?: string };
type Budget = { month: string; category: string; budget: number };
type Slice = { name: string; value: number; budget: number; overspent: boolean };

/* ---------- colors ---------- */
const COLOR_OK = "#10b981";
const COLOR_OVER = "#ef4444";
const COLOR_NONE = "#3b82f6";

/* ---------- simple hook to detect width ---------- */
function useScreen() {
  const [width, setWidth] = useState<number | null>(null);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    handleResize(); // set initial width on mount

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return width;
}

export function CategoryPieChart() {
  const width = useScreen();
const isMobile = width !== null && width < 640;         // Tailwind sm breakpoint
  const radius = isMobile ? 75 : 110;

  const [data, setData] = useState<Slice[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [empty, setEmpty] = useState(false);

  /* ---------- fetch + aggregate ---------- */
  useEffect(() => {
    (async () => {
      try {
        const monthKey = format(new Date(), "yyyy-MM");
        const [txRes, budRes] = await Promise.all([
          fetch("/api/transactions"),
          fetch(`/api/budget?month=${monthKey}`),
        ]);

        const txs = (await txRes.json()) as Transaction[];
        const budgets = (await budRes.json()) as Budget[];
        setTransactions(txs);

        const spent = new Map<string, number>();
        txs.forEach((t) => {
          if (!t.category) return;
          if (!isSameMonth(parseISO(t.date), new Date())) return;
          spent.set(t.category, (spent.get(t.category) || 0) + t.amount);
        });

        const budMap = new Map(budgets.map((b) => [b.category, b.budget]));
        const slices: Slice[] = [];
        spent.forEach((val, cat) =>
          slices.push({
            name: cat,
            value: val,
            budget: budMap.get(cat) ?? 0,
            overspent: (budMap.get(cat) ?? 0) > 0 && val > (budMap.get(cat) ?? 0),
          })
        );

        setEmpty(slices.length === 0);
        setData(slices);
      } catch (e) {
        console.error(e);
        setEmpty(true);
      }
    })();
  }, []);

  if (empty) {
    return (
      <div className="w-full h-64 mt-8 flex items-center justify-center border rounded-lg bg-white">
        <p className="text-muted-foreground">No data for this month yet.</p>
      </div>
    );
  }

  const getFill = (s: Slice) =>
    s.budget === 0 ? COLOR_NONE : s.overspent ? COLOR_OVER : COLOR_OK;

  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: any[];
  }) =>
    active && payload?.length ? (
      <div className="rounded-lg border bg-white p-2 text-sm shadow">
        <p className="font-medium">{payload[0].name}</p>
        <p>Spent: ₹{payload[0].value.toLocaleString()}</p>
        <p>Budget: ₹{payload[0].payload.budget?.toLocaleString() || "—"}</p>
      </div>
    ) : null;

  return (
    <>
      {/* KPI cards */}
      <SummaryCards
        transactions={transactions.map((t) => ({ ...t, category: t.category ?? "" }))}
      />

      {/* Pie chart */}
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
              outerRadius={radius}
              /* Hide slice labels on phones */
              label={isMobile ? false : ({ name }) => name}
            >
              {data.map((s, i) => (
                <Cell key={i} fill={getFill(s)} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              layout={isMobile ? "vertical" : "horizontal"}
              verticalAlign={isMobile ? "bottom" : "bottom"}
              align={isMobile ? "center" : "center"}
              iconSize={10}
              wrapperStyle={isMobile ? { marginTop: 8 } : undefined}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
