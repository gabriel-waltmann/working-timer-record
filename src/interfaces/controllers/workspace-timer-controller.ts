import { Request, Response } from 'express';
import { StartTimerUseCase } from '../../application/use-cases/workspace-timer/start-timer-use-case';
import { EndTimerUseCase } from '../../application/use-cases/workspace-timer/end-timer-use-case';
import { RetrievesOneTimerUseCase } from '../../application/use-cases/workspace-timer/retrieves-one-timer-use-case';
import { RetrievesTimerUseCase } from '../../application/use-cases/workspace-timer/retrieves-timer-use-case';
import { WorkspaceTimerStatus } from '../../domain/entities/workspace-timer';
import { DeleteTimerUseCase } from '../../application/use-cases/workspace-timer/delete-timer-use-case';

export class WorkspaceTimerController {
  constructor(
    private startTimerUseCase: StartTimerUseCase,
    private endTimerUseCase: EndTimerUseCase,
    private retrievesOneTimerUseCase: RetrievesOneTimerUseCase,
    private retrievesTimerUseCase: RetrievesTimerUseCase,
    private deleteTimerUseCase: DeleteTimerUseCase,
  ) {}

  async start(req: Request, res: Response): Promise<void> {
    const { workspaceId } = req.body;

    const timer = await this.startTimerUseCase.execute(workspaceId);

    if (!timer) {
      res.status(500).json({ error: 'Failed to start timer' });
      return;
    }

    res.status(200).json({ timer, workspaceId });
  }

  async end(req: Request, res: Response): Promise<void> {
    const { workspaceId } = req.body; 

    await this.endTimerUseCase.execute(workspaceId);

    res.status(204).json({ message: 'Timer ended' });
  }

  async retrievesOne(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id);

    const timer = await this.retrievesOneTimerUseCase.execute(id);
    
    if (!timer) {
      res.status(404).json({ error: 'Timer not found' });
      return;
    }

    res.status(200).json({ timer });
  }

  async retrieves(req: Request, res: Response): Promise<void> {
    const status = req.query.status   
      ? parseInt(`${req.query.status}`) as WorkspaceTimerStatus 
      : undefined;

    const timers = await this.retrievesTimerUseCase.execute(status);
    
    res.status(200).json({ timers });
  }

  async delete(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid ID' });
      return;
    }

    const deleted = await this.deleteTimerUseCase.execute(id);

    if (!deleted) {
      res.status(404).json({ error: 'Timer not found' });
      return;
    }

    res.status(204).json({ message: 'Timer deleted' });
  }
}
