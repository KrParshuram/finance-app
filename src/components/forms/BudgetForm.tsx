"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const CATEGORIES = [
  "Food",
  "Transport",
  "Rent",
  "Shopping",
  "Health",
  "Entertainment",
  "Other",
];

export function BudgetForm() {
  const currentMonth = new Date().toISOString().slice(0, 7); // Format: "YYYY-MM"
  const [month, setMonth] = useState(currentMonth);
  const [category, setCategory] = useState("");
  const [budget, setBudget] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!month || !category || !budget) {
      setMessage("❗ All fields are required.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/budget", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          month,
          category,
          budget: parseFloat(budget),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "❌ Failed to save budget.");
      } else {
        setMessage("✅ Budget saved successfully.");
        setBudget("");
        setCategory("");
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Server error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-6 border rounded-2xl shadow-md max-w-md mx-auto bg-white"
    >
      <h2 className="text-2xl font-semibold">💼 Set Monthly Budget</h2>

      {/* Month Input */}
      <div className="space-y-1">
        <Label htmlFor="month">Month</Label>
        <Input
          id="month"
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          required
        />
      </div>

      {/* Category Selector */}
      <div className="space-y-1">
        <Label htmlFor="category">Category</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger id="category">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Budget Input */}
      <div className="space-y-1">
        <Label htmlFor="budget">Budget Amount (₹)</Label>
        <Input
          id="budget"
          type="number"
          min={0}
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          placeholder="Enter amount"
          required
        />
      </div>

      {/* Submit Button */}
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Saving..." : "Save Budget"}
      </Button>

      {/* Feedback Message */}
      {message && (
        <p
          className={`text-sm mt-2 ${
            message.startsWith("✅") ? "text-green-600" : "text-red-500"
          }`}
        >
          {message}
        </p>
      )}
    </form>
  );
}
