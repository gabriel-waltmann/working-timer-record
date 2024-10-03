import { WorkspaceTimer } from "../../../domain/entities/workspace-timer";
import { WorkspaceTimerRepository } from "../../../domain/repositories/workspace-timer-repository";

export class UpdateWorkspaceTimerUseCase {
  constructor(private workspaceTimerRepository: WorkspaceTimerRepository) {}

  async execute(workspaceTimerId: number, workspaceId: number, start: Date, end: Date): Promise<WorkspaceTimer | null> {
    return await this.workspaceTimerRepository.update(workspaceTimerId, workspaceId, start, end);
  }
}