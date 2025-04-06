import mongoose, { Schema, Document } from "mongoose";

export interface BankToNotionLog extends Document {
  id: string;
  totalInvoices: number,
  bank: "inter" | "nubank",
  created_at: string,
  executed_at: string | null,
}

const bankToNotionSchema = new Schema<BankToNotionLog>({
  id: { type: String, required: true, unique: true },
  totalInvoices: { type: Number, required: true },
  bank: { type: String, required: true },
  created_at: Date,
  executed_at: Date,
});

export default mongoose.model<BankToNotionLog>("BankToNotionLog", bankToNotionSchema);