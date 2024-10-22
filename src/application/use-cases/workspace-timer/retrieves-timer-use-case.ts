import { WorkspaceTimerStatus } from "../../../domain/entities/workspace-timer";
import { WorkspaceTimerRepository } from "../../../domain/repositories/workspace-timer-repository";

export class RetrievesTimerUseCase {
  constructor(readonly workspaceTimerRepository: WorkspaceTimerRepository) {}

  async execute(status?: WorkspaceTimerStatus) {
    return await this.workspaceTimerRepository.retrieves(status);
  }
}