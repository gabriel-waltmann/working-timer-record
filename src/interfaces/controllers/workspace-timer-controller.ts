import { Request, Response } from 'express';
import { RetrievesOneTimerUseCase } from '../../application/use-cases/workspace-timer/retrieves-one-timer-use-case';
import { RetrievesTimerUseCase } from '../../application/use-cases/workspace-timer/retrieves-timer-use-case';
import { WorkspaceTimerStatus } from '../../domain/entities/workspace-timer';
import { DeleteTimerUseCase } from '../../application/use-cases/workspace-timer/delete-timer-use-case';
import { ExportWorkspaceTimerUseCase } from '../../application/use-cases/workspace-timer/export-workspace-timer-use-case';
import { CreateWorkspaceTimerUseCase } from '../../application/use-cases/workspace-timer/create-workspace-timer-use-case';
import { UpdateWorkspaceTimerUseCase } from '../../application/use-cases/workspace-timer/update-workspace-timer-use-case';

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
    const workspace_id = parseInt(req.body.workspace_id);
    const start_time = req.body.start_time ? new Date(req.body.start_time) : undefined;
    const end_time = req.body.end_time ? new Date(req.body.end_time) : undefined;

    if (isNaN(workspace_id)) {
      return res.status(400).json({ error: 'Workspace ID is required' });
    }

    if (start_time && end_time && start_time > end_time) {
      return res.status(400).json({ error: 'Start date must be before end date' });
    }

    if (typeof start_time === 'string' && start_time === "Invalid Date") {
      return res.status(400).json({ error: 'Start date is invalid' });
    }

    if (typeof end_time === 'string' && end_time === "Invalid Date") {
      return res.status(400).json({ error: 'End date is invalid' });
    }

    const timer = await this.createWorkspaceTimer.execute(workspace_id, start_time, end_time);

    if (!timer) {
      return res.status(500).json({ error: 'Failed to create timer' });
    }

    return res.status(201).json({ timer });
  }

  async update(req: Request, res: Response): Promise<Response> {
    const workspace_timer_id = parseInt(req.params.id);
    const workspace_id = req.body.workspace_id ? parseInt(req.body.workspace_id) : undefined;
    const start_time = req.body.start_time ? new Date(req.body.start_time) : undefined;
    const end_time = req.body.end_time ? new Date(req.body.end_time) : undefined;

    if (isNaN(workspace_timer_id)) {
      return res.status(400).json({ error: 'Workspace timer ID is required' });
    }

    if (typeof start_time === 'string' && start_time === "Invalid Date") {
      return res.status(400).json({ error: 'Start date is invalid' });
    }

    if (typeof end_time === 'string' && end_time === "Invalid Date") {
      return res.status(400).json({ error: 'End date is invalid' });
    }

    if (end_time && start_time && start_time > end_time) {
      return res.status(400).json({ error: 'Start date must be before end date' });
    }

    const timer = await this.updateWorkspaceTimer.execute(workspace_timer_id, workspace_id, start_time, end_time);

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
    const status = typeof req.query.status === 'string' && req.query.status   
      ? parseInt(`${req.query.status}`) as WorkspaceTimerStatus 
      : undefined;

    const timers = await this.retrievesTimerUseCase.execute(status);
    
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

/* 
curl -sS --location \               
  --request POST 'http://localhost:3000/workspace-timer/export' \
  --header 'Content-Type: application/json' \
  --data-raw '{"startDate": "2024-10-01", "endDate": "2024-10-31", "workspaceId": 1727368941748}' \
  -o exported-file.xlsx
*/