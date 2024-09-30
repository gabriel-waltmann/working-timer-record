import { WorkspaceTimer, WorkspaceTimerStatus } from "../entities/workspace-timer";
import exceljs from 'exceljs';

export interface WorkspaceTimerRepository {
  start(workspaceId: number): Promise<WorkspaceTimer | null>;
  end(workspaceTimerId: number): Promise<WorkspaceTimer | null>;
  retrievesOne(workspaceTimerId: number): Promise<WorkspaceTimer | null>;
  retrieves(status?: WorkspaceTimerStatus): Promise<WorkspaceTimer[]>
  delete(workspaceTimerId: number): Promise<boolean>;
  export(startDateStr: string, endDateStr: string, workspaceId: number): Promise<exceljs  .Workbook | null>;
}
