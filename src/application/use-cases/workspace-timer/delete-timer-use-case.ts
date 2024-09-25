import { WorkspaceTimerRepository } from "../../../domain/repositories/workspace-timer-repository";


export class DeleteTimerUseCase {
  constructor(private workspaceTimerRepository: WorkspaceTimerRepository) {}

  async execute(workspaceTimerId: number): Promise<boolean> {
    return await this.workspaceTimerRepository.delete(workspaceTimerId);
  }
}