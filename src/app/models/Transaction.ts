import { CATEGORIES } from "@/constant/categories";
import mongoose, { Schema, model, models } from "mongoose";

const TransactionSchema = new Schema(
  {
    amount: { type: Number, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
   
    category: { type: String, enum: CATEGORIES, required: true },
  },
  { timestamps: true }
);

export const Transaction =
  models.Transaction || model("Transaction", TransactionSchema);
