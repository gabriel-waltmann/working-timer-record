import { WorkspaceTimer, WorkspaceTimerStatus } from "../entities/workspace-timer";

export interface WorkspaceTimerRepository {
  start(workspaceId: number): Promise<WorkspaceTimer | null>;
  end(workspaceTimerId: number): Promise<WorkspaceTimer | null>;
  retrievesOne(workspaceTimerId: number): Promise<WorkspaceTimer | null>;
  retrieves(status?: WorkspaceTimerStatus): Promise<WorkspaceTimer[]>
  delete(workspaceTimerId: number): Promise<boolean>;
}
