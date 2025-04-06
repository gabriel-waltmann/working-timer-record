import { Request, Response } from "express";

import { CreateBankToNotionUseCase } from "../../application/use-cases/bank-to-notion/create-bank-to-notion-use-case";
import { RetrievesBankToNotionUseCase } from "../../application/use-cases/bank-to-notion/retrieves-bank-to-notion-use-case";

export class BankToNotionController {
  constructor(
    private createBankToNotion: CreateBankToNotionUseCase,
    private retrievesBankToNotion: RetrievesBankToNotionUseCase
  ) {}

  async create(req: Request, res: Response): Promise<void> {
    if (!req.file) {
      res.status(400).json({ error: "Invalid request body. No PDF uploaded." });

      return;
    }

    if (!req.body.bank) {
      res.status(400).json({ error: "Invalid request body. No bank specified." });

      return;
    }

    const pdf: Express.Multer.File = req.file;

    if (pdf.mimetype !== 'application/pdf') {
      res.status(400).json({ error: "Invalid request body. Invalid file type - must be PDF." });

      return;
    }
    
    const log = await this.createBankToNotion.execute(
      pdf,
      req.body.bank,
    )

    if (!log) {
      res.status(500).json({ error: "Failed to create bank to notion log" });

      return;
    }

    res.status(201).json({ log });
  }

  async retrieves(req: Request, res: Response): Promise<void> {
    const logs = await this.retrievesBankToNotion.execute();

    res.status(200).json({ logs });
  }
}