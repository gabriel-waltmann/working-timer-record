import { BankToNotionRepository } from "../../../domain/repositories/bank-to-notion-repository";

export class RetrievesBankToNotionUseCase {
  constructor(readonly bankToNotionRepository: BankToNotionRepository) {}

  async execute() {
    const bankToNotionLogs = await this.bankToNotionRepository.retrieves();

    return bankToNotionLogs;
  }
} 