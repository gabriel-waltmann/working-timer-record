import { WorkspaceTimerRepository } from "../../../domain/repositories/workspace-timer-repository";

export class RetrievesOneTimerUseCase {
  constructor(readonly workspaceTimerRepository: WorkspaceTimerRepository) {}

  async execute(id: number) {
    return await this.workspaceTimerRepository.retrievesOne(id);
  }
}