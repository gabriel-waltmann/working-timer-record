import { PDFExtractPage, PDFExtractText } from "pdf.js-extract";
import PdfService from "./pdf-service";
import { INotionDatabaseRow } from "../notion-service";

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
    const pageTitle = "Despesas";
    
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
    const { str: createdAtDayStr } = content[contentDateIndex];

    const createdAtDayNum = Number(createdAtDayStr);

    if (isNaN(createdAtDayNum) || !createdAtDayNum) return null;
        
    const { str: createdAtMonthStr } = content[+contentDateIndex + 4];

    const month = months[createdAtMonthStr.toLowerCase() as keyof typeof months];
        
    if (!month) return null;

    // . YYYY
    let { str: createdAtYearStr } = content[+contentDateIndex + 5];

    if (!createdAtYearStr.includes(".")) return null;

    createdAtYearStr = createdAtYearStr.replace(".", "");

    if (isNaN(+createdAtYearStr)) return null;


    const date = new Date(+createdAtYearStr, +month - 1, createdAtDayNum);

    if (isNaN(date.getTime())) return null;

    return date.toISOString();
  }

  extractValue(content: PDFExtractText[], contentDateIndex: number): number {
    const value = -1;
    let currentIndex = contentDateIndex;

    while (value === -1) {
      currentIndex++;

      const { str: currencyStr } = content[currentIndex];

      if (currencyStr === undefined) return 0;

      if (!currencyStr?.includes("R$")) continue;
        
      const { str: valueStr } = content[currentIndex + 2];

      if (valueStr === undefined) return 0;

      return +valueStr.replace(".", "").replace(",", ".");
    }

    return 0;
  }

  extractName(content: PDFExtractText[], contentIndex: number): string {
    const { str: description } = content[+contentIndex + 7];

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