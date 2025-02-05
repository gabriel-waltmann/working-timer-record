import { Request, Response } from 'express';
import { RetrievesOneTimerUseCase } from '../../application/use-cases/workspace-timer/retrieves-one-timer-use-case';
import { RetrievesTimerUseCase } from '../../application/use-cases/workspace-timer/retrieves-timer-use-case';
import { WorkspaceTimerStatus } from '../../domain/entities/workspace-timer';
import { DeleteTimerUseCase } from '../../application/use-cases/workspace-timer/delete-timer-use-case';
import { ExportWorkspaceTimerUseCase } from '../../application/use-cases/workspace-timer/export-workspace-timer-use-case';
import { CreateWorkspaceTimerUseCase } from '../../application/use-cases/workspace-timer/create-workspace-timer-use-case';
import { UpdateWorkspaceTimerUseCase } from '../../application/use-cases/workspace-timer/update-workspace-timer-use-case';
import DateUtils from '../../shared/utils/date';

export class WorkspaceTimerController {
  constructor(
    readonly createWorkspaceTimer: CreateWorkspaceTimerUseCase,
    readonly updateWorkspaceTimer: UpdateWorkspaceTimerUseCase,
    readonly retrievesOneTimerUseCase: RetrievesOneTimerUseCase,
    readonly retrievesTimerUseCase: RetrievesTimerUseCase,
    readonly deleteTimerUseCase: DeleteTimerUseCase,
    readonly exportWorkspaceTimerUseCase: ExportWorkspaceTimerUseCase,
  ) {}
  
  async create(req: Request, res: Response): Promise<Response> {
    const { workspace_id, start_time, end_time } = req.body;

    if (!workspace_id) {
      return res.status(400).json({ error: 'Workspace ID is required' });
    }

    if (isNaN(Number(workspace_id))) {
      return res.status(400).json({ error: 'Invalid workspace ID' });
    }

    if (!start_time) {
      return res.status(400).json({ error: 'Start date is required' });
    }

    const startTime = new Date(start_time);
    if (isNaN(startTime?.getTime())) {
      return res.status(400).json({ error: 'Start date is invalid' });
    }

    if (end_time) {
      const endTime = new Date(end_time);

      if (isNaN(endTime?.getTime())) {
        return res.status(400).json({ error: 'Invalid end date' });
      }

      if (startTime > endTime) {
        return res.status(400).json({ error: 'Start date must be before end date' });
      }
    }

    const timer = await this.createWorkspaceTimer.execute(
      workspace_id, 
      start_time, 
      end_time
    );

    if (!timer) {
      return res.status(500).json({ error: 'Failed to create timer' });
    }

    return res.status(201).json({ timer });
  }

  async update(req: Request, res: Response): Promise<Response> {
    const { workspace_id, start_time, end_time } = req.body;
    const { workspace_timer_id } = req.params;
    const dateUtils = new DateUtils();

    if (!workspace_timer_id) {
      return res.status(400).json({ error: 'Workspace timer ID is required' });
    }

    const workspace_timer_id_number = Number(workspace_timer_id);
    if (isNaN(workspace_timer_id_number)) {
      return res.status(400).json({ error: 'Invalid workspace timer ID' });
    }

    if (workspace_id && isNaN(Number(workspace_id))) {
      return res.status(400).json({ error: 'Invalid workspace ID' });
    }

    if (!start_time) {
      return res.status(400).json({ error: 'Start date is required' });
    }

    const startTime = new Date(start_time);
    if (isNaN(startTime?.getTime())) {
      return res.status(400).json({ error: 'Start date is invalid' });
    }

    if (end_time) {
      const endTime = new Date(end_time);

      if (isNaN(endTime?.getTime())) {
        return res.status(400).json({ error: 'Invalid end date' });
      }

      if (startTime > endTime) {
        return res.status(400).json({ error: 'Start date must be before end date' });
      }
    }

    const timer = await this.updateWorkspaceTimer.execute(
      workspace_timer_id_number, 
      workspace_id, 
      start_time, 
      end_time
    );

    if (!timer) {
      return res.status(404).json({ error: 'Timer not found' });
    }

    return res.status(200).json({ timer });
  }

  async retrievesOne(req: Request, res: Response): Promise<Response> {
    const id = parseInt(req.params.id);

    const timer = await this.retrievesOneTimerUseCase.execute(id);
    
    if (!timer) {
      return res.status(404).json({ error: 'Timer not found' });
    }

    return res.status(200).json({ timer });
  }

  async retrieves(req: Request, res: Response): Promise<Response> {
    const workspaceId = req.query.workspace_id ? +req.query.workspace_id : 0;

    const status = typeof req.query.status === 'string' && req.query.status   
      ? parseInt(`${req.query.status}`) as WorkspaceTimerStatus 
      : undefined;

    const timers = await this.retrievesTimerUseCase.execute(workspaceId, status);
    
    return res.status(200).json({ timers });
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    const deleted = await this.deleteTimerUseCase.execute(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Timer not found' });
    }

    return res.status(204).json({ message: 'Timer deleted' });
  }

  async export(req: Request, res: Response): Promise<Response | void> {
    const { workspace_id, start_time, end_time } = req.body;

    if (!workspace_id) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    if (!start_time || !end_time) {
      return res.status(400).json({ error: 'Invalid date' });
    }

    const workbook = await this.exportWorkspaceTimerUseCase.execute(start_time, end_time, workspace_id);

    if (!workbook) {
      return res.status(404).json({ error: 'Internal server error' });
    }

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

    res.setHeader("Content-Disposition", "attachment; filename=timer.xlsx");

    return await workbook.xlsx.write(res);
  }
}
