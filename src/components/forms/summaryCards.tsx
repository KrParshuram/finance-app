"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useMemo } from "react";
import { format } from "date-fns";
import { IndianRupee, Calendar, ListTodo, PieChart } from "lucide-react";

type Txn = {
  amount: number;
  date: string | Date;
  category: string;
};

interface Props {
  transactions: Txn[];
}

export function SummaryCards({ transactions }: Props) {
  /* ------------ derived metrics ------------ */
  const stats = useMemo(() => {
    const total = transactions.reduce((sum, t) => sum + t.amount, 0);

    const currentMonth = format(new Date(), "yyyy-MM"); // "2025-07"
    const monthTotal = transactions
      .filter(
        (t) => format(new Date(t.date), "yyyy-MM") === currentMonth
      )
      .reduce((sum, t) => sum + t.amount, 0);

    const count = transactions.length;

    // spend per category
    const catMap = new Map<string, number>();
    for (const t of transactions) {
      catMap.set(t.category, (catMap.get(t.category) || 0) + t.amount);
    }
    const [topCat, topCatAmount] =
      [...catMap.entries()].sort((a, b) => b[1] - a[1])[0] || ["—", 0];

    return { total, monthTotal, count, topCat, topCatAmount };
  }, [transactions]);

  /* ------------ reusable card helper ------------ */
  const StatCard = ({
    icon,
    label,
    value,
  }: {
    icon: React.ReactNode;
    label: string;
    value: React.ReactNode;
  }) => (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <span className="text-sm font-medium text-muted-foreground">
          {label}
        </span>
        {icon}
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        icon={<IndianRupee className="h-5 w-5 text-primary" />}
        label="Total Spent"
        value={`₹${stats.total.toLocaleString()}`}
      />
      <StatCard
        icon={<Calendar className="h-5 w-5 text-primary" />}
        label="Spent This Month"
        value={`₹${stats.monthTotal.toLocaleString()}`}
      />
      <StatCard
        icon={<ListTodo className="h-5 w-5 text-primary" />}
        label="Transactions"
        value={stats.count}
      />
      <StatCard
        icon={<PieChart className="h-5 w-5 text-primary" />}
        label="Top Category"
        value={
          stats.topCat === "—"
            ? "—"
            : `${stats.topCat} (₹${stats.topCatAmount.toLocaleString()})`
        }
      />
    </section>
  );
}
