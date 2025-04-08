import config from "./config";
import Queue from "bull";
import NotionService, { INotionDatabaseRow } from "../services/notion-service";
import { PdfInterService } from "../services/pdf/pdf-inter-service";
import PdfService from "../services/pdf/pdf-service";
import { PdfNubankService } from "../services/pdf/pdf-nubank-service";
import dotenv from "dotenv";
import BankToNotionModel from "../database/models/bank-to-notion";
import fs from "fs";

dotenv.config();

const queue = new Queue("bank-to-notion", config);

queue.on("error", (err) => {
  console.error(err);
});

queue.on("failed", (job, err) => {
  console.error(`Job ${job.id} failed with error: ${err.message}`);
});

queue.process(handleProcessBankToNotion);

async function handleProcessBankToNotion(job: Queue.Job) {
  try {  
    const notionService = new NotionService();

    const pdfService = new PdfService();

    const pdfInterService = new PdfInterService(pdfService);

    const pdfNubankService = new PdfNubankService(pdfService);

    const { id, pdf, bank } = job.data;

    console.log({ id, pdf, bank });

    let transactions: INotionDatabaseRow[] = [];

    if (bank === "inter") {
      const password = process.env.INTER_PASSWORD;

      console.log({ INTER_PASSWORD: password });

      if (!password) throw new Error("INTER_PASSWORD not found.");

      const decryptedPdfPath = await pdfInterService.decrypt(pdf, password);

      console.log({ decryptedPdfPath });

      transactions = await pdfInterService.extract(decryptedPdfPath);

      await fs.promises.unlink(decryptedPdfPath);
    } else if (bank === "nubank") {
      const decryptedPdfPath = await pdfNubankService.decrypt(pdf);

      console.log({ decryptedPdfPath });

      transactions = await pdfNubankService.extract(decryptedPdfPath);

      await fs.promises.unlink(decryptedPdfPath);
    }

    console.log({ transactions });

    const databaseId = process.env.NOTION_DATABASE_ID;

    if (!databaseId) throw new Error("Database id not found.");

    console.log("Importing transactions to database: " + databaseId);

    const promises = transactions.map(transaction => (
      notionService.addRowToDatabase(databaseId, transaction)
    ));

    const results = await Promise.all(promises);

    console.log("Transactions imported to database: " + results);

    await BankToNotionModel.updateOne({ id }, { executed_at: new Date().toISOString() });
  } catch (error) {
    console.error("Error processing job:", error);
  }
}

export default queue;
