import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import { Budget } from "@/app/models/Budget";

/* ----------------  GET /api/budgets  ----------------
   Query params:
     ?month=YYYY-MM      → filter by month (optional)
------------------------------------------------------*/
export async function GET(req: NextRequest) {
  await connectDB();

  const month = req.nextUrl.searchParams.get("month"); // e.g. 2025-07
  const filter = month ? { month } : {};

  const budgets = await Budget.find(filter).sort({ category: 1 });
  return NextResponse.json(budgets, { status: 200 });
}

/* ----------------  POST /api/budgets  ---------------
   Body:
   {
     "month": "2025-07",
     "category": "Food",
     "budget": 4000
   }

   Logic:
   - If a budget for the same month & category exists → update it
   - Else → create new
------------------------------------------------------*/
export async function POST(req: NextRequest) {
  await connectDB();

  const { month, category, budget } = await req.json();

  if (!month || !category || budget == null)
    return NextResponse.json(
      { message: "month, category, and budget are required" },
      { status: 400 }
    );

  try {
    const doc = await Budget.findOneAndUpdate(
      { month, category },
      { month, category, budget },
      { upsert: true, new: true, runValidators: true }
    );

    return NextResponse.json(doc, { status: 200 });
  } catch (err: any) {
    // duplicate key or validation error
    return NextResponse.json(
      { message: err.message ?? "Server error" },
      { status: 500 }
    );
  }
}
