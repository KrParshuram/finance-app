"use client";

import { useState } from "react";
import { Menu } from "lucide-react";

import { TransactionForm } from "@/components/forms/TransactionForm";
import { TransactionList } from "@/components/forms/TransactionList";
import { BudgetForm } from "@/components/forms/BudgetForm";
import { BudgetList } from "@/components/forms/BudgetList";
import { MonthlyBarChart } from "@/components/charts/MonthlyBarChart";
import { CategoryPieChart } from "@/components/charts/CategoryPieChart";

/* ── Simple backdrop for mobile drawer ── */
function Backdrop({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 bg-black/40 md:hidden z-30"
      onClick={onClose}
    />
  );
}

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* ---- sidebar markup (re‑used on md+ and mobile) ---- */
  const Sidebar = (
    <aside className="flex flex-col w-64 bg-white shadow-lg p-6 space-y-6 h-full">
      <h1 className="text-xl font-bold">💰 Finance App</h1>

      <nav className="space-y-4 text-sm font-medium">
        <a href="#overview" className="block hover:text-blue-600">
          Overview
        </a>
        <a href="#charts" className="block hover:text-blue-600">
          Charts
        </a>
        <a href="#transactions" className="block hover:text-blue-600">
          Transactions
        </a>
        <a href="#budgets" className="block hover:text-blue-600">
          Budgets
        </a>
      </nav>
    </aside>
  );

  return (
    <div className="h-screen w-full bg-gray-100 flex">
      {/* ────────── Mobile Drawer ────────── */}
      <div
        className={`fixed inset-y-0 left-0 z-40 transform transition-transform duration-200 md:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {Sidebar}
      </div>
      <Backdrop open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* ────────── Static Sidebar on md+ ────────── */}
      <div className="hidden md:block md:fixed md:inset-y-0 md:left-0 md:w-64">
        {Sidebar}
      </div>

      {/* ────────── Main Content ────────── */}
      <main
        className="flex-1 overflow-y-auto py-10 px-4 sm:px-6 md:pl-72"
       
      >
        {/* ---- Top bar with hamburger on mobile ---- */}
        <header className="md:hidden mb-6 flex items-center">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md border bg-white shadow"
          >
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="ml-4 text-xl font-bold">Personal Finance Dashboard</h1>
        </header>

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
            <div className="bg-white p-4 rounded-2xl shadow">
              <MonthlyBarChart />
            </div>
            <div className="bg-white p-4 rounded-2xl shadow min-h-[420px]">
              <CategoryPieChart />
            </div>
          </section>

          {/* ── Transactions ── */}
          <section id="transactions" className="space-y-10">
            <h2 className="text-3xl font-semibold">Transactions</h2>

            {/* Grid: Form ⬄ List */}
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-2xl shadow">
                <TransactionForm />
              </div>
              <div className="bg-white p-6 rounded-2xl shadow max-h-[28rem] overflow-y-auto">
                <TransactionList />
              </div>
            </div>
          </section>

          {/* ── Budgets ── */}
          <section id="budgets" className="space-y-10">
            <h2 className="text-3xl font-semibold">Budgets</h2>

            {/* Grid: Form ⬄ List */}
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-2xl shadow">
                <BudgetForm />
              </div>
              <div className="bg-white p-6 rounded-2xl shadow max-h-[28rem] overflow-y-auto">
                <BudgetList />
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
