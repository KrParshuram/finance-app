import mongoose from "mongoose";

/* ------------  Allowed categories  ------------ */
export const CATEGORIES = [
  "Food",
  "Transport",
  "Rent",
  "Shopping",
  "Health",
  "Entertainment",
  "Other",
] as const;
type Category = (typeof CATEGORIES)[number];

/* ------------  Schema definition  ------------ */
const BudgetSchema = new mongoose.Schema(
  {
    month: {
      type: String,            // Format: "YYYY-MM"
      required: true,
      match: /^\d{4}-\d{2}$/,  // Simple regex guard
    },
    category: {
      type: String,
      required: true,
      enum: CATEGORIES,
    },
    budget: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true }
);

/*  Prevent duplicate budgets for same month‑category  */
BudgetSchema.index({ month: 1, category: 1 }, { unique: true });

export interface IBudget extends mongoose.Document {
  month: string;
  category: Category;
  budget: number;
}

export const Budget =
  mongoose.models.Budget || mongoose.model<IBudget>("Budget", BudgetSchema);
