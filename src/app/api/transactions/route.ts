import { connectDB } from "@/app/lib/db";
import { Transaction } from "@/app/models/Transaction";
import { NextResponse } from "next/server";
import { CATEGORIES } from "@/constant/categories";


export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    if (!CATEGORIES.includes(body.category)) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    const newTransaction = await Transaction.create({
      amount: body.amount,
      description: body.description,
      date: body.date,
      category: body.category,
    });

    return NextResponse.json(newTransaction, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to create transaction" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    const transactions = await Transaction.find().sort({ date: -1 }).lean();

    console.log("🧪 typeof transactions:", typeof transactions);
    console.log("🧪 Array.isArray(transactions):", Array.isArray(transactions));
    console.log("🧪 transactions instanceof Array:", transactions instanceof Array);
    console.log("🧪 transactions:", transactions);


    return NextResponse.json(transactions, { status: 200 });
  } catch (err) {
    console.error("❌ GET /api/transactions error:", err);
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 });
  }
}

