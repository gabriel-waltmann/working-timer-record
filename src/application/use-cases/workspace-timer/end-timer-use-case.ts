import { WorkspaceTimer } from "../../../domain/entities/workspace-timer";
import { WorkspaceTimerRepository } from "../../../domain/repositories/workspace-timer-repository";

export class EndTimerUseCase {
  constructor(private workspaceTimerRepository: WorkspaceTimerRepository) {}

  async execute(timerId: number): Promise<WorkspaceTimer | null> {
    return await this.workspaceTimerRepository.end(timerId);
  }
}