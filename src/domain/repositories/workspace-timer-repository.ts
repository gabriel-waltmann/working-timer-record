import { WorkspaceTimer, WorkspaceTimerStatus } from "../entities/workspace-timer";
import exceljs from 'exceljs';

export interface WorkspaceTimerRepository {
  create(workspaceId: number, start: Date, end: Date): Promise<WorkspaceTimer | null>;
  update(workspaceTimerId: number, workspaceId: number, start: Date, end: Date): Promise<WorkspaceTimer | null>;
  start(workspaceId: number): Promise<WorkspaceTimer | null>;
  end(workspaceTimerId: number): Promise<WorkspaceTimer | null>;
  retrievesOne(workspaceTimerId: number): Promise<WorkspaceTimer | null>;
  retrieves(status?: WorkspaceTimerStatus): Promise<WorkspaceTimer[]>
  delete(workspaceTimerId: number): Promise<boolean>;
  export(startDateStr: string, endDateStr: string, workspaceId: number): Promise<exceljs  .Workbook | null>;
}
