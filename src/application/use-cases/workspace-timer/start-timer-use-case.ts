import { WorkspaceTimer } from "../../../domain/entities/workspace-timer";
import { WorkspaceTimerRepository } from "../../../domain/repositories/workspace-timer-repository";

export class StartTimerUseCase {
  constructor(private workspaceTimerRepository: WorkspaceTimerRepository) {}

  async execute(workspaceId: number): Promise<WorkspaceTimer | null> {
    return await this.workspaceTimerRepository.start(workspaceId);
  }
}