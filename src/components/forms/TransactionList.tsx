'use client';

import { useEffect, useState } from "react";

type Transaction = {
  _id: string;
  amount: number;
  description: string;
  date: string;
  category?: string; // ✅ optional, if not all transactions have it yet
};

export function TransactionList() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await fetch("/api/transactions");
        const data = await res.json();
        setTransactions(data);
        console.log("Fetched transactions:", data);
      } catch (err) {
        console.error("Error fetching transactions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) return <p>Loading transactions...</p>;
  if (transactions.length === 0) return <p>No transactions yet.</p>;

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-2">Transaction History</h2>
      <ul className="space-y-2">
        {transactions.map((tx) => (
          <li
            key={tx._id}
            className="p-3 border rounded-md flex justify-between items-center"
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
    </div>
  );
}
