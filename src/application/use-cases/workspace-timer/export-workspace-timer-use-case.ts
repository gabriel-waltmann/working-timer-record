import { WorkspaceTimerRepository } from "../../../domain/repositories/workspace-timer-repository";
import exceljs from 'exceljs';

export class ExportWorkspaceTimerUseCase {
  constructor(readonly workspaceTimerRepository: WorkspaceTimerRepository) {}

  async execute(start_time: Date, end_time: Date, workspaceId: number): Promise<exceljs.Workbook | null> {
    return await this.workspaceTimerRepository.export(start_time, end_time, workspaceId);
  }
}