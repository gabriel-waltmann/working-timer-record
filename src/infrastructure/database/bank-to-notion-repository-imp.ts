import BankToNotionModel from "./models/bank-to-notion";

import { BankToNotionRepository } from "../../domain/repositories/bank-to-notion-repository";

import { BankToNotionLog } from "../../domain/entities/bank-to-notion-log";

import queue from "../queue/bank-to-notion-queue";

export class BankToNotionRepositoryImp implements BankToNotionRepository {
  async create(pdf: Express.Multer.File, bank: "inter" | "nubank"): Promise<BankToNotionLog> {    
    try {
      const data: BankToNotionLog = {
        id: String(Date.now()),
        totalInvoices: 0,
        bank,
        created_at: new Date().toISOString(),
        executed_at: null
      };

      const bankToNotionLog = new BankToNotionModel(data);

      const job = await queue.add({ id: bankToNotionLog.id, pdf, bank });

      if (!job) {
        throw new Error("Could not add job to queue");
      }

      await bankToNotionLog.save();

      return bankToNotionLog;
    } catch (error) {
      console.error("Error creating bankToNotionLog:", error);

      throw new Error("Could not create bankToNotionLog");
    }
  }

  async retrieves(): Promise<BankToNotionLog[]> {
    try {
      const bankToNotionLogs = await BankToNotionModel.find();
  
      return bankToNotionLogs;
    } catch (error) {
      console.error("Error creating bankToNotionLog:", error);
      
      throw new Error("Could not retrieve bankToNotionLogs");
    }
  }
}