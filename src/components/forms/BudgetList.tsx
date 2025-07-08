"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

type Budget = {
  _id: string;
  month: string;
  category: string;
  budget: number;
};

const INITIAL_DISPLAY_COUNT = 5;

export function BudgetList() {
  const currentMonth = format(new Date(), "yyyy-MM");
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const res = await fetch(`/api/budget?month=${currentMonth}`);
        const data = await res.json();

        if (!res.ok || !Array.isArray(data)) {
          throw new Error(data?.error || "Unexpected response from server");
        }

        setBudgets(data);
      } catch (err: any) {
        console.error("❌ Error fetching budgets:", err);
        setError(err.message || "Failed to load budgets");
      } finally {
        setLoading(false);
      }
    };

    fetchBudgets();
  }, [currentMonth]);

  if (loading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-20 w-full rounded-xl" />
        <Skeleton className="h-20 w-full rounded-xl" />
      </div>
    );
  }

  if (error) return <p className="text-sm text-red-500">{error}</p>;
  if (budgets.length === 0) return <p className="text-muted-foreground">No budgets set for this month.</p>;

  const visibleBudgets = showAll ? budgets : budgets.slice(0, INITIAL_DISPLAY_COUNT);

  return (
    <div className="space-y-3">
      {visibleBudgets.map((b) => (
        <Card key={b._id} className="shadow-sm hover:shadow-md transition-all">
          <CardContent className="flex justify-between items-center p-4">
            <div>
              <p className="font-medium capitalize">{b.category}</p>
              <Badge variant="outline" className="mt-1 text-xs">
                {b.month}
              </Badge>
            </div>
            <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
              ₹ {b.budget.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      ))}

      {budgets.length > INITIAL_DISPLAY_COUNT && (
        <div className="pt-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => setShowAll((prev) => !prev)}
          >
            {showAll ? "Show Less" : "See More"}
          </Button>
        </div>
      )}
    </div>
  );
}
