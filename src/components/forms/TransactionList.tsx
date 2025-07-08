"use client";

import { useEffect, useState } from "react";

type Transaction = {
  _id: string;
  amount: number;
  description: string;
  date: string;
  category?: string;
};

const INITIAL_DISPLAY_COUNT = 4;

export function TransactionList() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await fetch("/api/transactions");
        const data = await res.json();

        if (!Array.isArray(data)) {
          throw new Error("API returned non-array data");
        }

        setTransactions(data);
      } catch (err) {
        console.error("Error fetching transactions:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) return <p>Loading transactions...</p>;
  if (error) return <p className="text-red-500">Failed to load transactions.</p>;
  if (transactions.length === 0) return <p>No transactions yet.</p>;

  const visibleTransactions = showAll
    ? transactions
    : transactions.slice(0, INITIAL_DISPLAY_COUNT);

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-2">Transaction History</h2>
      <ul className="space-y-2">
        {visibleTransactions.map((tx) => (
          <li
            key={tx._id}
            className="p-3 border rounded-md flex justify-between items-center bg-white shadow-sm"
          >
            <div>
              <p className="font-medium">{tx.description}</p>
              <p className="text-sm text-muted-foreground">
                {new Date(tx.date).toLocaleDateString()}
              </p>
              {tx.category && (
                <p className="text-sm text-blue-500 capitalize">{tx.category}</p>
              )}
            </div>
            <p className="font-semibold">₹ {tx.amount.toFixed(2)}</p>
          </li>
        ))}
      </ul>

      {transactions.length > INITIAL_DISPLAY_COUNT && (
        <button
          className="mt-4 text-blue-600 hover:underline text-sm"
          onClick={() => setShowAll((prev) => !prev)}
        >
          {showAll ? "Show Less" : "See More"}
        </button>
      )}
    </div>
  );
}
