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
    const { workspace_id, start_time, end_time, time_zone } = req.body;
    const dateUtils = new DateUtils();

    if (!workspace_id) {
      return res.status(400).json({ error: 'Workspace ID is required' });
    }

    if (isNaN(Number(workspace_id))) {
      return res.status(400).json({ error: 'Invalid workspace ID' });
    }

    if (!time_zone) {
      return res.status(400).json({ error: 'Time zone is required' });
    }

    if (time_zone !== "America/Sao_Paulo" && time_zone !== "UTC") {
      return res.status(400).json({ error: 'Invalid time zone' });
    }

    if (!start_time) {
      return res.status(400).json({ error: 'Start date is required' });
    }

    let start_time_iso = null;
    if (start_time && start_time === "auto") start_time_iso = dateUtils.getCurrentUTC();
    else if (start_time) start_time_iso = dateUtils.BRtoISO(start_time, time_zone);

    if (!start_time_iso) {
      return res.status(400).json({ error: 'Start date is invalid' });
    }

    let end_time_iso = undefined;
    if (end_time && end_time === "auto") end_time_iso = dateUtils.getCurrentUTC();
    else if (end_time) end_time_iso = dateUtils.BRtoISO(end_time, time_zone);

    if (end_time && !end_time_iso) {
      return res.status(400).json({ error: 'Invalid end date' });
    }

    if (start_time_iso && end_time_iso && new Date(start_time_iso) > new Date(end_time_iso)) {
      return res.status(400).json({ error: 'Start date must be before end date' });
    }

    const timer = await this.createWorkspaceTimer.execute(workspace_id, start_time_iso, end_time_iso);

    if (!timer) {
      return res.status(500).json({ error: 'Failed to create timer' });
    }

    return res.status(201).json({ timer });
  }

  async update(req: Request, res: Response): Promise<Response> {
    const { workspace_id, start_time, end_time, time_zone } = req.body;
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

    if (!time_zone) {
      return res.status(400).json({ error: 'Time zone is required' });
    }

    if (time_zone !== "America/Sao_Paulo" && time_zone !== "UTC") {
      return res.status(400).json({ error: 'Invalid time zone' });
    }

    let start_time_iso = undefined;
    if (start_time === "auto") start_time_iso = dateUtils.getCurrentUTC();
    else if (start_time) start_time_iso = dateUtils.BRtoISO(start_time, time_zone);

    let end_time_iso = undefined;
    if (end_time && end_time === "auto") end_time_iso = dateUtils.getCurrentUTC();
    else if (end_time) end_time_iso = dateUtils.BRtoISO(end_time, time_zone);
    if (end_time && !end_time_iso) {
      return res.status(400).json({ error: 'Invalid end date' });
    }

    const timer = await this.updateWorkspaceTimer.execute(workspace_timer_id_number, workspace_id, start_time_iso, end_time_iso);

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