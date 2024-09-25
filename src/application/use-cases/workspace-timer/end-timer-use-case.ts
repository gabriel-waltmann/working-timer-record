import { WorkspaceTimerRepository } from "../../../domain/repositories/workspace-timer-repository";

export class EndTimerUseCase {
  constructor(private workspaceTimerRepository: WorkspaceTimerRepository) {}

  async execute(timerId: number) {
    await this.workspaceTimerRepository.end(timerId);
  }
}