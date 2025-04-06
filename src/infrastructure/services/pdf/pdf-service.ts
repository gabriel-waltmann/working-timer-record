import {PDFExtract, PDFExtractOptions, PDFExtractPage} from 'pdf.js-extract';
import fs from "fs";

export default class PdfService {
  constructor() {}

  async decrypt(pdf: Express.Multer.File, password?: string): Promise<any> {
    if (!fs.existsSync(pdf.path)) {
      throw new Error("PDF file not found");
    }

    const oldPath = pdf.path;
    const newPath = `${pdf.path}.pdf`;
    const decryptedPath = `${pdf.path}.decrypted.pdf`;

    await fs.promises.rename(oldPath, newPath);

    const { decrypt } = await import("node-qpdf2");

    await decrypt({ input: newPath, password, output: decryptedPath });

    await fs.promises.unlink(newPath);

    return decryptedPath;
  }

  async extractPages(pdfPath: string): Promise<PDFExtractPage[]> {
    const pdfBuffer = fs.readFileSync(pdfPath);

    const pdfExtract = new PDFExtract();

    const options: PDFExtractOptions = {}; 

    const data = await pdfExtract.extractBuffer(pdfBuffer, options);

    if (!data) return [];
      
    return data.pages;
  }
}