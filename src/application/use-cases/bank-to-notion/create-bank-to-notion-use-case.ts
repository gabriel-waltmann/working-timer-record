import { BankToNotionRepository } from "../../../domain/repositories/bank-to-notion-repository";

export class CreateBankToNotionUseCase {
  constructor(readonly bankToNotionRepository: BankToNotionRepository) {}

  async execute(pdf: Express.Multer.File, bank: "inter" | "nubank") {
    return await this.bankToNotionRepository.create(pdf, bank);
  }
}