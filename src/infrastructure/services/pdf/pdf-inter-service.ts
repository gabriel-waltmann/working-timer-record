import { PDFExtractPage, PDFExtractText } from "pdf.js-extract";
import PdfService from "./pdf-service";
import { INotionDatabaseRow } from "../notion-service";

export class PdfInterService {
  constructor(
    readonly pdfService: PdfService,
  ) {}
  
  async decrypt(pdf: Express.Multer.File, password?: string): Promise<string> {
    return this.pdfService.decrypt(pdf, password);
  }

  async extractPages(pdfPath: string): Promise<PDFExtractPage[]> {
    return await this.pdfService.extractPages(pdfPath);
  }

  async extractExpensePages(pages: PDFExtractPage[]): Promise<PDFExtractPage[]> {
    const pageTitle = "Despesas da fatura";
    
    return pages.filter(({ content }) => content.find(({ str }) => str === pageTitle));
  }

  extractExpiration(expensePages: PDFExtractPage[]): string | null {
    for (const { content } of expensePages) {
      for (const contentIndex in content) {
        const { str: text } = content[contentIndex];

        if (!text.includes("VENCIMENTO")) continue;

        const { str: expirationBr } = content[+contentIndex + 2];

        const [day, month, year] = expirationBr.split("/");

        const date = new Date(+year, +month - 1, +day);

        if (isNaN(date.getTime())) continue;

        return date.toISOString();
      }
    }

    return null;
  }

  extractCreatedAt(content: PDFExtractText[], contentDateIndex: number): string | null {
    const { str: createdAtBr } = content[contentDateIndex];

    // 01 de jan. 2000
    const dateRegex = /(\d{2})\s+de\s+([a-z]{3})\.\s+(\d{4})/i;

    if (!createdAtBr.match(dateRegex)) return null;

    const day = createdAtBr.slice(0, 2);
    const monthStr = createdAtBr.slice(6, 9);
    const year = createdAtBr.slice(-4);

    const months = {
      jan: "01",
      fev: "02",
      mar: "03",
      abr: "04",
      mai: "05",
      jun: "06",
      jul: "07",
      ago: "08",
      set: "09",
      out: "10",
      nov: "11",
      dez: "12",
    };

    const month = months[monthStr.toLowerCase() as keyof typeof months];

    const date = new Date(+year, +month - 1, +day);

    if (isNaN(date.getTime())) return null;

    return date.toISOString();
  }

  extractValue(content: PDFExtractText[], contentDateIndex: number): number {
    const { str: value1 } = content[+contentDateIndex + 6];

    if (value1.includes("R$")) {
      return +value1.replace("R$", "").replace(".", "").replace(",", ".");
    }

    const { str: value2 } = content[+contentDateIndex + 8];

    if (value2.includes("R$")) {
      return +value2.replace("R$", "").replace(".", "").replace(",", ".");
    }

    return 0;
  }

  extractName(content: PDFExtractText[], contentIndex: number): string {
    const { str: description } = content[+contentIndex + 2];

    return description;
  }

  async extract(pdfPath: string): Promise<INotionDatabaseRow[]> {
    const pages = await this.extractPages(pdfPath);

    const expensePages = await this.extractExpensePages(pages);
    
    console.log({ pages, expensePages });

    const data: INotionDatabaseRow[] = [];

    for (const { content } of expensePages) {
      for (const contentIndex in content) {
        const createdAt = this.extractCreatedAt(content, +contentIndex);

        console.log({ createdAt });

        if (!createdAt) continue;

        const expiration = this.extractExpiration(pages);

        console.log({ expiration });

        if (!expiration) continue;

        const value = this.extractValue(content, +contentIndex);

        console.log({ value });

        if (!value) continue;

        const name = this.extractName(content, +contentIndex);

        console.log({ name });
        
        if (!name) continue;

        data.push({ 
          category: "credit-card",
          type: "inter-credit-card",
          status: "pending",
          owner: "gabriel",
          createdAt, 
          expiration,
          name, 
          value,
        });
      }
    }

    return data;
  }
}