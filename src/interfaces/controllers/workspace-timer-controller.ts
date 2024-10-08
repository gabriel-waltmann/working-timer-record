import { Request, Response } from 'express';
import { StartTimerUseCase } from '../../application/use-cases/workspace-timer/start-timer-use-case';
import { EndTimerUseCase } from '../../application/use-cases/workspace-timer/end-timer-use-case';
import { RetrievesOneTimerUseCase } from '../../application/use-cases/workspace-timer/retrieves-one-timer-use-case';
import { RetrievesTimerUseCase } from '../../application/use-cases/workspace-timer/retrieves-timer-use-case';
import { WorkspaceTimerStatus } from '../../domain/entities/workspace-timer';
import { DeleteTimerUseCase } from '../../application/use-cases/workspace-timer/delete-timer-use-case';
import { ExportWorkspaceTimerUseCase } from '../../application/use-cases/workspace-timer/export-workspace-timer-use-case';
import { CreateWorkspaceTimerUseCase } from '../../application/use-cases/workspace-timer/create-workspace-timer-use-case';
import { UpdateWorkspaceTimerUseCase } from '../../application/use-cases/workspace-timer/update-workspace-timer-use-case';

export class WorkspaceTimerController {
  constructor(
    private createWorkspaceTimer: CreateWorkspaceTimerUseCase,
    private updateWorkspaceTimer: UpdateWorkspaceTimerUseCase,
    private startTimerUseCase: StartTimerUseCase,
    private endTimerUseCase: EndTimerUseCase,
    private retrievesOneTimerUseCase: RetrievesOneTimerUseCase,
    private retrievesTimerUseCase: RetrievesTimerUseCase,
    private deleteTimerUseCase: DeleteTimerUseCase,
    private exportWorkspaceTimerUseCase: ExportWorkspaceTimerUseCase,
  ) {}
  
  async create(req: Request, res: Response): Promise<Response> {
    const { workspaceId, startDate, endDate } = req.body;

    if (!workspaceId) {
      return res.status(400).json({ error: 'Workspace ID is required' });
    }

    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Start date and end date are required' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      return res.status(400).json({ error: 'Start date must be before end date' });
    }

    const timer = await this.createWorkspaceTimer.execute(workspaceId, start, end);

    if (!timer) {
      return res.status(500).json({ error: 'Failed to create timer' });
    }

    return res.status(201).json({ timer });
  }

  async update(req: Request, res: Response): Promise<Response> {
    const workspaceTimerId = parseInt(req.params.id);

    if (isNaN(workspaceTimerId)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    const { workspaceId, startDate, endDate } = req.body;

    if (!workspaceTimerId) {
      return res.status(400).json({ error: 'Workspace timer ID is required' });
    }

    if (!workspaceId) {
      return res.status(400).json({ error: 'Workspace ID is required' });
    }

    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Start date and end date are required' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      return res.status(400).json({ error: 'Start date must be before end date' });
    }

    const timer = await this.updateWorkspaceTimer.execute(workspaceTimerId, workspaceId, start, end);

    if (!timer) {
      return res.status(404).json({ error: 'Timer not found' });
    }

    return res.status(200).json({ timer });
  }
  
  async start(req: Request, res: Response): Promise<Response> {
    const { workspaceId } = req.body;

    const timer = await this.startTimerUseCase.execute(workspaceId);

    if (!timer) {
      return res.status(500).json({ error: 'Failed to start timer' });
    }

    return res.status(200).json({ timer, workspaceId });
  }

  async end(req: Request, res: Response): Promise<Response> {
    const { workspaceTimerId } = req.body; 

    const timer = await this.endTimerUseCase.execute(workspaceTimerId);

    return timer 
      ? res.status(204).json(timer) 
      : res.status(404).json({ error: 'Timer not found' });
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
    const status = req.query.status   
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
    const { workspaceId, startDate, endDate } = req.body;

    if (!workspaceId) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Invalid date' });
    }

    const workbook = await this.exportWorkspaceTimerUseCase.execute(startDate, endDate, workspaceId);

    if (!workbook) {
      return res.status(404).json({ error: 'Internal server error' });
    }

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

    res.setHeader("Content-Disposition", "attachment; filename=timer.xlsx");

    return await workbook.xlsx.write(res);
  }
}

/* 
curl -sS --location \                 ✔ 
  --request POST 'http://localhost:3000/workspace-timer/export' \
  --header 'Content-Type: application/json' \
  --data-raw '{"startDate": "2024-10-01", "endDate": "2024-10-31", "workspaceId": 1727368941748}' \
  -o exported-file.xlsx
*/