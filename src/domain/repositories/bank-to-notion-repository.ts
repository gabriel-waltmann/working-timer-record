import { BankToNotionLog } from "../entities/bank-to-notion-log";

export interface BankToNotionRepository {
  create(
    pdf: Express.Multer.File,
    bank: "inter" | "nubank"
  ): Promise<BankToNotionLog>;

  retrieves(): Promise<BankToNotionLog[]>;
}