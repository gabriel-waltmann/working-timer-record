import { WorkspaceTimer } from "../../../domain/entities/workspace-timer";
import { WorkspaceTimerRepository } from "../../../domain/repositories/workspace-timer-repository";


export class CreateWorkspaceTimerUseCase {
  constructor(readonly workspaceTimerRepository: WorkspaceTimerRepository) {}

  async execute(workspaceTimerId: number, start?: Date, end?: Date): Promise<WorkspaceTimer | null> {
    return await this.workspaceTimerRepository.create(workspaceTimerId, start, end);
  }
}