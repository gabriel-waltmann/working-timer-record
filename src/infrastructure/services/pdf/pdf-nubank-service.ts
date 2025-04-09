import { PDFExtractPage, PDFExtractText } from "pdf.js-extract";
import PdfService from "./pdf-service";
import { INotionDatabaseRow } from "../notion-service";
import * as DateUtil from "../../../shared/utils/date"

export class PdfNubankService {
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
    const pageTitle = "TRANSAÇÕES";
    
    return pages.filter(({ content }) => content.find(({ str }) => str === pageTitle));
  }

  extractExpiration(expensePages: PDFExtractPage[]): string | null {
    for (const { content } of expensePages) {
      for (const contentIndex in content) {
        const { str: text } = content[contentIndex];

        if (!text.includes("Data de vencimento:")) continue;

        const day = text.slice(20, 22);
        const monthStr = text.slice(23, 26);
        const month = DateUtil.getMonthByBrStr(monthStr);
        const year = text.slice(-4);

        const date = new Date(+year, +month - 1, +day);

        if (isNaN(date.getTime())) continue;

        return date.toISOString();
      }
    }

    return null;
  }

  extractCreatedAt(content: PDFExtractText[], contentDateIndex: number): string | null {
    const { str: createdAtBr } = content[contentDateIndex];

    // 01 JAN
    const dateRegex = /^\d{2}\s[A-Z]{3}$/;

    if (!createdAtBr.match(dateRegex)) return null;

    const day = createdAtBr.slice(0, 2);
    const monthStr = createdAtBr.slice(3, 6);
    const year = (new Date()).getFullYear();

    const month = DateUtil.getMonthByBrStr(monthStr);

    const date = new Date(+year, +month - 1, +day);

    if (isNaN(date.getTime())) return null;

    return date.toISOString();
  }

  extractValue (content: PDFExtractText[], contentDateIndex: number): number {
    const { str: value1 } = content[+contentDateIndex + 6 ];

    if (value1.includes("R$")) {
      return +value1.replace("R$", "").replace(".", "").replace(",", ".");
    }

    const { str: value2 } = content[+contentDateIndex + 8];

    if (value2.includes("R$")) {
      return +value2.replace("R$", "").replace(".", "").replace(",", ".");
    }

    return 0;
  }

  extractName(content: PDFExtractText[], contentIndex: number): string | null {
    const { str: name } = content[+contentIndex + 4]

    return name;
  }

  async extract(pdfPath: string): Promise<INotionDatabaseRow[]> {
    const pages = await this.pdfService.extractPages(pdfPath);
  
    const spendPages = await this.extractExpensePages(pages);

    console.log({ pages, spendPages });

    const data: INotionDatabaseRow[] = [];

    for (const { content } of spendPages) {
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
          type: "nubank-credit-card",
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