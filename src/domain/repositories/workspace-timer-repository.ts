import { WorkspaceTimer, WorkspaceTimerStatus } from "../entities/workspace-timer";
import exceljs from 'exceljs';

export interface WorkspaceTimerRepository {
  create(workspace_id: number, start_time?: string, end_time?: string): Promise<WorkspaceTimer | null>;
  update(workspace_timer_id: number, workspace_id?: number, start_time?: string, end_time?: string): Promise<WorkspaceTimer | null>;
  retrievesOne(workspace_timer_id: number): Promise<WorkspaceTimer | null>;
  retrieves(status?: WorkspaceTimerStatus): Promise<WorkspaceTimer[]>
  delete(workspace_timer_id: number): Promise<boolean>;
  export(start_time: Date, end_time: Date, workspace_id: number): Promise<exceljs.Workbook | null>;
}
