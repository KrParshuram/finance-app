import { TransactionForm } from "@/components/forms/TransactionForm";
import { TransactionList } from "@/components/forms/TransactionList";
import {MonthlyBarChart} from "@/components/charts/MonthlyBarChart";
import { CategoryPieChart } from "@/components/charts/CategoryPieChart";

export default function Home() {
  return (
    <main className="p-6">
  <h1 className="text-2xl font-bold">Personal Finance Visualizer</h1>
  <p className="text-muted-foreground mt-2">
    Track your income and expenses
  </p>

  <MonthlyBarChart /> 
  <CategoryPieChart/>
  {/* 👈 Insert here or below */}

  <div className="mt-8 flex flex-col md:flex-row gap-10 py-10">
    <div className="md:w-1/3">
      <TransactionForm />
    </div>
    <div className="md:flex-1">
      <TransactionList />
    </div>
  </div>
</main>
  );
}

