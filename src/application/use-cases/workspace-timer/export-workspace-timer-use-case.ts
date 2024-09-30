import { WorkspaceTimerRepository } from "../../../domain/repositories/workspace-timer-repository";
import exceljs from 'exceljs';

export class ExportWorkspaceTimerUseCase {
  constructor(private workspaceTimerRepository: WorkspaceTimerRepository) {}

  async execute(startDateStr: string, endDateStr: string, workspaceId: number): Promise<exceljs.Workbook | null> {
    return await this.workspaceTimerRepository.export(startDateStr, endDateStr, workspaceId);
  }
}