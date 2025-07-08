"use client";

import { TransactionForm } from "@/components/forms/TransactionForm";
import { TransactionList } from "@/components/forms/TransactionList";
import { BudgetForm } from "@/components/forms/BudgetForm";
import { BudgetList } from "@/components/forms/BudgetList";
import { MonthlyBarChart } from "@/components/charts/MonthlyBarChart";
import { CategoryPieChart } from "@/components/charts/CategoryPieChart";

export default function Home() {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* ────────── Sidebar ────────── */}
      <aside className="w-64 bg-white shadow-lg p-6 space-y-6 fixed h-full">
        <h1 className="text-xl font-bold">💰 Finance App</h1>
        <nav className="space-y-4 text-sm font-medium">
          <a href="#overview" className="block hover:text-blue-600">Overview</a>
          <a href="#charts" className="block hover:text-blue-600">Charts</a>
          <a href="#transactions" className="block hover:text-blue-600">Transactions</a>
          <a href="#budgets" className="block hover:text-blue-600">Budgets</a>
        </nav>
      </aside>

      {/* ────────── Main Content ────────── */}
      <main className="ml-64 flex-1 overflow-y-auto py-10 px-6">
        <div className="mx-auto max-w-screen-xl space-y-20">
          {/* ── Overview ── */}
          <section id="overview">
            <h2 className="text-3xl font-semibold mb-2">Overview</h2>
            <p className="text-muted-foreground">
              Welcome! Track, visualize, and plan your spending.
            </p>
          </section>

          {/* ── Charts ── */}
          <section id="charts" className="space-y-10">
            <h2 className="text-3xl font-semibold">Charts</h2>
            <MonthlyBarChart />
            <CategoryPieChart />
          </section>

          {/* ── Transactions ── */}
          <section id="transactions" className="space-y-10">
            <h2 className="text-3xl font-semibold">Transactions</h2>

            {/* Grid: Form ⬄ List */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-2xl shadow">
                <TransactionForm />
              </div>
              <div className="bg-white p-6 rounded-2xl shadow overflow-y-auto max-h-[28rem]">
                <TransactionList />
              </div>
            </div>
          </section>

          {/* ── Budgets ── */}
          <section id="budgets" className="space-y-10">
            <h2 className="text-3xl font-semibold">Budgets</h2>

            {/* Grid: Form ⬄ List */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-2xl shadow">
                <BudgetForm />
              </div>
              <div className="bg-white p-6 rounded-2xl shadow overflow-y-auto max-h-[28rem]">
                <BudgetList />
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
