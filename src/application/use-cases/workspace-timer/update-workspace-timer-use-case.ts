import { WorkspaceTimer } from "../../../domain/entities/workspace-timer";
import { WorkspaceTimerRepository } from "../../../domain/repositories/workspace-timer-repository";

export class UpdateWorkspaceTimerUseCase {
  constructor(readonly workspaceTimerRepository: WorkspaceTimerRepository) {}

  async execute(
    workspace_timer_id: number,
    workspace_id?: number,
    start_time?: string,
    end_time?: string
  ): Promise<WorkspaceTimer | null> {
    return await this.workspaceTimerRepository.update(
      workspace_timer_id,
      workspace_id,
      start_time,
      end_time
    );
  }
}
