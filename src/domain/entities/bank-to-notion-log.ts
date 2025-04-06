export class BankToNotionLog {
  constructor(
    public id: string,
    public totalInvoices: number,
    public bank: "inter" | "nubank",
    public created_at: string,
    public executed_at: string | null,
  ){}
}